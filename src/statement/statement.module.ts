import { Module } from '@nestjs/common';
import { StatementService } from './statement.service';
import { StatementController } from './statement.controller';

@Module({
  controllers: [StatementController],
  providers: [StatementService],
})
export class StatementModule {}
