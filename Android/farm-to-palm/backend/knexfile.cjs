// Must load env first so Knex sees DATABASE_URL (see: backend/.env or .ENV)
require('dotenv').config();
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '.ENV') });

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://farmtopalm:farmtopalm_secret@localhost:5432/farmtopalm',
    migrations: { directory: './src/db/migrations', extension: 'cjs' },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { directory: './src/db/migrations', extension: 'cjs' },
  },
};
