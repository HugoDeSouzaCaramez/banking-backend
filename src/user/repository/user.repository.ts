import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(cpf: string, password: string, fullName: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        cpf,
        password: hashedPassword,
        fullName,
      },
    });
  }

  async findUserByCPF(cpf: string) {
    return this.prisma.user.findUnique({ where: { cpf } });
  }

  async createAccount(userId: number, accountNumber: string) {
    return this.prisma.account.create({
      data: {
        accountNumber,
        userId,
      },
    });
  }

  async findAccountByUserId(userId: number) {
    return this.prisma.account.findUnique({ where: { userId } });
  }
}
