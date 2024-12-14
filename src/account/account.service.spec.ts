import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { AccountRepository } from './repository/account.repository';
import { ConflictException } from '@nestjs/common';
import { Account } from '@prisma/client';

describe('AccountService', () => {
  let accountService: AccountService;
  let accountRepository: jest.Mocked<AccountRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: AccountRepository,
          useValue: {
            findAccountByUserId: jest.fn(),
            createAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    accountService = module.get<AccountService>(AccountService);
    accountRepository = module.get<AccountRepository>(AccountRepository) as jest.Mocked<AccountRepository>;
  });

  describe('createAccount', () => {
    const userId = 1;
    const accountNumber = 'ACCT-1-1234567890';
    const mockAccount: Account = {
      id: 1,
      accountNumber,
      createdAt: new Date(),
      userId,
    };

    it('should create a new account when no account exists for the user', async () => {
      accountRepository.findAccountByUserId.mockResolvedValue(null);
      accountRepository.createAccount.mockResolvedValue(mockAccount);

      const result = await accountService.createAccount({ userId, accountNumber });

      expect(accountRepository.findAccountByUserId).toHaveBeenCalledWith(userId);
      expect(accountRepository.createAccount).toHaveBeenCalledWith(accountNumber, userId);
      expect(result).toEqual(mockAccount);
    });

    it('should throw a ConflictException if the user already has an account', async () => {
      accountRepository.findAccountByUserId.mockResolvedValue(mockAccount);

      await expect(accountService.createAccount({ userId, accountNumber })).rejects.toThrow(ConflictException);
      expect(accountRepository.findAccountByUserId).toHaveBeenCalledWith(userId);
      expect(accountRepository.createAccount).not.toHaveBeenCalled();
    });
  });

  describe('getAccountByUserId', () => {
    const userId = 1;
    const mockAccount: Account = {
      id: 1,
      accountNumber: 'ACCT-1-1234567890',
      createdAt: new Date(),
      userId,
    };

    it('should return an account for the given user ID', async () => {
      accountRepository.findAccountByUserId.mockResolvedValue(mockAccount);

      const result = await accountService.getAccountByUserId(userId);

      expect(accountRepository.findAccountByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockAccount);
    });

    it('should return null if no account exists for the given user ID', async () => {
      accountRepository.findAccountByUserId.mockResolvedValue(null);

      const result = await accountService.getAccountByUserId(userId);

      expect(accountRepository.findAccountByUserId).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });
});
