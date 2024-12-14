import { Test, TestingModule } from '@nestjs/testing';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadFileDto } from './dto/upload-file.dto';
import { NotFoundException } from '@nestjs/common';

const mockUploadFileDto: UploadFileDto = {
  file: 'dGVzdGZpbGU=',
  fileType: 'document',
};

const mockRequest = {
  user: {
    id: 1,
  },
};

const mockKycService = {
  uploadFile: jest.fn(),
};

describe('KycController', () => {
  let controller: KycController;
  let service: KycService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KycController],
      providers: [
        { provide: KycService, useValue: mockKycService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<KycController>(KycController);
    service = module.get<KycService>(KycService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadDocument', () => {
    it('should successfully upload a document', async () => {
      const mockResponse = { message: 'File uploaded successfully', id: 1 };
      mockKycService.uploadFile.mockResolvedValue(mockResponse);

      const result = await controller.uploadDocument(mockRequest, mockUploadFileDto);

      expect(service.uploadFile).toHaveBeenCalledWith(mockRequest.user.id, {
        ...mockUploadFileDto,
        fileType: 'document',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw NotFoundException if the user does not exist', async () => {
      mockKycService.uploadFile.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.uploadDocument(mockRequest, mockUploadFileDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('uploadSelfie', () => {
    it('should successfully upload a selfie', async () => {
      const mockResponse = { message: 'File uploaded successfully', id: 2 };
      mockKycService.uploadFile.mockResolvedValue(mockResponse);

      const result = await controller.uploadSelfie(mockRequest, mockUploadFileDto);

      expect(service.uploadFile).toHaveBeenCalledWith(mockRequest.user.id, {
        ...mockUploadFileDto,
        fileType: 'selfie',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw NotFoundException if the user does not exist', async () => {
      mockKycService.uploadFile.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.uploadSelfie(mockRequest, mockUploadFileDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
