import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateUseCase } from '../authenticate';

abstract class CreatorAuthenticateUseCase {
  public abstract factoryMethod(): AuthenticateUseCase;
}

export class CreateAuthenticateUseCase extends CreatorAuthenticateUseCase {
  public factoryMethod(): AuthenticateUseCase {
    const usersRepository = new PrismaUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    return authenticateUseCase;
  }
}