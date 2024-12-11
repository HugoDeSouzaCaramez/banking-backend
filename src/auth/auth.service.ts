import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MockAuthService } from '../mock-auth/mock-auth.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private users = [];

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mockAuthService: MockAuthService,
    private readonly httpService: HttpService
  ) {}

  async register(createUserDto: CreateUserDto) {  
    const emailExists = this.users.some((u) => u.email === createUserDto.email);
    if (emailExists) {
      throw new UnauthorizedException('Email already in use');
    }
  
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
  
    const user = {
      id: this.users.length + 1,
      email: createUserDto.email,
      password: hashedPassword,
      fullName: createUserDto.fullName,
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
  
    return { message: 'User registered successfully' };
  }
  

  async validateUser(email: string, password: string) {
    const user = this.users.find((u) => u.email === email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
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
