import { Injectable, NotFoundException } from '@nestjs/common';
import { StatementMockHelper } from './helpers/statement-mock.helper';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatementService {
  constructor(
    private readonly statementMockHelper: StatementMockHelper,
    private readonly prisma: PrismaService,
  ) {}

  async generateStatement(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        transfers: true,
      },
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const mockStatement = this.statementMockHelper.getMockStatement(user.id);
  
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      statement: mockStatement,
    };
  }
  
}
