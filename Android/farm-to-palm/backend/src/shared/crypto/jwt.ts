import crypto from 'crypto';

export function signToken(payload: Record<string, string>, secret: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token: string, secret: string): Record<string, string> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  const expected = crypto.createHmac('sha256', secret).update(`${parts[0]}.${parts[1]}`).digest('base64url');
  if (parts[2] !== expected) throw new Error('Invalid signature');
  return JSON.parse(Buffer.from(parts[1], 'base64url').toString());
}
