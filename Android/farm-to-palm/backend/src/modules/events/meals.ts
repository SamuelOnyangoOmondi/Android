import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../../db/knex.js';
import { mealBulkBody } from '../../shared/validation/schemas.js';
import { terminalAuth } from '../../shared/middleware/auth.js';
import { upsertMealsToSupabase } from '../../supabase/meals.js';

export default async function (app: FastifyInstance) {
  app.post('/v1/events/meals/bulk', { preHandler: terminalAuth }, async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = mealBulkBody.safeParse(req.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Invalid body' });
      }
      const now = new Date();
      const schoolIdFromToken = (req as any).schoolId;
      for (const e of parsed.data.events) {
        let studentId = e.studentId ?? e.externalId;
        if (!studentId && e.externalId) {
          const student = await db('students').where({ school_id: e.schoolId ?? schoolIdFromToken, external_id: e.externalId }).first();
          studentId = student?.id ?? e.externalId;
        }
        if (!studentId) continue;
        const schoolId = e.schoolId ?? schoolIdFromToken;
        if (!schoolId) continue;
        await db('meal_events').insert({
          id: e.eventId,
          student_id: studentId,
          terminal_id: e.terminalId,
          school_id: schoolId,
          ts: e.ts,
          method: e.method,
          created_at: now,
          updated_at: now,
        }).onConflict('id').ignore();
      }
      const supabaseResult = await upsertMealsToSupabase(parsed.data.events, schoolIdFromToken);
      if (!supabaseResult.ok) {
        req.log?.error({ err: supabaseResult.error, eventCount: parsed.data.events.length }, 'Supabase meals upsert failed - SupaSchool will not show records');
        return reply.status(503).send({ error: 'Failed to update SupaSchool', details: supabaseResult.error });
      }
      return reply.send({ count: parsed.data.events.length });
    } catch (err: any) {
      req.log?.error({ err }, 'Meals bulk failed');
      return reply.status(500).send({ error: 'Internal server error', details: err?.message ?? String(err) });
    }
  });
}
