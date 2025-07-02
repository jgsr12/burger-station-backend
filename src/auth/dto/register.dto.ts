import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiProperty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  first_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  last_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  phone: string;
}
