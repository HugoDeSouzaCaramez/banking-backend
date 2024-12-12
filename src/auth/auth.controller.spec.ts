import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

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

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService.register with correct parameters and return a success message', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
      };
      const result = { message: 'User registered successfully' };
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      const response = await authController.register(createUserDto);

      expect(authService.register).toHaveBeenCalledWith(createUserDto);
      expect(response).toEqual(result);
    });

    it('should throw ConflictException if email is already in use', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
      };
      jest.spyOn(authService, 'register').mockRejectedValue(new ConflictException('Email already in use'));

      await expect(authController.register(createUserDto)).rejects.toThrow(ConflictException);
      await expect(authController.register(createUserDto)).rejects.toThrow('Email already in use');
    });
  });

  describe('login', () => {
    it('should call AuthService.login with correct parameters and return an access token', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = { access_token: 'some-token' };
      jest.spyOn(authService, 'login').mockResolvedValue(result);

      const response = await authController.login(loginUserDto);

      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
      expect(response).toEqual(result);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      jest.spyOn(authService, 'login').mockRejectedValue(new UnauthorizedException('Invalid email or password'));

      await expect(authController.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
      await expect(authController.login(loginUserDto)).rejects.toThrow('Invalid email or password');
    });
  });
});