import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TransferHttpHelper {
  constructor(private readonly httpService: HttpService) {}

  async postTransfer(url: string, token: string, transferDto: any) {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await lastValueFrom(
      this.httpService.post(url, transferDto, { headers })
    );
    return response.data;
  }
}
