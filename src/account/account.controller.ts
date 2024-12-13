import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAccount(@Req() req: any) {
    const userId = req.user.id;
    const accountNumber = `ACCT-${userId}-${Date.now()}`;

    const createAccountDto: CreateAccountDto = {
      userId,
      accountNumber,
    };

    return this.accountService.createAccount(createAccountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAccount(@Req() req: any) {
    const userId = req.user.id;
    return this.accountService.getAccountByUserId(userId);
  }
}
