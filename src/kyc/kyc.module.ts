import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { KycRepository } from './repository/kyc.repository';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [KycController],
  providers: [KycService, KycRepository]
})
export class KycModule {}
