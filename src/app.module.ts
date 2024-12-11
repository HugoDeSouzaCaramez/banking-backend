import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { KycModule } from './kyc/kyc.module';

@Module({
  imports: [AuthModule, KycModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
