import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { KycFile } from '@prisma/client';

@Injectable()
export class KycRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createKycFile(userId: number, file: string, fileType: string): Promise<KycFile> {
    return this.prisma.kycFile.create({
      data: {
        file,
        fileType,
        userId,
      },
    });
  }

  async findKycFilesByUserId(userId: number): Promise<KycFile[]> {
    return this.prisma.kycFile.findMany({
      where: { userId },
    });
  }
}
