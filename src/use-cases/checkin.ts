import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { CheckIn } from '@prisma/client';

interface CheckInRequest {
  userId: string;
  gymId: string;
}

interface CheckInResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInRepository: CheckInsRepository,
  ) {}
  
  async execute({
    userId,
    gymId
  }: CheckInRequest): Promise<CheckInResponse> {
    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId
    });

    return {
      checkIn,
    };
  }
}