import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../../db/knex.js';
import { palmBody } from '../../shared/validation/schemas.js';
import { terminalAuth } from '../../shared/middleware/auth.js';
import crypto from 'crypto';
import { encrypt } from '../../shared/crypto/encrypt.js';
import { env } from '../../env.js';

export default async function (app: FastifyInstance) {
  app.post('/v1/students/:id/palm', { preHandler: terminalAuth }, async (req: FastifyRequest, reply: FastifyReply) => {
    const studentId = (req.params as { id: string }).id;
    const parsed = palmBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid body' });
    }
    const student = await db('students').where({ id: studentId }).first();
    if (!student) {
      return reply.status(404).send({ error: 'Student not found' });
    }
    const rgbBuf = Buffer.from(parsed.data.rgbEnc, 'base64');
    const irBuf = Buffer.from(parsed.data.irEnc, 'base64');
    const rgbEnc = encrypt(rgbBuf, env.BIOMETRIC_ENC_KEY);
    const irEnc = encrypt(irBuf, env.BIOMETRIC_ENC_KEY);
    const id = crypto.randomUUID();
    await db('palm_templates').insert({
      id,
      student_id: studentId,
      hand: parsed.data.hand,
      rgb_enc: rgbEnc,
      ir_enc: irEnc,
      quality: parsed.data.quality,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return reply.send({ id });
  });
}
