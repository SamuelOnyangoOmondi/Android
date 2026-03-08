import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { db } from '../../db/knex.js';
import { loginBody } from '../../shared/validation/schemas.js';
import { signToken } from '../../shared/crypto/jwt.js';
import { env } from '../../env.js';

export default async function (app: FastifyInstance) {
  app.post('/v1/auth/login', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = loginBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid body' });
    }
    const user = await db('users').where({ email: parsed.data.email }).first();
    if (!user || !bcrypt.compareSync(parsed.data.password, user.password_hash)) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }
    const token = signToken({ sub: user.id, typ: 'dashboard' }, env.JWT_SECRET);
    return reply.send({ token });
  });
}
