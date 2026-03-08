import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: '.ENV' }); // Windows: .ENV (capital) often used
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './env.js';
import activate from './modules/terminals/activate.js';
import heartbeat from './modules/terminals/heartbeat.js';
import students from './modules/students/students.js';
import palm from './modules/biometrics/palm.js';
import nfc from './modules/students/nfc.js';
import attendanceBulk from './modules/events/attendance.js';
import mealsBulk from './modules/events/meals.js';
import daily from './modules/reports/daily.js';
import trends from './modules/reports/trends.js';
import exceptions from './modules/reports/exceptions.js';
import terminalsReport from './modules/reports/terminals.js';
import eventsCsv from './modules/exports/events.js';
import login from './modules/auth/login.js';

async function main() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true });
  await app.register(activate);
  await app.register(heartbeat);
  await app.register(students);
  await app.register(palm);
  await app.register(nfc);
  await app.register(attendanceBulk);
  await app.register(mealsBulk);
  await app.register(daily);
  await app.register(trends);
  await app.register(exceptions);
  await app.register(terminalsReport);
  await app.register(eventsCsv);
  await app.register(login);
  app.get('/health', async () => ({ ok: true }));
  app.get('/', async () => ({ ok: true, message: 'FarmToPalm API. Use /health or /v1/...' }));
  await app.listen({ port: env.PORT, host: '0.0.0.0' });
  console.log(`Backend listening on http://0.0.0.0:${env.PORT} (reachable on your LAN IP, e.g. http://192.168.1.128:3000)`);
}
main().catch((e) => { console.error(e); process.exit(1); });
