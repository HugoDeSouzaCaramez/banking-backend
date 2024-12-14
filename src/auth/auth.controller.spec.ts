import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call AuthService.register with correct data', async () => {
      const createUserDto: CreateUserDto = {
        cpf: '123.456.789-00',
        password: 'StrongP@ssw0rd',
        fullName: 'Foo Bar',
      };

      const expectedResponse = {
        message: 'User registered successfully',
        accountNumber: 'ACCT-1-1234567890',
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await authController.register(createUserDto);

      expect(authService.register).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw ConflictException if the CPF is already in use', async () => {
      const createUserDto: CreateUserDto = {
        cpf: '123.456.789-00',
        password: 'StrongP@ssw0rd',
        fullName: 'Foo Bar',
      };

      mockAuthService.register.mockRejectedValue(new ConflictException('CPF already in use'));

      await expect(authController.register(createUserDto)).rejects.toThrow(ConflictException);
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should call AuthService.login with correct data and return an access token', async () => {
      const loginUserDto: LoginUserDto = {
        cpf: '123.456.789-00',
        password: 'StrongP@ssw0rd',
      };

      const expectedResponse = {
        access_token: 'mock-jwt-token',
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await authController.login(loginUserDto);

      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw UnauthorizedException if login credentials are invalid', async () => {
      const loginUserDto: LoginUserDto = {
        cpf: '123.456.789-00',
        password: 'WrongPassword',
      };

      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid cpf or password'));

      await expect(authController.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    });
  });
});
