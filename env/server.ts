import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import { portSchema } from './schema';

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    SERVE: z.enum(['true', 'false']).default('false'),
    DEBUG_MODE: z.enum(['true', 'false']).default('false'),
    ELECTRIC_URL: z.string().default('ws://localhost:5133'),
    DATABASE_URL: z
      .string({
        required_error: `Database URL is not provided. Please provide one using the DATABASE_URL environment variable.`,
      })
      .default('postgresql://prisma:proxy_password@localhost:65432/electric'),
    ELECTRIC_PORT: portSchema.default(5133),
    ELECTRIC_PROXY_PORT: portSchema.default(65432),
    ELECTRIC_IMAGE: z.string().default('electricsql/electric:latest'),
  },
  runtimeEnv: process.env,
});
