import { Controller, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatementService } from './statement.service';

@ApiTags('statements')
@ApiBearerAuth()
@Controller('statement')
export class StatementController {
  constructor(private readonly statementService: StatementService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obter extrato financeiro' })
  @ApiResponse({ status: 200, description: 'Extrato gerado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
  async getStatement(@Request() req) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const userId = req.user.id;
    return this.statementService.generateStatement(userId);
  }
}
