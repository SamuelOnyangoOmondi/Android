/**
 * Run from backend folder: node scripts/check-env.mjs
 * Verifies that .env / .ENV is loaded and DATABASE_URL is set (masked).
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

dotenv.config();
dotenv.config({ path: path.join(root, '.env') });
dotenv.config({ path: path.join(root, '.ENV') });

const url = process.env.DATABASE_URL;
if (!url) {
  console.log('DATABASE_URL: undefined (env not loaded or not set)');
  process.exit(1);
}
// Mask password: show protocol and host only
try {
  const u = new URL(url.replace(/^postgres:/, 'postgresql:'));
  u.password = u.password ? '***' : '';
  console.log('DATABASE_URL is set. Host:', u.hostname, 'Port:', u.port, 'User:', u.username);
} catch {
  console.log('DATABASE_URL is set (length:', url.length, ')');
}
