import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MockAuthModule } from '../mock-auth/mock-auth.module';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { MockAuthService } from '../mock-auth/mock-auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7m' },
    }),
    HttpModule,
    MockAuthModule,
    PrismaModule,
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MockAuthService],
})
export class AuthModule {}
