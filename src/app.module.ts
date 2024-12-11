import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { KycModule } from './kyc/kyc.module';
import { StatementService } from './statement/statement.service';
import { StatementController } from './statement/statement.controller';
import { StatementModule } from './statement/statement.module';
import { TransferService } from './transfer/transfer.service';
import { TransferController } from './transfer/transfer.controller';
import { TransferModule } from './transfer/transfer.module';
import { HttpModule } from '@nestjs/axios';
import { MockAuthService } from './mock-auth/mock-auth.service';

@Module({
  imports: [
    AuthModule, 
    KycModule, 
    StatementModule, 
    TransferModule, 
    HttpModule
  ],
  controllers: [AppController, StatementController, TransferController],
  providers: [AppService, StatementService, TransferService, MockAuthService],
})
export class AppModule {}
