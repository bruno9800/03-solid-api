import { Prisma, User } from '@prisma/client';
import { UsersRepository } from '../users-repository';
import { randomUUID } from 'crypto';

export class InMemoryUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User | null> {
    const user = this.users.find(user => user.id === id);

    return user ?? null;
  }
  public users: User[] = [];
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.users.push(user);

    return user;
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(user => user.email === email);

    return user ?? null;
  }

}