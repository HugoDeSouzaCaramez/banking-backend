import { Injectable } from '@nestjs/common';

@Injectable()
export class StatementMockHelper {
  private statements = {};

  getMockStatement(userId: number) {
    if (!this.statements[userId]) {
      this.statements[userId] = [
        { id: 1, date: '2024-01-10', amount: 100, type: 'deposit' },
        { id: 2, date: '2024-01-15', amount: -50, type: 'withdrawal' },
        { id: 3, date: '2024-01-20', amount: 200, type: 'deposit' },
      ];
    }
    return this.statements[userId];
  }
}
