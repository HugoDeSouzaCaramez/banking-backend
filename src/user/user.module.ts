import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UserModule {}
