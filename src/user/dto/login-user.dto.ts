import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'CPF do usuário no formato XXX.XXX.XXX-XX',
    example: '123.456.789-01',
  })
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: 'CPF must be in the format XXX.XXX.XXX-XX' })
  cpf: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'P@ssw0rd!',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
