import { Test, TestingModule } from '@nestjs/testing';
import { KycService } from './kyc.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('KycService', () => {
  let service: KycService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KycService],
    }).compile();

    service = module.get<KycService>(KycService);
  });

  async function validateDto(dto: any, type: any) {
    const object = plainToInstance(type, dto);
    const errors = await validate(object);
    if (errors.length > 0) {
      const errorMessages = errors.map(
        (error) => `${error.property} - ${Object.values(error.constraints).join(', ')}`,
      );
      throw new BadRequestException(errorMessages.join('; '));
    }
  }

  describe('uploadFile', () => {
    it('should upload a document successfully', async () => {
      const userId = 1;
      const uploadFileDto: UploadFileDto = {
        file: 'dGVzdC1kb2N1bWVudC1jb250ZW50',
        fileType: 'document',
      };

      const result = await service.uploadFile(userId, uploadFileDto);

      expect(result).toEqual({
        message: 'document uploaded successfully',
        kycData: {
          document: 'dGVzdC1kb2N1bWVudC1jb250ZW50',
        },
      });
    });

    it('should upload a selfie successfully', async () => {
      const userId = 2;
      const uploadFileDto: UploadFileDto = {
        file: 'dGVzdC1zZWxmaWUtY29udGVudA==',
        fileType: 'selfie',
      };

      const result = await service.uploadFile(userId, uploadFileDto);

      expect(result).toEqual({
        message: 'selfie uploaded successfully',
        kycData: {
          selfie: 'dGVzdC1zZWxmaWUtY29udGVudA==',
        },
      });
    });

    it('should handle multiple uploads for the same user', async () => {
      const userId = 3;
      const uploadDocumentDto: UploadFileDto = {
        file: 'ZG9jdW1lbnQtY29udGVudA==',
        fileType: 'document',
      };
      const uploadSelfieDto: UploadFileDto = {
        file: 'c2VsZmllLWNvbnRlbnQ=',
        fileType: 'selfie',
      };

      await service.uploadFile(userId, uploadDocumentDto);
      const result = await service.uploadFile(userId, uploadSelfieDto);

      expect(result).toEqual({
        message: 'selfie uploaded successfully',
        kycData: {
          document: 'ZG9jdW1lbnQtY29udGVudA==',
          selfie: 'c2VsZmllLWNvbnRlbnQ=',
        },
      });
    });

    it('should throw an error if fileType is invalid', async () => {
      const uploadFileDto = {
        file: 'dGVzdC1pbnZhbGlkLWZpbGU=',
        fileType: 'invalidType',
      };

      await expect(validateDto(uploadFileDto, UploadFileDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(validateDto(uploadFileDto, UploadFileDto)).rejects.toThrow(
        /fileType - fileType must be either "document" or "selfie"/,
      );
    });

    it('should throw an error if file is not a valid Base64 string', async () => {
      const uploadFileDto = {
        file: 'invalid-base64',
        fileType: 'document',
      };

      await expect(validateDto(uploadFileDto, UploadFileDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(validateDto(uploadFileDto, UploadFileDto)).rejects.toThrow(
        /file - file must be base64 encoded/,
      );
    });
  });
});