import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { KycModule } from './kyc/kyc.module';
import { StatementService } from './statement/statement.service';
import { StatementController } from './statement/statement.controller';
import { StatementModule } from './statement/statement.module';

@Module({
  imports: [AuthModule, KycModule, StatementModule],
  controllers: [AppController, StatementController],
  providers: [AppService, StatementService],
})
export class AppModule {}
