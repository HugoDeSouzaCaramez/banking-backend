import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MockAuthService } from '../mock-auth/mock-auth.service';
import { TransferHttpHelper } from './helpers/transfer-http.helper';
import { AccountRepository } from 'src/account/repository/account.repository';
import { TransferRepository } from './repository/transfer.repository';
import { TransferDto } from './dto/transfer.dto';
import { Transfer } from '@prisma/client';

@Injectable()
export class TransferService {
  private readonly transferUrl: string;

  constructor(
    private readonly mockAuthService: MockAuthService,
    private readonly transferHttpHelper: TransferHttpHelper,
    private readonly accountRepository: AccountRepository,
    private readonly transferRepository: TransferRepository,
    private readonly configService: ConfigService,
  ) {
    this.transferUrl = this.configService.get<string>('MOCK_TRANSFER_URL');
  }

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
