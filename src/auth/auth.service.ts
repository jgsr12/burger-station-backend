import {
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { Response } from 'express';

import { UsersService } from '../users/users.service';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  private resetTokens = new Map<string, { userId: number; expiresAt: Date }>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private sendgridService: SendgridService,
  ) {}

  async register(dto: RegisterDto) {
    const userExists = await this.usersService.findByEmailOrNull(dto.email);
    if (userExists) {
      throw new UnauthorizedException('Email ya registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.usersService.create({
      ...dto,
      password: hashedPassword,
    });
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return { message: 'Login exitoso', token };
  }

  logout(res: Response) {
    res.clearCookie('jwt');
    return { message: 'Sesión cerrada' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmailOrNull(dto.email);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const token = uuidv4();
    const expiresAt = dayjs().add(1, 'hour').toDate();
    this.resetTokens.set(token, { userId: user.id, expiresAt });

    await this.sendgridService.sendEmail({
      to: user.email,
      subject: 'Recuperación de contraseña - The Burger Station',
      text: `Hola ${user.first_name},\n\nUtiliza el siguiente token para restablecer tu contraseña:\n\n${token}\n\nEste token expirará en 1 hora.`,
    });

    return { message: 'Se ha enviado un correo con instrucciones para recuperar tu contraseña' };
  }

  async resetPassword(token: string, newPassword: string) {
    const record = this.resetTokens.get(token);
    if (!record || new Date() > record.expiresAt) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const user = await this.usersService.findOne(record.userId);
    user.password = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user.id, { password: user.password });

    this.resetTokens.delete(token);

    return { message: 'Contraseña actualizada exitosamente' };
  }
}
