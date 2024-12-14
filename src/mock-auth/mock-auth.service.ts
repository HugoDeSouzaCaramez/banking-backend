import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MockAuthService {
  private accessToken: string;
  private tokenExpiry: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getAuthToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.accessToken;
    }

    return this.authenticate();
  }

  private async authenticate(): Promise<string> {
    const url = this.configService.get<string>('MOCK_AUTH_URL');
    const clientId = this.configService.get<string>('MOCK_CLIENT_ID');
    const clientSecret = this.configService.get<string>('MOCK_CLIENT_SECRET');

    const payload = { client_id: clientId, client_secret: clientSecret };

    try {
      const response = await lastValueFrom(this.httpService.post(url, payload));
      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;
      return this.accessToken;
    } catch (error) {
      throw new UnauthorizedException('Authentication with mock-backend failed');
    }
  }

  private isTokenValid(): boolean {
    return this.accessToken && this.tokenExpiry > Date.now();
  }
}
