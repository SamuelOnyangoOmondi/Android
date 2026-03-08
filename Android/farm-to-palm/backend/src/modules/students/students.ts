import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../../db/knex.js';
import { createStudentBody } from '../../shared/validation/schemas.js';
import { terminalAuth } from '../../shared/middleware/auth.js';

export default async function (app: FastifyInstance) {
  app.post('/v1/students', { preHandler: terminalAuth }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = createStudentBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid body' });
    }
    const schoolId = (req as any).schoolId;
    const { externalId, name } = parsed.data;
    const existing = await db('students').where({ school_id: schoolId, external_id: externalId }).first();
    const now = new Date();
    if (existing) {
      await db('students').where({ id: existing.id }).update({ name, updated_at: now });
      return reply.send({ id: existing.id, externalId, name, schoolId });
    }
    const [row] = await db('students').insert({
      school_id: schoolId,
      external_id: externalId,
      name,
      created_at: now,
      updated_at: now,
    }).returning('*');
    return reply.send({ id: row.id, externalId, name, schoolId });
  });
}
