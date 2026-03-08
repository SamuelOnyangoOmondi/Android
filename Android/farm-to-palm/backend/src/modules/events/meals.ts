import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../../db/knex.js';
import { mealBulkBody } from '../../shared/validation/schemas.js';
import { terminalAuth } from '../../shared/middleware/auth.js';
import { upsertMealsToSupabase } from '../../supabase/meals.js';

export default async function (app: FastifyInstance) {
  app.post('/v1/events/meals/bulk', { preHandler: terminalAuth }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = mealBulkBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid body' });
    }
    const now = new Date();
    const schoolIdFromToken = (req as any).schoolId;
    for (const e of parsed.data.events) {
      let studentId = e.studentId;
      if (!studentId && e.externalId) {
        const student = await db('students').where({ school_id: e.schoolId ?? schoolIdFromToken, external_id: e.externalId }).first();
        studentId = student?.id;
      }
      if (!studentId) continue;
      await db('meal_events').insert({
        id: e.eventId,
        student_id: studentId,
        terminal_id: e.terminalId,
        school_id: e.schoolId ?? schoolIdFromToken,
        ts: e.ts,
        method: e.method,
        created_at: now,
        updated_at: now,
      }).onConflict('id').ignore();
    }
    const supabaseResult = await upsertMealsToSupabase(parsed.data.events, schoolIdFromToken);
    if (!supabaseResult.ok) {
      req.log?.warn({ err: supabaseResult.error }, 'Supabase meals upsert failed');
    }
    return reply.send({ count: parsed.data.events.length });
  });
}
