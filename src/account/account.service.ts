import { Injectable, ConflictException } from '@nestjs/common';
import { AccountRepository } from './repository/account.repository';
import { Account } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getAccountByUserId(userId: number): Promise<Account | null> {
    return this.accountRepository.findAccountByUserId(userId);
  }
}
