import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  async createUser(email: string, password: string, fullName: string): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: User = {
      id: this.users.length + 1,
      email,
      password: hashedPassword,
      fullName,
    };
    this.users.push(user);

    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}