import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { TransferDto } from './dto/transfer.dto';
import { MockAuthService } from '../mock-auth/mock-auth.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TransferService {
    constructor(
        private readonly httpService: HttpService,
        private readonly mockAuthService: MockAuthService
    ) {}

    async makeTransfer(transferDto: TransferDto) {
        const url = 'http://localhost:8080/mock-transfer';

        try {
            const token = await this.mockAuthService.authenticate();

            const response = await lastValueFrom(
                this.httpService.post(url, transferDto, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            );
            return response.data;
        } catch (error) {
            throw new BadRequestException('Transfer failed: ' + (error.response?.data?.message || 'Unknown error'));
        }
    }
}
