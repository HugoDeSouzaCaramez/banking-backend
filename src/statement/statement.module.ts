import { Module } from '@nestjs/common';
import { StatementController } from './statement.controller';
import { StatementService } from './statement.service';
import { StatementMockHelper } from './helpers/statement-mock.helper';

@Module({
  controllers: [StatementController],
  providers: [StatementService, StatementMockHelper],
})
export class StatementModule {}
