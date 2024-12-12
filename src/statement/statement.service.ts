import { Injectable } from '@nestjs/common';
import { StatementMockHelper } from './helpers/statement-mock.helper';

@Injectable()
export class StatementService {
  constructor(private readonly statementMockHelper: StatementMockHelper) {}

  generateStatement(userId: number) {
    return this.statementMockHelper.getMockStatement(userId);
  }
}
