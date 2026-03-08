import type { Knex } from 'knex';

export const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL ?? 'postgres://farmtopalm:farmtopalm_secret@localhost:5432/farmtopalm',
    migrations: { directory: './src/db/migrations', extension: 'js' },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { directory: './src/db/migrations', extension: 'js' },
  },
};

export default config;
