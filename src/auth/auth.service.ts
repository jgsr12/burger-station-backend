import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
      sameSite: 'lax',
      secure: false,
    });

    return { message: 'Login exitoso', token };
  }

  logout(res: Response) {
    res.clearCookie('jwt');
    return { message: 'Sesión cerrada' };
  }
}
