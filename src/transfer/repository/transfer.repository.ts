import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Transfer } from '@prisma/client';

@Injectable()
export class TransferRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTransfer(
    originAccount: string,
    recipientAccount: string,
    amount: number,
    userId: number,
  ): Promise<Transfer> {
    return this.prisma.transfer.create({
      data: {
        originAccount,
        recipientAccount,
        amount,
        userId,
      },
    });
  }
}
