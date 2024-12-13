import { IsString, MinLength, Matches } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: 'CPF must be in the format XXX.XXX.XXX-XX' })
  cpf: string;

  @IsString()
  @MinLength(8)
  password: string;
}
