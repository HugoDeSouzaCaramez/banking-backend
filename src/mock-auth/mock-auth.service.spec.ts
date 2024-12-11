import { Test, TestingModule } from '@nestjs/testing';
import { MockAuthService } from './mock-auth.service';

describe('MockAuthService', () => {
  let service: MockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockAuthService],
    }).compile();

    service = module.get<MockAuthService>(MockAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
