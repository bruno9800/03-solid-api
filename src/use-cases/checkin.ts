import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import { getDistanceBetweenCoordinate } from '@/utils/get-distance-between-coordinates';

interface CheckInRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}
  
  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude
  }: CheckInRequest): Promise<CheckInResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if(!gym){
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinate({
      latitude: userLatitude,
      longitude: userLongitude,
    }, {
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    });
    const MAX_DISTANCE_KM = 0.1;
    if(distance > MAX_DISTANCE_KM) {
      throw new Error();
    }

    const checkInOnSameDate = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if(checkInOnSameDate) {
      throw new Error();
    }

    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId
    });

    return {
      checkIn,
    };
  }
}