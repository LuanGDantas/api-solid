import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';
import { beforeEach, describe, expect, it } from 'vitest';

let gymRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymRepository);
  });

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Java Gym',
      description: 'Apenas para javeiros.',
      phone: '8499995632',
      latitude: -6.1126492,
      longitude: -38.2034921
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
