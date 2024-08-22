import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FeatchNearbyGymsUseCase } from './featch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FeatchNearbyGymsUseCase;

describe('Featch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FeatchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to featch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -6.1126492,
      longitude: -38.2034921
    });

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -6.0929119,
      longitude: -37.9265562
    });

    const { gyms } = await sut.execute({
      userLatitude: -6.1126492,
      userLongitude: -38.2034921
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});
