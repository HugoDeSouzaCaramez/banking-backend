import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AccountRepository } from './repository/account.repository';

@Module({
  imports: [PrismaModule],
  providers: [AccountService, AccountRepository],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
