/*import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MockAuthService } from '../mock-auth/mock-auth.service';
import { HttpService } from '@nestjs/axios';
import { UsersService, User } from '../user/user.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

jest.mock('rxjs', () => ({
  ...jest.requireActual('rxjs'),
  lastValueFrom: jest.fn().mockResolvedValue({ data: { status: 'ok' } }),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let mockAuthService: MockAuthService;
  let jwtService: JwtService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockJwtToken'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mockSecret'),
          },
        },
        {
          provide: MockAuthService,
          useValue: {
            getMockToken: jest.fn().mockResolvedValue('mockToken'),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn().mockReturnValue(of({ data: { status: 'ok' } })),
          },
        },
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn().mockResolvedValue({
              id: 1,
              email: 'test@test.com',
              password: 'hashedPassword',
              fullName: 'Test User',
            }),
            findByEmail: jest.fn(),
            validatePassword: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    mockAuthService = module.get<MockAuthService>(MockAuthService);
    jwtService = module.get<JwtService>(JwtService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      jest.spyOn(usersService, 'findByEmail').mockReturnValue(undefined);

      const result = await authService.register({
        email: 'test@test.com',
        password: 'passwordtest',
        fullName: 'Test User',
      });

      expect(usersService.createUser).toHaveBeenCalledWith(
        'test@test.com',
        'passwordtest',
        'Test User',
      );
      expect(result).toEqual({ message: 'User registered successfully' });
    });

    it('should throw an error if email is already in use', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
        fullName: 'Test User',
      } as User);
    
      await expect(
        authService.register({
          email: 'test@test.com',
          password: 'passwordtest',
          fullName: 'Test User',
        }),
      ).rejects.toThrow(ConflictException);
    });
    
  });

  describe('validateUser', () => {
    it('should validate and return a user', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
        fullName: 'Test User',
      });
      jest.spyOn(usersService, 'validatePassword').mockResolvedValue(true);
    
      const user = await authService.validateUser('test@test.com', 'passwordtest');
    
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(usersService.validatePassword).toHaveBeenCalledWith('passwordtest', 'hashedPassword');
      expect(user).toEqual({ id: 1, email: 'test@test.com' });
    });
    

    it('should throw an error if email is invalid', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(undefined);

      await expect(authService.validateUser('invalid@example.com', 'passwordtest')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if password is invalid', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue({ id: 1, email: 'test@test.com', password: 'hashedPassword', fullName: 'Test User' });
      jest.spyOn(usersService, 'validatePassword').mockResolvedValue(false);

      await expect(authService.validateUser('test@test.com', 'wrongPassword')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should generate and return a JWT token', async () => {
      const mockUser = { id: 1, email: 'test@test.com', password: 'hashedPassword' };
      const mockJwtToken = 'mockJwtToken';
      
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser as User);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockJwtToken);
  
      const loginUserDto = { email: 'test@test.com', password: 'validPassword' };
      const result = await authService.login(loginUserDto);
  
      expect(authService.validateUser).toHaveBeenCalledWith('test@test.com', 'validPassword');
      expect(jwtService.sign).toHaveBeenCalledWith({ email: 'test@test.com', sub: 1 }, { secret: 'mockSecret', expiresIn: '7m' });
      expect(result).toEqual({ access_token: mockJwtToken });
    });
  });
  
});*/
