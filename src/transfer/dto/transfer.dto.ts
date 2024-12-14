import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class TransferDto {
  @ApiProperty({ description: 'Conta de origem', example: 'ACCT-12345-67890' })
  @IsString()
  @IsNotEmpty()
  originAccount: string;

  @ApiProperty({ description: 'Conta do destinatário', example: 'ACCT-98765-43210' })
  @IsString()
  @IsNotEmpty()
  recipientAccount: string;

  @ApiProperty({ description: 'Valor da transferência', example: 500.75 })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;
}
