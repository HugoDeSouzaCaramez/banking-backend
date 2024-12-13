import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Account } from '@prisma/client';

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAccountByUserId(userId: number): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: { userId },
    });
  }

  async createAccount(accountNumber: string, userId: number): Promise<Account> {
    return this.prisma.account.create({
      data: {
        accountNumber,
        userId,
      },
    });
  }
}
