import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, fullName } = createUserDto;

    await this.ensureEmailNotInUse(email);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: await this.hashPassword(password),
        fullName,
      },
    });

    const accessToken = await this.getMockAuthToken();
    await this.openMockAccount(accessToken);

    return { message: 'User registered successfully', user };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await this.comparePasswords(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return { id: user.id, email: user.email };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
    const payload = this.createJwtPayload(user);

    const token = this.generateJwtToken(payload);

    return { access_token: token };
  }

  private async getMockAuthToken(): Promise<string> {
    const clientId = 'test';
    const clientSecret = 'secret';
    const response = await lastValueFrom(
      this.httpService.post('http://localhost:8080/mock-auth/token', {
        client_id: clientId,
        client_secret: clientSecret,
      }),
    );

    return response.data.access_token;
  }

  private async openMockAccount(accessToken: string) {
    const response = await lastValueFrom(
      this.httpService.post(
        'http://localhost:8080/mock-account/open',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    if (response.data.status !== 'ok') {
      throw new Error('Failed to open mock account');
    }
  }

  private async ensureEmailNotInUse(email: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
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
