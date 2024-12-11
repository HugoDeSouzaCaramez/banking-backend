import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { MockAuthService } from 'src/mock-auth/mock-auth.service';

@Module({
    imports: [HttpModule],
    providers: [TransferService, MockAuthService],
    controllers: [TransferController],
})
export class TransferModule {}
