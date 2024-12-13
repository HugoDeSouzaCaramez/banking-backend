import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class TransferDto {
  @IsString()
  @IsNotEmpty()
  originAccount: string;

  @IsString()
  @IsNotEmpty()
  recipientAccount: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;
}
