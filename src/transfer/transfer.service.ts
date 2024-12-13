import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { TransferDto } from './dto/transfer.dto';
import { MockAuthService } from '../mock-auth/mock-auth.service';
import { TransferHttpHelper } from './helpers/transfer-http.helper';
import { PrismaService } from '../prisma/prisma.service';
import { Transfer } from '@prisma/client';

@Injectable()
export class TransferService {
  private readonly transferUrl = 'http://localhost:8080/mock-transfer';

  constructor(
    private readonly mockAuthService: MockAuthService,
    private readonly transferHttpHelper: TransferHttpHelper,
    private readonly prisma: PrismaService,
  ) {}

  async makeTransfer(userId: number, transferDto: TransferDto): Promise<Transfer> {
    const { originAccount, recipientAccount, amount } = transferDto;
  
    // Verifica se a conta de origem pertence ao usuário autenticado
    const userAccount = await this.prisma.account.findUnique({
      where: { userId },
    });
  
    if (!userAccount || userAccount.accountNumber !== originAccount) {
      throw new BadRequestException('Invalid origin account for the user');
    }
  
    // Verifica se o usuário existe
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Realiza a transferência via HTTP
    try {
      const token = await this.mockAuthService.authenticate();
      await this.transferHttpHelper.postTransfer(this.transferUrl, token, transferDto);
    } catch (error) {
      throw new BadRequestException(
        'Transfer failed: ' + (error.response?.data?.message || 'Unknown error'),
      );
    }
  
    // Registra a transferência no banco de dados
    return this.prisma.transfer.create({
      data: {
        originAccount, // Inclui a conta de origem
        recipientAccount,
        amount,
        userId,
      },
    });
    
  }
  

  async getUserTransfers(userId: number): Promise<Transfer[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { transfers: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.transfers;
  }
}
