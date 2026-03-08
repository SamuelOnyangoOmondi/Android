import type { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../../env.js';
import { verifyToken } from '../crypto/jwt.js';

export async function terminalAuth(req: FastifyRequest, reply: FastifyReply) {
  const auth = req.headers.authorization;
  const token = auth?.replace(/^Bearer\s+/i, '');
  if (!token) return reply.status(401).send({ error: 'Missing token' });
  try {
    const payload = verifyToken(token, env.JWT_SECRET);
    if (payload.typ !== 'terminal') return reply.status(401).send({ error: 'Invalid token' });
    (req as any).terminalId = payload.terminalId;
    (req as any).schoolId = payload.schoolId;
  } catch {
    return reply.status(401).send({ error: 'Invalid token' });
  }
}

export async function dashboardAuth(req: FastifyRequest, reply: FastifyReply) {
  const auth = req.headers.authorization;
  const token = auth?.replace(/^Bearer\s+/i, '');
  if (!token) return reply.status(401).send({ error: 'Unauthorized' });
  try {
    const payload = verifyToken(token, env.JWT_SECRET);
    if (payload.typ !== 'dashboard') return reply.status(401).send({ error: 'Invalid token' });
    (req as any).userId = payload.sub;
  } catch {
    return reply.status(401).send({ error: 'Invalid token' });
  }
}
