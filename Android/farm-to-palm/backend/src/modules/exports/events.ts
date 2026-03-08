import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../../db/knex.js';
import { exportsQuery } from '../../shared/validation/schemas.js';
import { verifyToken } from '../../shared/crypto/jwt.js';
import { env } from '../../env.js';

export default async function (app: FastifyInstance) {
  app.get('/v1/exports/events.csv', async (req: FastifyRequest, reply: FastifyReply) => {
    const auth = req.headers.authorization;
    const token = auth?.replace(/^Bearer\s+/i, '');
    if (!token) return reply.status(401).send({ error: 'Unauthorized' });
    try {
      const payload = verifyToken(token, env.JWT_SECRET);
      if (payload.typ !== 'dashboard') return reply.status(401).send({ error: 'Invalid token' });
    } catch { return reply.status(401).send({ error: 'Invalid token' }); }
    const parsed = exportsQuery.safeParse(req.query as unknown);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid query' });
    }
    const { schoolId, from, to } = parsed.data;
    const start = new Date(from).getTime();
    const end = new Date(to + 'T23:59:59Z').getTime();
    let attQ = db('attendance_events').whereBetween('ts', [start, end]).select('*');
    let mealQ = db('meal_events').whereBetween('ts', [start, end]).select('*');
    if (schoolId) {
      attQ = attQ.andWhere({ school_id: schoolId });
      mealQ = mealQ.andWhere({ school_id: schoolId });
    }
    const [attendance, meals] = await Promise.all([attQ, mealQ]);
    const header = 'type,id,studentId,terminalId,schoolId,ts,confidence,method\n';
    const rows = [
      ...attendance.map((r: any) => `attendance,${r.id},${r.student_id},${r.terminal_id},${r.school_id},${r.ts},${r.confidence},`),
      ...meals.map((r: any) => `meal,${r.id},${r.student_id},${r.terminal_id},${r.school_id},${r.ts},,${r.method}`),
    ];
    const csv = header + rows.join('\n');
    return reply.header('Content-Type', 'text/csv').send(csv);
  });
}
