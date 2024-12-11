import { IsString, IsNumber, IsPositive } from 'class-validator';

export class TransferDto {
    @IsString()
    recipientAccount: string;

    @IsNumber()
    @IsPositive()
    amount: number;
}
