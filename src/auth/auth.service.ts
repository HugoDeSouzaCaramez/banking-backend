import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MockAuthService } from '../mock-auth/mock-auth.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private users = [];

  constructor(
    private readonly jwtService: JwtService,
    private readonly mockAuthService: MockAuthService,
    private readonly httpService: HttpService
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = {
      id: this.users.length + 1,
      ...createUserDto,
    };
    this.users.push(user);

    const token = await this.mockAuthService.getMockToken();

    try {
        const response = await lastValueFrom(
        this.httpService.post('http://localhost:8080/mock-account/open', {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      if (response.data.status !== 'ok') {
        throw new UnauthorizedException('Failed to create account in mock-backend');
      }
    } catch (error) {
      throw new UnauthorizedException('Failed to communicate with mock-backend');
    }

    return { message: 'User registered successfully', user };
  }

  async validateUser(email: string, password: string) {
    const user = this.users.find((u) => u.email === email && u.password === password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return { id: user.id, email: user.email };
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
