import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../../db/knex.js';
import { activateBody } from '../../shared/validation/schemas.js';
import { signToken } from '../../shared/crypto/jwt.js';
import { env } from '../../env.js';
import crypto from 'crypto';

export default async function (app: FastifyInstance) {
  app.post('/v1/terminals/activate', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = activateBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid body', details: parsed.error.flatten() });
    }
    const { activationCode, deviceMeta } = parsed.data;
    const row = await db('terminals').where({ activation_code: activationCode }).first();
    if (!row) {
      return reply.status(404).send({ error: 'Invalid activation code' });
    }
    const school = await db('schools').where({ id: row.school_id }).first();
    if (!school) {
      return reply.status(500).send({ error: 'School not found' });
    }
    const token = signToken(
      { terminalId: row.id, schoolId: row.school_id, typ: 'terminal' },
      env.JWT_SECRET
    );
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await db('terminals').where({ id: row.id }).update({
      token_hash: tokenHash,
      device_meta: deviceMeta ? JSON.stringify(deviceMeta) : null,
      last_heartbeat_at: db.fn.now(),
      updated_at: db.fn.now(),
    });
    return reply.send({
      terminalId: row.id,
      schoolId: row.school_id,
      apiBaseUrl: process.env.API_BASE_URL ?? `http://localhost:${env.PORT}`,
      token,
    });
  });
}
