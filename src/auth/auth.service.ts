import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../user/repository/user.repository';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { MockAuthService } from '../mock-auth/mock-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly httpService: HttpService,
    private readonly mockAuthService: MockAuthService
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { cpf, password, fullName } = createUserDto;

    await this.ensureCPFNotInUse(cpf);

    const user = await this.userRepository.createUser(cpf, password, fullName);

    const accountNumber = `ACCT-${user.id}-${Date.now()}`;
    await this.userRepository.createAccount(user.id, accountNumber);

    const accessToken = await this.getMockAuthToken();
    await this.openMockAccount(accessToken);

    const account = await this.userRepository.findAccountByUserId(user.id);

    return {
      message: 'User registered successfully',
      accountNumber: account.accountNumber,
    };
  }

  async validateUser(cpf: string, password: string) {
    const user = await this.userRepository.findUserByCPF(cpf);

    if (!user || !(await this.comparePasswords(password, user.password))) {
      throw new UnauthorizedException('Invalid cpf or password');
    }

    return { id: user.id, cpf: user.cpf };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto.cpf, loginUserDto.password);
    const payload = this.createJwtPayload(user);

    const token = this.generateJwtToken(payload);

    return { access_token: token };
  }

  private async getMockAuthToken(): Promise<string> {
    return this.mockAuthService.getAuthToken();
  }

  private async openMockAccount(accessToken: string) {
    const accountUrl = this.configService.get<string>('MOCK_ACCOUNT_URL');
    const token = await this.mockAuthService.getAuthToken();
    const response = await lastValueFrom(
      this.httpService.post(
        accountUrl,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
    );
  
    if (response.data.status !== 'ok') {
      throw new Error('Failed to open mock account');
    }
  }

  private async ensureCPFNotInUse(cpf: string) {
    const existingUser = await this.userRepository.findUserByCPF(cpf);
    if (existingUser) {
      throw new ConflictException('CPF already in use');
    }
  }

  private async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private createJwtPayload(user: any) {
    return { cpf: user.cpf, sub: user.id };
  }

  private generateJwtToken(payload: any) {
    const secret = this.configService.get<string>('JWT_SECRET');
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: '7m',
    });
  }
}
