import { IsString, IsInt } from 'class-validator';

export class CreateAccountDto {
  @IsInt()
  userId: number;

  @IsString()
  accountNumber: string;
}
