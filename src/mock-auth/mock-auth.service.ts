import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MockAuthService {
    private accessToken: string;

    constructor(private readonly httpService: HttpService) {}

    async authenticate() {
        if (this.accessToken) return this.accessToken;

        const url = 'http://localhost:8080/mock-auth/token';
        const payload = { client_id: 'test', client_secret: 'secret' };

        try {
            const response = await lastValueFrom(
                this.httpService.post(url, payload)
            );
            this.accessToken = response.data.access_token;
            return this.accessToken;
        } catch (error) {
            throw new UnauthorizedException('Authentication with mock-backend failed');
        }
    }
}
