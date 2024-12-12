import { Test, TestingModule } from '@nestjs/testing';
import { TransferService } from './transfer.service';
import { MockAuthService } from '../mock-auth/mock-auth.service';
import { TransferHttpHelper } from './helpers/transfer-http.helper';
import { BadRequestException } from '@nestjs/common';
import { TransferDto } from './dto/transfer.dto';

describe('TransferService', () => {
  let service: TransferService;
  let mockAuthService: MockAuthService;
  let transferHttpHelper: TransferHttpHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferService,
        {
          provide: MockAuthService,
          useValue: {
            authenticate: jest.fn(),
          },
        },
        {
          provide: TransferHttpHelper,
          useValue: {
            postTransfer: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransferService>(TransferService);
    mockAuthService = module.get<MockAuthService>(MockAuthService);
    transferHttpHelper = module.get<TransferHttpHelper>(TransferHttpHelper);
  });

  describe('makeTransfer', () => {
    const transferDto: TransferDto = {
      recipientAccount: '67890',
      amount: 100,
    };
  
    it('should successfully make a transfer', async () => {
      const mockToken = 'mock-token';
      const mockResponse = { status: 'ok' };
      jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue(mockToken);
      jest.spyOn(transferHttpHelper, 'postTransfer').mockResolvedValue(mockResponse);
  
      const result = await service.makeTransfer(transferDto);
  
      expect(mockAuthService.authenticate).toHaveBeenCalled();
      expect(transferHttpHelper.postTransfer).toHaveBeenCalledWith(
        'http://localhost:8080/mock-transfer',
        mockToken,
        transferDto,
      );
      expect(result).toEqual(mockResponse);
    });
  
    it('should throw BadRequestException if authentication fails', async () => {
      jest.spyOn(mockAuthService, 'authenticate').mockRejectedValue(new Error('Auth error'));
  
      await expect(service.makeTransfer(transferDto)).rejects.toThrow(
        new BadRequestException('Transfer failed: Unknown error'),
      );
    });
  
    it('should throw BadRequestException if HTTP transfer fails', async () => {
      const mockToken = 'mock-token';
      const errorResponse = {
        response: {
          data: {
            message: 'Insufficient funds',
          },
        },
      };
      jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue(mockToken);
      jest.spyOn(transferHttpHelper, 'postTransfer').mockRejectedValue(errorResponse);
  
      await expect(service.makeTransfer(transferDto)).rejects.toThrow(
        new BadRequestException('Transfer failed: Insufficient funds'),
      );
    });
  
    it('should throw BadRequestException with unknown error if HTTP fails without response', async () => {
      const mockToken = 'mock-token';
      jest.spyOn(mockAuthService, 'authenticate').mockResolvedValue(mockToken);
      jest.spyOn(transferHttpHelper, 'postTransfer').mockRejectedValue(new Error('Unknown error'));
  
      await expect(service.makeTransfer(transferDto)).rejects.toThrow(
        new BadRequestException('Transfer failed: Unknown error'),
      );
    });
  });
  
});
