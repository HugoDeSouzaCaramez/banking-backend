import { Test, TestingModule } from '@nestjs/testing';
import { StatementService } from './statement.service';
import { UserRepository } from '../user/repository/user.repository';
import { NotFoundException } from '@nestjs/common';


const mockUser = {
    id: 1,
    cpf: '123.456.789-01',
    fullName: 'Foo Bar',
    password: 'hashed_password',
    createdAt: new Date('2024-12-14T09:00:00Z'),
    transfers: [
      {
        id: 1,
        userId: 1,
        originAccount: '123456789',
        recipientAccount: '987654321',
        amount: 100.5,
        createdAt: new Date('2023-01-01T10:00:00Z'),
      },
      {
        id: 2,
        userId: 1,
        originAccount: '123456789',
        recipientAccount: '123123123',
        amount: 200,
        createdAt: new Date('2023-01-02T10:00:00Z'),
      },
    ],
};
  

const mockUserRepository = {
  findUserWithTransfers: jest.fn(),
};

describe('StatementService', () => {
  let service: StatementService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatementService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<StatementService>(StatementService);
    userRepository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user statement when user exists', async () => {
    userRepository.findUserWithTransfers.mockResolvedValue(mockUser);

    const result = await service.generateStatement(mockUser.id);

    expect(userRepository.findUserWithTransfers).toHaveBeenCalledWith(mockUser.id);
    expect(result).toEqual({
      user: {
        id: mockUser.id,
        cpf: mockUser.cpf,
        fullName: mockUser.fullName,
      },
      statement: [
        {
          id: mockUser.transfers[0].id,
          recipientAccount: mockUser.transfers[0].recipientAccount,
          amount: mockUser.transfers[0].amount,
          date: mockUser.transfers[0].createdAt,
        },
        {
          id: mockUser.transfers[1].id,
          recipientAccount: mockUser.transfers[1].recipientAccount,
          amount: mockUser.transfers[1].amount,
          date: mockUser.transfers[1].createdAt,
        },
      ],
    });
  });

  it('should throw a NotFoundException if the user does not exist', async () => {
    userRepository.findUserWithTransfers.mockResolvedValue(null);

    await expect(service.generateStatement(999)).rejects.toThrow(NotFoundException);
    expect(userRepository.findUserWithTransfers).toHaveBeenCalledWith(999);
  });
});
