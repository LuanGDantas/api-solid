import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { GetUserProfileUseCase } from './get-user-profile';
import { hash } from 'bcryptjs';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let userRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(userRepository);
  });

  it('should be able to get user profile', async () => {
    const createdUser = await userRepository.create({
      name: 'Snicker Sousa',
      email: 'snicker@example.com',
      password_hash: await hash('1234567', 6)
    });

    const { user } = await sut.execute({
      userId: createdUser.id
    });

    expect(user.name).toEqual(createdUser.name);
  });

  it('should not be able to get user profile', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
