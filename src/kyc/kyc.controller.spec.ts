import { Test, TestingModule } from '@nestjs/testing';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadFileDto } from './dto/upload-file.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';

const mockKycService = {
  uploadFile: jest.fn(),
};

describe('KycController', () => {
  let kycController: KycController;
  let kycService: KycService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KycController],
      providers: [
        {
          provide: KycService,
          useValue: mockKycService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    kycController = module.get<KycController>(KycController);
    kycService = module.get<KycService>(KycService);
  });

  describe('uploadDocument', () => {
    it('should call KycService.uploadFile with correct parameters for document', async () => {
      const userId = 1;
      const uploadFileDto: UploadFileDto = {
        file: 'base64encodedfile',
        fileType: 'document',
      };
      const request = { user: { id: userId } };
      const result = {
        message: 'document uploaded successfully',
        kycData: { document: 'base64encodedfile' },
      };

      jest.spyOn(kycService, 'uploadFile').mockResolvedValue(result);

      const response = await kycController.uploadDocument(request, uploadFileDto);

      expect(kycService.uploadFile).toHaveBeenCalledWith(userId, {
        ...uploadFileDto,
        fileType: 'document',
      });
      expect(response).toEqual(result);
    });
  });

  describe('uploadSelfie', () => {
    it('should call KycService.uploadFile with correct parameters for selfie', async () => {
      const userId = 1;
      const uploadFileDto: UploadFileDto = {
        file: 'base64encodedfile',
        fileType: 'selfie',
      };
      const request = { user: { id: userId } };
      const result = {
        message: 'selfie uploaded successfully',
        kycData: { selfie: 'base64encodedfile' },
      };

      jest.spyOn(kycService, 'uploadFile').mockResolvedValue(result);

      const response = await kycController.uploadSelfie(request, uploadFileDto);

      expect(kycService.uploadFile).toHaveBeenCalledWith(userId, {
        ...uploadFileDto,
        fileType: 'selfie',
      });
      expect(response).toEqual(result);
    });
  });

  
  describe('KycController - Authorization', () => {
    it('should throw ForbiddenException if JwtAuthGuard is not active', async () => {
      const guardMock = {
        canActivate: jest.fn(() => false),
      };
  
      const module: TestingModule = await Test.createTestingModule({
        controllers: [KycController],
        providers: [
          {
            provide: KycService,
            useValue: mockKycService,
          },
        ],
      })
        .overrideGuard(JwtAuthGuard)
        .useValue(guardMock)
        .compile();
  
      const app = module.createNestApplication();
      await app.init();
  
      const uploadFileDto: UploadFileDto = {
        file: 'base64encodedfile',
        fileType: 'selfie',
      };
  
      await request(app.getHttpServer())
        .post('/kyc/upload-selfie')
        .send(uploadFileDto)
        .expect(403)
        .expect((res) => {
          expect(res.body.message).toBe('Forbidden resource');
        });
  
      expect(guardMock.canActivate).toHaveBeenCalled();
      await app.close();
    });
  });
  
  
  
});
