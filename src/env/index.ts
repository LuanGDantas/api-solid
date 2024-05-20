import 'dotenv/config';
import { z } from 'zod';
import logger from '../util/logger';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['developement', 'test', 'production'])
    .default('developement'),
  PORT: z.coerce.number().default(3003),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  logger.error('Invalid enviroment variable', _env.error.format());

  throw new Error(`Invalid enviroment variable.`);
}

export const env = _env.data;
