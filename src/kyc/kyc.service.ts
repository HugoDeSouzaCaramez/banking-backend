import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from '../user/repository/user.repository';
import { UploadFileDto } from './dto/upload-file.dto';
import { KycFile } from '@prisma/client';

@Injectable()
export class KycService {
  constructor(private readonly prisma: PrismaService, private readonly userRepository: UserRepository) {}

  async uploadFile(userId: number, uploadFileDto: UploadFileDto): Promise<{ message: string; id: number }> {
    const { file, fileType } = uploadFileDto;

    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const kycFile = await this.prisma.kycFile.create({
      data: {
        file,
        fileType,
        userId,
      },
    });

    return { message: 'File uploaded successfully', id: kycFile.id };
  }
}
