import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

// sut = system under test

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'doe@example.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'doe@example.com',
      password: '123456',
    });

    expect(user).toEqual(expect.objectContaining({
      email: 'doe@example.com',
    }));
  });

  it('should not be able to authenticate with wrong email', async () => {
    
    await usersRepository.create({
      name: 'John Doe',
      email: 'doe@example.com',
      password_hash: await hash('123456', 6),
    });

    await expect(() => sut.execute({
      email: 'doe1@example.com',
      password: '123456',
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    
    await usersRepository.create({
      name: 'John Doe',
      email: 'doe@example.com',
      password_hash: await hash('123456', 6),
    });

    await expect(() => sut.execute({
      email: 'doe@example.com',
      password: '1234561',
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

});

