import { Test, TestingModule } from '@nestjs/testing';
import { TransferService } from './transfer.service';
import { MockAuthService } from '../mock-auth/mock-auth.service';
import { TransferHttpHelper } from './helpers/transfer-http.helper';
import { AccountRepository } from '../account/repository/account.repository';
import { TransferRepository } from './repository/transfer.repository';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransferDto } from './dto/transfer.dto';
import { Transfer } from '@prisma/client';

const mockAccount = {
  id: 1,
  accountNumber: '123456789',
  createdAt: new Date(),
  userId: 1,
};

const mockTransfer: Transfer = {
  id: 1,
  originAccount: '123456789',
  recipientAccount: '987654321',
  amount: 100.5,
  userId: 1,
  createdAt: new Date(),
};

const mockTransferDto: TransferDto = {
  originAccount: '123456789',
  recipientAccount: '987654321',
  amount: 100.5,
};

const mockToken = 'mock-auth-token';

const mockAccountRepository = {
  findAccountByUserId: jest.fn(),
};

const mockTransferRepository = {
  createTransfer: jest.fn(),
};

const mockMockAuthService = {
  getAuthToken: jest.fn(),
};

const mockTransferHttpHelper = {
  postTransfer: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

describe('TransferService', () => {
  let service: TransferService;
  let accountRepository: jest.Mocked<AccountRepository>;
  let transferRepository: jest.Mocked<TransferRepository>;
  let mockAuthService: jest.Mocked<MockAuthService>;
  let transferHttpHelper: jest.Mocked<TransferHttpHelper>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferService,
        { provide: AccountRepository, useValue: mockAccountRepository },
        { provide: TransferRepository, useValue: mockTransferRepository },
        { provide: MockAuthService, useValue: mockMockAuthService },
        { provide: TransferHttpHelper, useValue: mockTransferHttpHelper },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<TransferService>(TransferService);
    accountRepository = module.get(AccountRepository);
    transferRepository = module.get(TransferRepository);
    mockAuthService = module.get(MockAuthService);
    transferHttpHelper = module.get(TransferHttpHelper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully make a transfer', async () => {
    accountRepository.findAccountByUserId.mockResolvedValue(mockAccount);
    mockAuthService.getAuthToken.mockResolvedValue(mockToken);
    transferHttpHelper.postTransfer.mockResolvedValue(undefined);
    transferRepository.createTransfer.mockResolvedValue(mockTransfer);

    const result = await service.makeTransfer(1, mockTransferDto);

    expect(accountRepository.findAccountByUserId).toHaveBeenCalledWith(1);
    expect(mockAuthService.getAuthToken).toHaveBeenCalled();
    expect(transferHttpHelper.postTransfer).toHaveBeenCalledWith(
      undefined,
      mockToken,
      mockTransferDto,
    );
    expect(transferRepository.createTransfer).toHaveBeenCalledWith(
      mockTransferDto.originAccount,
      mockTransferDto.recipientAccount,
      mockTransferDto.amount,
      1,
    );
    expect(result).toEqual(mockTransfer);
  });

  it('should throw BadRequestException if the user account is invalid', async () => {
    accountRepository.findAccountByUserId.mockResolvedValue(null);

    await expect(service.makeTransfer(1, mockTransferDto)).rejects.toThrow(BadRequestException);
    expect(accountRepository.findAccountByUserId).toHaveBeenCalledWith(1);
  });

  it('should throw BadRequestException if originAccount does not match user account', async () => {
    accountRepository.findAccountByUserId.mockResolvedValue({
      ...mockAccount,
      accountNumber: 'wrong-account',
    });

    await expect(service.makeTransfer(1, mockTransferDto)).rejects.toThrow(BadRequestException);
    expect(accountRepository.findAccountByUserId).toHaveBeenCalledWith(1);
  });

  it('should throw BadRequestException if the transfer request fails', async () => {
    accountRepository.findAccountByUserId.mockResolvedValue(mockAccount);
    mockAuthService.getAuthToken.mockResolvedValue(mockToken);
    transferHttpHelper.postTransfer.mockRejectedValue({
      response: { data: { message: 'Insufficient funds' } },
    });

    await expect(service.makeTransfer(1, mockTransferDto)).rejects.toThrow(
      'Transfer failed: Insufficient funds',
    );
    expect(mockAuthService.getAuthToken).toHaveBeenCalled();
    expect(transferHttpHelper.postTransfer).toHaveBeenCalled();
  });
});
