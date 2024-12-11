import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadFileDto } from './dto/upload-file.dto';

@Injectable()
export class KycService {
  private kycData = {};

  async uploadFile(userId: number, uploadFileDto: UploadFileDto) {
    const { file, fileType } = uploadFileDto;

    if (!['document', 'selfie'].includes(fileType)) {
      throw new BadRequestException('Invalid file type');
    }

    if (!this.kycData[userId]) {
      this.kycData[userId] = {};
    }
    this.kycData[userId][fileType] = file;

    return {
      message: `${fileType} uploaded successfully`,
      kycData: this.kycData[userId],
    };
  }
}
