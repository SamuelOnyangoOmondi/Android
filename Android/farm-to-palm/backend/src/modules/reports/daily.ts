import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../../db/knex.js';
import { dailyReportQuery } from '../../shared/validation/schemas.js';
import { dashboardAuth } from '../../shared/middleware/auth.js';

export default async function (app: FastifyInstance) {
  app.get('/v1/reports/daily', { preHandler: dashboardAuth }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = dailyReportQuery.safeParse(req.query as unknown);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid query' });
    }
    const { schoolId, date } = parsed.data;
    const start = new Date(date + 'T00:00:00Z').getTime();
    const end = start + 24 * 60 * 60 * 1000;
    let attendanceQ = db('attendance_events').whereBetween('ts', [start, end]);
    let mealsQ = db('meal_events').whereBetween('ts', [start, end]);
    if (schoolId) {
      attendanceQ = attendanceQ.andWhere({ school_id: schoolId });
      mealsQ = mealsQ.andWhere({ school_id: schoolId });
    }
    const [attendanceCount] = await attendanceQ.count('* as c');
    const [mealCount] = await mealsQ.count('* as c');
    return reply.send({
      date,
      schoolId: schoolId ?? null,
      attendance: Number((attendanceCount as any)?.c ?? 0),
      meals: Number((mealCount as any)?.c ?? 0),
    });
  });
}
