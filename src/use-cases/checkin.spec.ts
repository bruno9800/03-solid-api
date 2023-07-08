import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './checkin';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { randomUUID } from 'crypto';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;


describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.items.push({
      id: 'gym-id',
      title: 'test-gyms',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      description: null,
      phone: null
    });
    

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check-in', async () => {

    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: randomUUID(),
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
  // red, green, refactor
  it('should not be able to check-in twice int the same day', async () => {
    vi.setSystemTime(new Date(2000, 0, 20, 8, 0, 0));
    const equalId = randomUUID();
    await sut.execute({
      gymId: 'gym-id',
      userId: equalId,
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() => sut.execute({
      gymId: 'gym-id',
      userId: equalId,
      userLatitude: 0,
      userLongitude: 0,
    })).rejects.toBeInstanceOf(Error);

  });

  it('should be able to check-in twice but in different day', async () => {
    vi.setSystemTime(new Date(2000, 0, 20, 8, 0, 0));
    const equalId = randomUUID();
    await sut.execute({
      gymId: 'gym-id',
      userId: equalId,
      userLatitude: 0,
      userLongitude: 0,
    });
    vi.setSystemTime(new Date(2000, 0, 21, 8, 0, 0));
    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: equalId,
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to cehck in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-id2',
      title: 'test-gyms',
      latitude: new Decimal(-9.383512),
      longitude: new Decimal(-40.4263048),
      description: null,
      phone: null
    });
    

    await expect(() => 
      sut.execute({
        gymId: 'gym-id',
        userId: randomUUID(),
        userLatitude: -9.4268207,
        userLongitude: -40.482135
      })
    ).rejects.toBeInstanceOf(Error);
    

  });
}); // describe