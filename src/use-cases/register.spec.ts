import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let userRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(userRepository);
  });

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Snicker Sousa',
      email: 'snicker@example.com',
      password: '1234567'
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Snicker Sousa',
      email: 'snicker@example.com',
      password: '1234567'
    });

    const isPasswordCorrectlyHashed = await compare(
      '1234567',
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const email = 'snicker@example.com';

    await sut.execute({
      name: 'Snicker Sousa',
      email,
      password: '1234567'
    });

    await expect(() =>
      sut.execute({
        name: 'Snicker Nascimento',
        email,
        password: '1234567'
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
