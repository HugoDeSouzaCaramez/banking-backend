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
  
    const userAccount = await this.prisma.account.findUnique({
      where: { userId },
    });
  
    if (!userAccount || userAccount.accountNumber !== originAccount) {
      throw new BadRequestException('Invalid origin account for the user');
    }
  
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    try {
      const token = await this.mockAuthService.authenticate();
      await this.transferHttpHelper.postTransfer(this.transferUrl, token, transferDto);
    } catch (error) {
      throw new BadRequestException(
        'Transfer failed: ' + (error.response?.data?.message || 'Unknown error'),
      );
    }
  
    return this.prisma.transfer.create({
      data: {
        originAccount,
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
