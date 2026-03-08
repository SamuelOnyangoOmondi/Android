import knex from 'knex';
import { env } from '../env.js';

export const db = knex({
  client: 'pg',
  connection: env.DATABASE_URL,
  pool: { min: 1, max: 10 },
});
