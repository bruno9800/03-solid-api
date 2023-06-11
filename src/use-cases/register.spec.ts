import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { expect, describe, it, beforeEach } from 'vitest';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'doe@example.com',
      password: 'password'
    });

    expect(user).toEqual(expect.objectContaining({
      name: 'John Doe',
      email: 'doe@example.com',
    }));
  });
 
  it('should be generated a hash for the user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'doe@example.com',
      password: 'password'
    });

    const isPasswordCorrectlyHashed = await compare(
      'password',
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {

    const email = 'doe@example.com';

    await sut.execute({
      name: 'John Doe',
      email,
      password: 'john123'
    });

    await expect(sut.execute({
      name: 'John Doe',
      email,
      password: 'john321'
    })).rejects.toBeInstanceOf(UserAlreadyExistsError);

  });
 
  // end describe;
});