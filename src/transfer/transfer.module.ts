import { Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { TransferHttpHelper } from './helpers/transfer-http.helper';
import { HttpModule } from '@nestjs/axios';
import { MockAuthModule } from '../mock-auth/mock-auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [HttpModule, MockAuthModule, PrismaModule, AccountModule],
  controllers: [TransferController],
  providers: [TransferService, TransferHttpHelper],
})
export class TransferModule {}
