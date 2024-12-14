import { Controller, Post, UseGuards, Body, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransferService } from './transfer.service';
import { TransferDto } from './dto/transfer.dto';

@ApiTags('transfers')
@ApiBearerAuth()
@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Realizar uma transferência' })
  @ApiResponse({ status: 201, description: 'Transferência realizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro na transferência.' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
  async makeTransfer(@Body() transferDto: TransferDto, @Req() req: any) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const userId = req.user.id;
    return this.transferService.makeTransfer(userId, transferDto);
  }
}
