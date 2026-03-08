import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGO = 'aes-256-gcm';
const IV_LEN = 12;
const TAG_LEN = 16;
const KEY_LEN = 32;

function getKey(envKey: string): Buffer {
  const hex = envKey.replace(/[^0-9a-fA-F]/g, '').slice(0, 64);
  if (hex.length < 64) {
    return scryptSync(envKey, 'farmtopalm', KEY_LEN);
  }
  return Buffer.from(hex.slice(0, 64), 'hex');
}

export function encrypt(plain: Buffer, envKey: string): Buffer {
  const key = getKey(envKey);
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv, { authTagLength: TAG_LEN });
  const enc = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]);
}

export function decrypt(ciphertext: Buffer, envKey: string): Buffer {
  const key = getKey(envKey);
  const iv = ciphertext.subarray(0, IV_LEN);
  const tag = ciphertext.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const enc = ciphertext.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv(ALGO, key, iv, { authTagLength: TAG_LEN });
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]);
}
