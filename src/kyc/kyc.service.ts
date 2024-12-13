import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import { KycRepository } from './repository/kyc.repository';
import { UploadFileDto } from './dto/upload-file.dto';

@Injectable()
export class KycService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly kycRepository: KycRepository,
  ) {}

  async uploadFile(userId: number, uploadFileDto: UploadFileDto): Promise<{ message: string; id: number }> {
    const { file, fileType } = uploadFileDto;

    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const kycFile = await this.kycRepository.createKycFile(userId, file, fileType);

    return { message: 'File uploaded successfully', id: kycFile.id };
  }

}
