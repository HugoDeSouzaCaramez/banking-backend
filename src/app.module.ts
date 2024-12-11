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
import { MockAuthModule } from './mock-auth/mock-auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule, 
    KycModule, 
    StatementModule, 
    TransferModule, 
    HttpModule, MockAuthModule
  ],
  controllers: [AppController, StatementController, TransferController],
  providers: [AppService, StatementService, TransferService, MockAuthService],
})
export class AppModule {}
