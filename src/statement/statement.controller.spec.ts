import { Test, TestingModule } from '@nestjs/testing';
import { StatementController } from './statement.controller';
import { StatementService } from './statement.service';
import { UnauthorizedException } from '@nestjs/common';

describe('StatementController', () => {
  let controller: StatementController;
  let service: StatementService;

  const mockStatementService = {
    generateStatement: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatementController],
      providers: [
        {
          provide: StatementService,
          useValue: mockStatementService,
        },
      ],
    }).compile();

    controller = module.get<StatementController>(StatementController);
    service = module.get<StatementService>(StatementService);
  });

  describe('getStatement', () => {
    it('should return the statement for the authenticated user', async () => {
      const userId = 1;
      const mockRequest = { user: { id: userId } };
      const mockStatement = [
        { id: 1, originAccount: '12345', recipientAccount: '67890', amount: 100.0 },
      ];

      mockStatementService.generateStatement.mockResolvedValue(mockStatement);

      const result = await controller.getStatement(mockRequest);

      expect(service.generateStatement).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockStatement);
    });

    it('should throw an UnauthorizedException if user is not authenticated', async () => {
        const mockRequest = { user: null };
      
        await expect(controller.getStatement(mockRequest as any)).rejects.toThrow(
          new UnauthorizedException('User is not authenticated'),
        );
    });
           
  });
});
