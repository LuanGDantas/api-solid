import fastify from 'fastify';
import { appRoutes } from './http/routes';
import { ZodError } from 'zod';
import logger from './utils/logger';

export const app = fastify();

app.register(appRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() });
  }

  logger.error(error);

  return reply.status(500).send({ message: 'Internal server error.' });
});
