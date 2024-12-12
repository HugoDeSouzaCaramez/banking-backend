import { Test, TestingModule } from '@nestjs/testing';
import { MockAuthService } from './mock-auth.service';
import { HttpService } from '@nestjs/axios';
import { UnauthorizedException } from '@nestjs/common';
import { of, throwError } from 'rxjs';

const mockHttpService = {
  post: jest.fn(),
};

describe('MockAuthService', () => {
  let service: MockAuthService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockAuthService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<MockAuthService>(MockAuthService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should return an access token on successful authentication', async () => {
      const mockResponse = { data: { access_token: 'mockAccessToken' } };
      mockHttpService.post.mockReturnValue(of(mockResponse));

      const token = await service.authenticate();

      expect(token).toBe('mockAccessToken');
      expect(httpService.post).toHaveBeenCalledWith(
        'http://localhost:8080/mock-auth/token',
        { client_id: 'test', client_secret: 'secret' },
      );
    });

    it('should throw an UnauthorizedException on authentication failure', async () => {
      mockHttpService.post.mockReturnValue(throwError(() => new Error('Error')));

      await expect(service.authenticate()).rejects.toThrow(
        new UnauthorizedException('Authentication with mock-backend failed'),
      );
      expect(httpService.post).toHaveBeenCalledWith(
        'http://localhost:8080/mock-auth/token',
        { client_id: 'test', client_secret: 'secret' },
      );
    });

    it('should reuse the access token if already set', async () => {
      service['accessToken'] = 'cachedAccessToken';

      const token = await service.authenticate();

      expect(token).toBe('cachedAccessToken');
      expect(httpService.post).not.toHaveBeenCalled();
    });
  });

  describe('getMockToken', () => {
    it('should return an access token if not cached', async () => {
      const mockResponse = { data: { access_token: 'mockAccessToken' } };
      mockHttpService.post.mockReturnValue(of(mockResponse));

      const token = await service.getMockToken();

      expect(token).toBe('mockAccessToken');
      expect(httpService.post).toHaveBeenCalledWith(
        'http://localhost:8080/mock-auth/token',
        { client_id: 'test', client_secret: 'secret' },
      );
    });

    it('should throw an UnauthorizedException if authentication fails', async () => {
      mockHttpService.post.mockReturnValue(throwError(() => new Error('Error')));

      await expect(service.getMockToken()).rejects.toThrow(
        new UnauthorizedException('Failed to authenticate with mock-backend'),
      );
      expect(httpService.post).toHaveBeenCalledWith(
        'http://localhost:8080/mock-auth/token',
        { client_id: 'test', client_secret: 'secret' },
      );
    });

    it('should reuse the cached access token if available', async () => {
      service['accessToken'] = 'cachedAccessToken';

      const token = await service.getMockToken();

      expect(token).toBe('cachedAccessToken');
      expect(httpService.post).not.toHaveBeenCalled();
    });
  });
});
