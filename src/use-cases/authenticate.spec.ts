import { beforeEach, describe, expect, it } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let userRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(userRepository);
  });

  it('should be able to authenticate', async () => {
    await userRepository.create({
      name: 'Snicker Sousa',
      email: 'snicker@example.com',
      password_hash: await hash('1234567', 6)
    });

    const { user } = await sut.execute({
      email: 'snicker@example.com',
      password: '1234567'
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'snicker@example.com',
        password: '1234567'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong email', async () => {
    await userRepository.create({
      name: 'Snicker Sousa',
      email: 'snicker@example.com',
      password_hash: await hash('1234567', 6)
    });

    await expect(() =>
      sut.execute({
        email: 'snicker@example.com',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
