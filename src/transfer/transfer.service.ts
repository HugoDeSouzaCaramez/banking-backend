import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { TransferDto } from './dto/transfer.dto';
import { MockAuthService } from '../mock-auth/mock-auth.service';
import { TransferHttpHelper } from './helpers/transfer-http.helper';
import { AccountRepository } from 'src/account/repository/account.repository';
import { TransferRepository } from './repository/transfer.repository';
import { Transfer } from '@prisma/client';

@Injectable()
export class TransferService {
  private readonly transferUrl = 'http://localhost:8080/mock-transfer';

  constructor(
    private readonly mockAuthService: MockAuthService,
    private readonly transferHttpHelper: TransferHttpHelper,
    private readonly accountRepository: AccountRepository,
    private readonly transferRepository: TransferRepository,
  ) {}

  async makeTransfer(userId: number, transferDto: TransferDto): Promise<Transfer> {
    const { originAccount, recipientAccount, amount } = transferDto;
  
    const userAccount = await this.accountRepository.findAccountByUserId(userId);
  
    if (!userAccount || userAccount.accountNumber !== originAccount) {
      throw new BadRequestException('Invalid origin account for the user');
    }
  
    try {
      const token = await this.mockAuthService.getAuthToken();
      await this.transferHttpHelper.postTransfer(this.transferUrl, token, transferDto);
    } catch (error) {
      throw new BadRequestException(
        'Transfer failed: ' + (error.response?.data?.message || 'Unknown error'),
      );
    }
  
    return this.transferRepository.createTransfer(originAccount, recipientAccount, amount, userId);
  }
  
}
