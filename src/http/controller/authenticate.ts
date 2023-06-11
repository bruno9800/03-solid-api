import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { CreateAuthenticateUseCase } from '@/use-cases/factories/create-authenticate-use-case';

export async function authenticate(
  request: FastifyRequest, 
  reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const body = registerBodySchema.parse(request.body);

  try {
    const authenticateUseCase = new CreateAuthenticateUseCase().factoryMethod();
    await authenticateUseCase.execute(body);
  }catch( err ) {
    if ( err instanceof InvalidCredentialsError) {
      return reply.status(400).send({
        message: err.message
      });
    }

    throw err; // TODO: fix
  }
  return reply.status(200).send();
}