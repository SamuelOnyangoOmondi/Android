import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../../db/knex.js';
import { exceptionsQuery } from '../../shared/validation/schemas.js';
import { dashboardAuth } from '../../shared/middleware/auth.js';

export default async function (app: FastifyInstance) {
  app.get('/v1/reports/exceptions', { preHandler: dashboardAuth }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = exceptionsQuery.safeParse(req.query as unknown);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid query' });
    }
    const { schoolId, date } = parsed.data;
    const start = new Date(date + 'T00:00:00Z').getTime();
    const end = start + 24 * 60 * 60 * 1000;
    let q = db('attendance_events').whereBetween('ts', [start, end]).select('*');
    if (schoolId) q = q.andWhere({ school_id: schoolId });
    const list = await q;
    return reply.send({ exceptions: list });
  });
}
