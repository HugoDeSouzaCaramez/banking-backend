import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MockAuthService } from '../mock-auth/mock-auth.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mockAuthService: MockAuthService,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    const user = await this.usersService.createUser(
      createUserDto.email,
      createUserDto.password,
      createUserDto.fullName
    );

    const token = await this.mockAuthService.getMockToken();

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          'http://localhost:8080/mock-account/open',
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );

      if (response.data.status !== 'ok') {
        throw new UnauthorizedException('Failed to create account in mock-backend');
      }
    } catch (error) {
      throw new UnauthorizedException('Failed to communicate with mock-backend');
    }

    return { message: 'User registered successfully' };
  }

  async validateUser(email: string, password: string) {
    const user = this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.usersService.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return { id: user.id, email: user.email };
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const secret = this.configService.get<string>('JWT_SECRET');
    return {
      access_token: this.jwtService.sign(payload, {
        secret,
        expiresIn: '7m',
      }),
    };
  }
}
