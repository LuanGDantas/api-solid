import { describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const userRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    const { user } = await registerUseCase.execute({
      name: 'Snicker Sousa',
      email: 'snicker@example.com',
      password: '1234567'
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const userRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    const { user } = await registerUseCase.execute({
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
    const userRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    const email = 'snicker@example.com';

    await registerUseCase.execute({
      name: 'Snicker Sousa',
      email,
      password: '1234567'
    });

    await expect(() =>
      registerUseCase.execute({
        name: 'Snicker Nascimento',
        email,
        password: '1234567'
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
