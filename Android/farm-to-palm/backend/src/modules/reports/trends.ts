import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../../db/knex.js';
import { trendsQuery } from '../../shared/validation/schemas.js';
import { dashboardAuth } from '../../shared/middleware/auth.js';

export default async function (app: FastifyInstance) {
  app.get('/v1/reports/trends', { preHandler: dashboardAuth }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = trendsQuery.safeParse(req.query as unknown);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid query' });
    }
    const { schoolId, from, to } = parsed.data;
    let attendanceQ = db('attendance_events').select(db.raw("to_timestamp(ts/1000)::date as day")).count('* as c').whereBetween('ts', [new Date(from).getTime(), new Date(to + 'T23:59:59Z').getTime()]).groupByRaw("to_timestamp(ts/1000)::date");
    let mealsQ = db('meal_events').select(db.raw("to_timestamp(ts/1000)::date as day")).count('* as c').whereBetween('ts', [new Date(from).getTime(), new Date(to + 'T23:59:59Z').getTime()]).groupByRaw("to_timestamp(ts/1000)::date");
    if (schoolId) {
      attendanceQ = attendanceQ.andWhere({ school_id: schoolId });
      mealsQ = mealsQ.andWhere({ school_id: schoolId });
    }
    const attendance = await attendanceQ;
    const meals = await mealsQ;
    return reply.send({ attendance, meals });
  });
}
