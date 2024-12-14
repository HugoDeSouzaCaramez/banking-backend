import { Test, TestingModule } from '@nestjs/testing';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransferDto } from './dto/transfer.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('TransferController', () => {
  let controller: TransferController;
  let service: TransferService;

  const mockTransferService = {
    makeTransfer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [
        {
          provide: TransferService,
          useValue: mockTransferService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TransferController>(TransferController);
    service = module.get<TransferService>(TransferService);
  });

  describe('makeTransfer', () => {
    it('should call TransferService and return the transfer details', async () => {
      const userId = 1;
      const mockRequest = { user: { id: userId } };
      const transferDto: TransferDto = {
        originAccount: '12345',
        recipientAccount: '67890',
        amount: 100.0,
      };
      const mockTransferResult = {
        id: 1,
        originAccount: transferDto.originAccount,
        recipientAccount: transferDto.recipientAccount,
        amount: transferDto.amount,
        userId,
        createdAt: new Date(),
      };

      mockTransferService.makeTransfer.mockResolvedValue(mockTransferResult);

      const result = await controller.makeTransfer(transferDto, mockRequest);

      expect(service.makeTransfer).toHaveBeenCalledWith(userId, transferDto);
      expect(result).toEqual(mockTransferResult);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = { user: null };
      const transferDto: TransferDto = {
        originAccount: '12345',
        recipientAccount: '67890',
        amount: 100.0,
      };

      await expect(controller.makeTransfer(transferDto, mockRequest)).rejects.toThrow(
        new UnauthorizedException('User is not authenticated'),
      );
    });

    it('should throw BadRequestException if TransferService throws an error', async () => {
      const userId = 1;
      const mockRequest = { user: { id: userId } };
      const transferDto: TransferDto = {
        originAccount: '12345',
        recipientAccount: '67890',
        amount: 100.0,
      };

      mockTransferService.makeTransfer.mockRejectedValue(
        new BadRequestException('Transfer failed')
      );

      await expect(controller.makeTransfer(transferDto, mockRequest)).rejects.toThrow(
        new BadRequestException('Transfer failed'),
      );

      expect(service.makeTransfer).toHaveBeenCalledWith(userId, transferDto);
    });
  });
});
