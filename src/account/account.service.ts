import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    const { userId, accountNumber } = createAccountDto;

    const existingAccount = await this.prisma.account.findUnique({
      where: { userId },
    });

    if (existingAccount) {
      throw new ConflictException('User already has an account');
    }

    return this.prisma.account.create({
      data: {
        accountNumber,
        userId,
      },
    });
  }

  async getAccountByUserId(userId: number): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: { userId },
    });
  }
}
