import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatementService } from './statement.service';

@Controller('statement')
export class StatementController {
  constructor(private readonly statementService: StatementService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getStatement(@Request() req) {
    const userId = req.user.id;
    return this.statementService.generateStatement(userId);
  }
}
