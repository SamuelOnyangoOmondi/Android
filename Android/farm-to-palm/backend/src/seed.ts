import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: '.ENV' });
import { db } from './db/knex.js';
import bcrypt from 'bcryptjs';

async function seed() {
  const schoolId = 'a0000000-0000-0000-0000-000000000001';
  const terminalId = 'b0000000-0000-0000-0000-000000000001';
  const activationCode = 'FARM-PALM-001';

  await db('schools').insert({ id: schoolId, name: 'Demo School', created_at: new Date(), updated_at: new Date() }).onConflict('id').ignore();
  await db('terminals').insert({
    id: terminalId,
    school_id: schoolId,
    activation_code: activationCode,
    created_at: new Date(),
    updated_at: new Date(),
  }).onConflict('id').ignore();

  const hash = bcrypt.hashSync('Admin123!', 10);
  await db('users').insert({
    email: 'admin@farmtopalm.local',
    password_hash: hash,
    created_at: new Date(),
    updated_at: new Date(),
  }).onConflict('email').ignore();

  console.log('Seed done.');
  console.log('Dashboard login: admin@farmtopalm.local / Admin123!');
  console.log('Terminal activation code:', activationCode);
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
