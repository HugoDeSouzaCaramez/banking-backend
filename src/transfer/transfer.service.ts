import { Injectable, BadRequestException } from '@nestjs/common';
import { TransferDto } from './dto/transfer.dto';
import { MockAuthService } from '../mock-auth/mock-auth.service';
import { TransferHttpHelper } from './helpers/transfer-http.helper';

@Injectable()
export class TransferService {
  private readonly transferUrl = 'http://localhost:8080/mock-transfer';

  constructor(
    private readonly mockAuthService: MockAuthService,
    private readonly transferHttpHelper: TransferHttpHelper,
  ) {}

  async makeTransfer(transferDto: TransferDto) {
    try {
        const token = await this.mockAuthService.authenticate();
        return await this.transferHttpHelper.postTransfer(
        this.transferUrl,
        token,
        transferDto
      );
    } catch (error) {
      throw new BadRequestException(
        'Transfer failed: ' + (error.response?.data?.message || 'Unknown error')
      );
    }
  }
}
