import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { KycFile } from '@prisma/client';

@Injectable()
export class KycService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadFile(userId: number, uploadFileDto: UploadFileDto): Promise<KycFile> {
    const { file, fileType } = uploadFileDto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.kycFile.create({
      data: {
        file,
        fileType,
        userId,
      },
    });
  }

  async getKycFiles(userId: number): Promise<KycFile[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { kycFiles: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.kycFiles;
  }
}
