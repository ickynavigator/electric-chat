import { createEnv } from '@t3-oss/env-core';
import dotenv from 'dotenv';
import { z } from 'zod';
import { portSchema } from './schema';

dotenv.config();

export const env = createEnv({
  server: {
    APP_NAME: z.string().default('electric'),
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
    ELECTRIC_HOST_PORT: portSchema.optional(),
    ELECTRIC_HOST_PROXY_PORT: portSchema.optional(),
    ELECTRIC_IMAGE: z.string().default('electricsql/electric:latest'),
    LOGICAL_PUBLISHER_HOST: z.string().default('electric'),
    POSTGRES_PORT: portSchema.default(5432),
    POSTGRES_HOST: z.string().default('postgres'),
    POSTGRES_USER: z.string().default('postgres'),
    POSTGRES_PASSWORD: z.string().default('pg_password'),
    PG_PROXY_PASSWORD: z.string().default('proxy_password'),
  },
  runtimeEnv: process.env,
});
