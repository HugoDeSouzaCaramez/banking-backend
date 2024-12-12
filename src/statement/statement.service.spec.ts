import { Test, TestingModule } from '@nestjs/testing';
import { StatementService } from './statement.service';
import { StatementMockHelper } from './helpers/statement-mock.helper';

describe('StatementService', () => {
  let service: StatementService;
  let mockHelper: StatementMockHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatementService,
        {
          provide: StatementMockHelper,
          useValue: {
            getMockStatement: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StatementService>(StatementService);
    mockHelper = module.get<StatementMockHelper>(StatementMockHelper);
  });

  describe('generateStatement', () => {
    it('should call StatementMockHelper.getMockStatement with correct userId', () => {
      const userId = 1;
      const mockStatement = [
        { id: 1, date: '2024-01-10', amount: 100, type: 'deposit' },
        { id: 2, date: '2024-01-15', amount: -50, type: 'withdrawal' },
      ];
      jest.spyOn(mockHelper, 'getMockStatement').mockReturnValue(mockStatement);

      const result = service.generateStatement(userId);

      expect(mockHelper.getMockStatement).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockStatement);
    });

    it('should return an empty array if no statement exists for the user', () => {
      const userId = 999;
      jest.spyOn(mockHelper, 'getMockStatement').mockReturnValue([]);

      const result = service.generateStatement(userId);

      expect(mockHelper.getMockStatement).toHaveBeenCalledWith(userId);
      expect(result).toEqual([]);
    });
  });
});
