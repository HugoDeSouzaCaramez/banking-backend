import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountService } from './account.service';

@ApiTags('accounts')
@ApiBearerAuth()
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obter dados da conta do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Dados da conta retornados com sucesso.' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
  async getAccount(@Req() req: any) {
    const userId = req.user.id;
    return this.accountService.getAccountByUserId(userId);
  }
}
