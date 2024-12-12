import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { KycModule } from './kyc/kyc.module';
import { StatementModule } from './statement/statement.module';
import { TransferModule } from './transfer/transfer.module';
import { HttpModule } from '@nestjs/axios';
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
    HttpModule,
    MockAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
