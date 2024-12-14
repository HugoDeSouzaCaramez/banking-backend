import { Test, TestingModule } from '@nestjs/testing';
import { MockAuthService } from './mock-auth.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';
import { AxiosResponse, AxiosHeaders } from 'axios';

describe('MockAuthService', () => {
  let mockAuthService: MockAuthService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockAuthService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    mockAuthService = module.get<MockAuthService>(MockAuthService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('authenticate', () => {
    it('should authenticate successfully and store the token', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          access_token: 'newToken',
          expires_in: 3600,
        },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders({}),
        config: {
          headers: new AxiosHeaders({}),
          url: 'http://mock-auth-url',
          method: 'post',
          params: {},
          data: {},
          timeout: 0,
          timeoutErrorMessage: '',
          xsrfCookieName: '',
          xsrfHeaderName: '',
          maxContentLength: -1,
          maxBodyLength: -1,
          transitional: {
            silentJSONParsing: true,
            forcedJSONParsing: true,
            clarifyTimeoutError: false,
          },
          signal: null,
          baseURL: '',
          responseType: 'json',
        },
      };

      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'MOCK_AUTH_URL') return 'http://mock-auth-url';
        if (key === 'MOCK_CLIENT_ID') return 'mockClientId';
        if (key === 'MOCK_CLIENT_SECRET') return 'mockClientSecret';
        return null;
      });

      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const token = await mockAuthService['authenticate']();

      expect(token).toBe('newToken');
      expect(mockAuthService['accessToken']).toBe('newToken');
      expect(mockAuthService['tokenExpiry']).toBeGreaterThan(Date.now());
      expect(httpService.post).toHaveBeenCalledWith('http://mock-auth-url', {
        client_id: 'mockClientId',
        client_secret: 'mockClientSecret',
      });
    });

    it('should throw UnauthorizedException if authentication fails', async () => {
      jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => new Error('Mock Error')));

      await expect(mockAuthService['authenticate']()).rejects.toThrow(UnauthorizedException);
    });
  });
});
