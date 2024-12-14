import { Test, TestingModule } from '@nestjs/testing';
import { KycService } from './kyc.service';
import { UserRepository } from '../user/repository/user.repository';
import { KycRepository } from './repository/kyc.repository';
import { NotFoundException } from '@nestjs/common';
import { UploadFileDto } from './dto/upload-file.dto';

describe('KycService', () => {
  let kycService: KycService;
  let userRepository: UserRepository;
  let kycRepository: KycRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KycService,
        {
          provide: UserRepository,
          useValue: {
            findUserById: jest.fn(),
          },
        },
        {
          provide: KycRepository,
          useValue: {
            createKycFile: jest.fn(),
          },
        },
      ],
    }).compile();

    kycService = module.get<KycService>(KycService);
    userRepository = module.get<UserRepository>(UserRepository);
    kycRepository = module.get<KycRepository>(KycRepository);
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const userId = 1;
      const uploadFileDto: UploadFileDto = {
        file: 'base64FileString',
        fileType: 'document',
      };
      const mockUser = {
        id: userId,
        fullName: 'John Doe',
        cpf: '12345678901',
        password: 'hashedPassword',
        createdAt: new Date(),
      };
      const mockKycFile = {
        id: 1,
        userId,
        file: 'base64FileString',
        fileType: 'document',
        createdAt: new Date(),
      };

      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(kycRepository, 'createKycFile').mockResolvedValue(mockKycFile);

      const result = await kycService.uploadFile(userId, uploadFileDto);

      expect(result).toEqual({ message: 'File uploaded successfully', id: mockKycFile.id });
      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(kycRepository.createKycFile).toHaveBeenCalledWith(userId, uploadFileDto.file, uploadFileDto.fileType);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = 1;
      const uploadFileDto: UploadFileDto = {
        file: 'base64FileString',
        fileType: 'document',
      };

      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(null);

      await expect(kycService.uploadFile(userId, uploadFileDto)).rejects.toThrow(NotFoundException);
      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(kycRepository.createKycFile).not.toHaveBeenCalled();
    });
  });
});
