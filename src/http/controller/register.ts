import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { RegisterUseCase } from '@/use-cases/register';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import { CreateRegisterUseCase } from '@/use-cases/factories/creator-register-use-case';

export async function register(
  request: FastifyRequest, 
  reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const body = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = CreateRegisterUseCase();
    await registerUseCase.execute(body);
  }catch( err ) {
    if ( err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        message: err.message
      });
    }

    throw err; // TODO: fix
  }
  return reply.status(201).send();
}