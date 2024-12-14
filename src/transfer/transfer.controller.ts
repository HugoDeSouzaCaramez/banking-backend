import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransferService } from './transfer.service';
import { TransferDto } from './dto/transfer.dto';
import { UnauthorizedException } from '@nestjs/common';

@Controller('transfer')
export class TransferController {
    constructor(private readonly transferService: TransferService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async makeTransfer(@Body() transferDto: TransferDto, @Req() req: any) {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedException('User is not authenticated');
      }
      const userId = req.user.id;
      return this.transferService.makeTransfer(userId, transferDto);
    }
}
