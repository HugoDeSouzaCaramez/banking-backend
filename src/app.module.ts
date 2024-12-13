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
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule } from './account/account.module';

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
    PrismaModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
