import { Module } from '@nestjs/common';
import { StatementController } from './statement.controller';
import { StatementService } from './statement.service';
import { StatementMockHelper } from './helpers/statement-mock.helper';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StatementController],
  providers: [StatementService, StatementMockHelper],
})
export class StatementModule {}
