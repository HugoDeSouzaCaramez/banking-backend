import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MockAuthService } from '../mock-auth/mock-auth.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

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
    this.ensureEmailNotInUse(createUserDto.email);
    const user = await this.usersService.createUser(
      createUserDto.email,
      createUserDto.password,
      createUserDto.fullName
    );

    const token = await this.mockAuthService.getMockToken();
    await this.createMockBackendAccount(token);

    return { message: 'User registered successfully' };
  }

  async validateUser(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    await this.ensureValidPassword(password, user.password);
  
    return { id: user.id, email: user.email };
  }
 
  async login(user: any) {
    const payload = this.createJwtPayload(user);
    const token = this.generateJwtToken(payload);

    return { access_token: token };
  }

  private ensureEmailNotInUse(email: string) {
    const existingUser = this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }
  }

  private async getUserByEmail(email: string) {
    const user = await this.usersService.findByEmail(email); // Adiciona await.
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  private async ensureValidPassword(password: string, hashedPassword: string) {
    const isPasswordValid = await this.usersService.validatePassword(
      password,
      hashedPassword
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  private async createMockBackendAccount(token: string) {
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
        throw new UnauthorizedException(
          'Failed to create account in mock-backend'
        );
      }
    } catch (error) {
      throw new UnauthorizedException(
        'Failed to communicate with mock-backend'
      );
    }
  }
  
  private createJwtPayload(user: any) {
    return { email: user.email, sub: user.id };
  }

  private generateJwtToken(payload: any) {
    const secret = this.configService.get<string>('JWT_SECRET');
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: '7m',
    });
  }
}
