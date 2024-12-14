import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'CPF do usuário no formato XXX.XXX.XXX-XX',
    example: '123.456.789-01',
  })
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: 'CPF must be in the format XXX.XXX.XXX-XX' })
  cpf: string;

  @ApiProperty({
    description: 'Senha do usuário com pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais',
    example: 'P@ssw0rd!',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  @Matches(/(?=.*[@$!%*?&])/, { message: 'Password must contain at least one special character (@, $, !, %, *, ?, &)' })
  password: string;

  @ApiProperty({ description: 'Nome completo do usuário', example: 'João da Silva' })
  @IsString()
  fullName: string;
}
