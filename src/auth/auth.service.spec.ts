import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../user/repository/user.repository';
import { HttpService } from '@nestjs/axios';
import { MockAuthService } from '../mock-auth/mock-auth.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { of } from 'rxjs';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let configService: ConfigService;
  let httpService: HttpService;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: { sign: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: UserRepository, useValue: { createUser: jest.fn(), findUserByCPF: jest.fn(), createAccount: jest.fn(), findAccountByUserId: jest.fn() } },
        { provide: HttpService, useValue: { post: jest.fn() } },
        { provide: MockAuthService, useValue: { getAuthToken: jest.fn() } },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
    mockAuthService = module.get<MockAuthService>(MockAuthService);
  });

  describe('register', () => {
    it('should successfully register a user and return account details', async () => {
      const createUserDto: CreateUserDto = { cpf: '123.456.789-01', password: 'password', fullName: 'Foo Bar' };
      const mockUser = {
        id: 1,
        cpf: '123.456.789-01',
        password: 'hashedPassword',
        fullName: 'Foo Bar',
        createdAt: new Date(),
      };
      const mockAccount = {
        id: 1,
        createdAt: new Date(),
        accountNumber: 'ACCT-1-1234567890',
        userId: 1,
      };

      jest.spyOn(userRepository, 'findUserByCPF').mockResolvedValue(null);
      jest.spyOn(userRepository, 'createUser').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'createAccount').mockResolvedValue(undefined);
      jest.spyOn(userRepository, 'findAccountByUserId').mockResolvedValue(mockAccount);
      jest.spyOn(mockAuthService, 'getAuthToken').mockResolvedValue('mockToken');
      jest.spyOn(httpService, 'post').mockReturnValue(
        of({
          data: { status: 'ok' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        } as any),
      );

      const result = await authService.register(createUserDto);

      expect(result).toEqual({
        message: 'User registered successfully',
        accountNumber: mockAccount.accountNumber,
      });
    });

    it('should throw ConflictException if CPF is already in use', async () => {
      const createUserDto: CreateUserDto = { cpf: '123.456.789-01', password: 'password', fullName: 'Foo Bar' };
      const mockUser = {
        id: 1,
        cpf: '123.456.789-01',
        password: 'hashedPassword',
        fullName: 'Foo Bar',
        createdAt: new Date(),
      };

      jest.spyOn(userRepository, 'findUserByCPF').mockResolvedValue(mockUser);

      await expect(authService.register(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('validateUser', () => {
    it('should return user details if validation succeeds', async () => {
      const mockUser = {
        id: 1,
        cpf: '123.456.789-01',
        password: 'hashedPassword',
        fullName: 'Foo Bar',
        createdAt: new Date(),
      };
      jest.spyOn(userRepository, 'findUserByCPF').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('123.456.789-01', 'password');

      expect(result).toEqual({ id: mockUser.id, cpf: mockUser.cpf });
    });

    it('should throw UnauthorizedException if validation fails', async () => {
      jest.spyOn(userRepository, 'findUserByCPF').mockResolvedValue(null);

      await expect(authService.validateUser('123.456.789-01', 'password')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      const mockUser = { id: 1, cpf: '123.456.789-01', fullName: 'Foo Bar', createdAt: new Date() };
      const loginUserDto: LoginUserDto = { cpf: '123.456.789-01', password: 'password' };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockToken');

      const result = await authService.login(loginUserDto);

      expect(result).toEqual({ access_token: 'mockToken' });
    });
  });
});
