import { UsersRepository } from '@/repositories/users-repository';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User
}

// com inversão de dependência;
export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    email,
    name,
    password
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6);
  
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
  
    if(userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }
  
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash
    });

    return {
      user,
    };
  }
}

// sem inversão de dependência 
/*
export async function registerUseCase({
  email,
  name,
  password
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6);

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if(userWithSameEmail) {
    throw new Error('Email already exists');
  }

  const prismaUsersRepository = new PrismaUsersRepository();

  await prismaUsersRepository.create({
    name,
    email,
    password_hash
  });
}

*/