import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatementService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async generateStatement(userId: number): Promise<{ user: any; statement: any[] }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { transfers: true },
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const statement = user.transfers.map((transfer) => ({
      id: transfer.id,
      recipientAccount: transfer.recipientAccount,
      amount: transfer.amount,
      date: transfer.createdAt,
    }));
  
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      statement,
    };
  }
  
  
}
