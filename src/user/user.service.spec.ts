import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import * as bcrypt from 'bcrypt';
import { User } from './interfaces/user.interface';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should create a user with hashed password', async () => {
      const email = 'test@test.com';
      const password = 'passwordtest';
      const fullName = 'Test User';
      const salt = 'mockSalt';
      const hashedPassword = 'mockHashedPassword';

      (jest.spyOn(bcrypt, 'genSalt') as jest.Mock).mockResolvedValue(salt);
      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue(hashedPassword);

      const user = await service.createUser(email, password, fullName);

      expect(user).toEqual({
        id: 1,
        email,
        password: hashedPassword,
        fullName,
      });
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
    });
  });

  describe('findByEmail', () => {
    it('should return a user if email exists', async () => {
      const email = 'test@test.com';
      const user: User = {
        id: 1,
        email,
        password: 'mockHashedPassword',
        fullName: 'Test User',
      };
      await service.createUser(user.email, 'passwordtest', user.fullName);
  
      const foundUser = await service.findByEmail(email);
  
      expect(foundUser).toEqual(user);
    });
  });
  

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      const password = 'passwordtest';
      const hashedPassword = 'hashedPasswordTest';
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);

      const isValid = await service.validatePassword(password, hashedPassword);

      expect(isValid).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should return false for invalid password', async () => {
      const password = 'passwordtest';
      const hashedPassword = 'hashedPasswordTest';
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(false);

      const isValid = await service.validatePassword(password, hashedPassword);

      expect(isValid).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });
  });
});
