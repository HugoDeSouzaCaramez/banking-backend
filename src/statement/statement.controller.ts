import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatementService } from './statement.service';
import { UnauthorizedException } from '@nestjs/common';

@Controller('statement')
export class StatementController {
  constructor(private readonly statementService: StatementService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getStatement(@Request() req) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User is not authenticated');
  }
  const userId = req.user.id;
  return this.statementService.generateStatement(userId);
}

}
