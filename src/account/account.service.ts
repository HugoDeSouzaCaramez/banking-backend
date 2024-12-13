import { Injectable, ConflictException } from '@nestjs/common';
import { AccountRepository } from './repository/account.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    const { userId, accountNumber } = createAccountDto;

    const existingAccount = await this.accountRepository.findAccountByUserId(userId);
    if (existingAccount) {
      throw new ConflictException('User already has an account');
    }

    return this.accountRepository.createAccount(accountNumber, userId);
  }

  async getAccountByUserId(userId: number): Promise<Account | null> {
    return this.accountRepository.findAccountByUserId(userId);
  }
}
