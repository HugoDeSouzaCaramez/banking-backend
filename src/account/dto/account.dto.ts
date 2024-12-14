import { ApiProperty } from '@nestjs/swagger';

export class AccountDto {
  @ApiProperty({ description: 'ID único da conta', example: 1 })
  id: number;

  @ApiProperty({ description: 'Número da conta', example: 'ACCT-12345-67890' })
  accountNumber: string;

  @ApiProperty({ description: 'ID do usuário associado à conta', example: 101 })
  userId: number;
}
