import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import crypto from 'crypto';
import { db } from '../../db/knex.js';
import { nfcBody } from '../../shared/validation/schemas.js';
import { terminalAuth } from '../../shared/middleware/auth.js';

export default async function (app: FastifyInstance) {
  app.post('/v1/students/:id/nfc', { preHandler: terminalAuth }, async (req: FastifyRequest, reply: FastifyReply) => {
    const studentId = (req.params as { id: string }).id;
    const parsed = nfcBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid body' });
    }
    const student = await db('students').where({ id: studentId }).first();
    if (!student) {
      return reply.status(404).send({ error: 'Student not found' });
    }
    const id = crypto.randomUUID();
    await db('nfc_cards').insert({
      id,
      student_id: studentId,
      uid: parsed.data.uid,
      created_at: new Date(),
      updated_at: new Date(),
    }).onConflict('uid').merge();
    return reply.send({ id });
  });
}
