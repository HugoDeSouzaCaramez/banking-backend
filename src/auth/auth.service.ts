import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private users = [];

  constructor(private readonly jwtService: JwtService) {}

  async register(createUserDto: CreateUserDto) {
    const user = {
      id: this.users.length + 1,
      ...createUserDto,
    };
    this.users.push(user);
    return { message: 'User registered successfully', user };
  }

  async validateUser(email: string, password: string) {
    const user = this.users.find((u) => u.email === email && u.password === password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return { id: user.id, email: user.email };
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
