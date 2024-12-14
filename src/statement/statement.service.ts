import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';

@Injectable()
export class StatementService {
  constructor(private readonly userRepository: UserRepository) {}

  async generateStatement(userId: number): Promise<{ user: any; statement: any[] }> {
    const user = await this.userRepository.findUserWithTransfers(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const statement = user.transfers.map((transfer) => ({
      id: transfer.id,
      recipientAccount: transfer.recipientAccount,
      amount: transfer.amount,
      date: transfer.createdAt,
    }));

    return {
      user: {
        id: user.id,
        cpf: user.cpf,
        fullName: user.fullName,
      },
      statement,
    };
  }
}
