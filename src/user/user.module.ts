import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
