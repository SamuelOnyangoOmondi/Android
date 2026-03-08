import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../../db/knex.js';
import { heartbeatBody } from '../../shared/validation/schemas.js';
import { terminalAuth } from '../../shared/middleware/auth.js';

export default async function (app: FastifyInstance) {
  app.post('/v1/terminals/heartbeat', { preHandler: terminalAuth }, async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = heartbeatBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid body' });
    }
    const { terminalId, appVersion, osVersion, deviceModel, lastError } = parsed.data;
    await db('terminals').where({ id: terminalId }).update({
      last_heartbeat_at: db.fn.now(),
      updated_at: db.fn.now(),
    });
    await db('terminal_heartbeats').insert({
      terminal_id: terminalId,
      app_version: appVersion,
      os_version: osVersion,
      device_model: deviceModel,
      last_error: lastError,
    });
    return reply.send({ ok: true });
  });
}
