import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../../db/knex.js';
import { terminalsQuery } from '../../shared/validation/schemas.js';
import { dashboardAuth } from '../../shared/middleware/auth.js';

export default async function (app: FastifyInstance) {
  app.get('/v1/reports/terminals', { preHandler: dashboardAuth }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = terminalsQuery.safeParse(req.query as unknown);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid query' });
    }
    let q = db('terminals').select('id', 'school_id', 'last_heartbeat_at', 'updated_at');
    if (parsed.data.schoolId) q = q.where({ school_id: parsed.data.schoolId });
    const list = await q;
    const now = Date.now();
    const fiveMin = 5 * 60 * 1000;
    const withStatus = list.map((t: any) => ({
      ...t,
      online: t.last_heartbeat_at ? now - new Date(t.last_heartbeat_at).getTime() < fiveMin : false,
    }));
    return reply.send({ terminals: withStatus });
  });
}
