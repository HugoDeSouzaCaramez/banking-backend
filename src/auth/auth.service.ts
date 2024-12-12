import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    await this.ensureEmailNotInUse(createUserDto.email);

    const user = await this.usersService.createUser(
      createUserDto.email,
      createUserDto.password,
      createUserDto.fullName,
    );

    return { message: 'User registered successfully' };
  }

  async validateUser(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    const isPasswordValid = await this.usersService.validatePassword(password, user.password);
  
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    return { id: user.id, email: user.email };
  }
  

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
    const payload = this.createJwtPayload(user);

    const token = this.generateJwtToken(payload);

    return { access_token: token };
  }

  private async ensureEmailNotInUse(email: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
  }

  private async getUserByEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  private createJwtPayload(user: any) {
    return { email: user.email, sub: user.id };
  }

  private generateJwtToken(payload: any) {
    const secret = this.configService.get<string>('JWT_SECRET');
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: '7m',
    });
  }
}
