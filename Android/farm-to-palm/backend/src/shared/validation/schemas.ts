import { z } from 'zod';

export const activateBody = z.object({
  activationCode: z.string().min(1),
  deviceMeta: z.record(z.unknown()).optional(),
});

export const heartbeatBody = z.object({
  terminalId: z.string().uuid(),
  appVersion: z.string().optional(),
  osVersion: z.string().optional(),
  deviceModel: z.string().optional(),
  lastError: z.string().optional(),
});

export const createStudentBody = z.object({
  externalId: z.string().min(1),
  name: z.string().min(1),
  schoolId: z.string().uuid().optional(),
});

export const palmBody = z.object({
  hand: z.string(),
  rgbEnc: z.string(), // base64
  irEnc: z.string(),
  quality: z.number().int().min(0).max(100),
});

export const nfcBody = z.object({
  uid: z.string().min(1),
});

export const attendanceEventItem = z.object({
  eventId: z.string().uuid(),
  studentId: z.string().uuid().optional(),
  externalId: z.string().optional(),
  terminalId: z.string(),
  schoolId: z.string().uuid(),
  ts: z.number().int().positive(),
  confidence: z.number().min(0).max(1),
}).refine((d) => d.studentId != null || d.externalId != null, { message: 'studentId or externalId required' });

export const attendanceBulkBody = z.object({
  events: z.array(attendanceEventItem),
});

export const mealEventItem = z.object({
  eventId: z.string().uuid(),
  studentId: z.string().uuid().optional(),
  externalId: z.string().optional(),
  terminalId: z.string(),
  schoolId: z.string().uuid(),
  ts: z.number().int().positive(),
  method: z.enum(['nfc', 'palm', 'nfc_palm']),
}).refine((d) => d.studentId != null || d.externalId != null, { message: 'studentId or externalId required' });

export const mealBulkBody = z.object({
  events: z.array(mealEventItem),
});

export const loginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const dailyReportQuery = z.object({
  schoolId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const trendsQuery = z.object({
  schoolId: z.string().uuid().optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const exceptionsQuery = z.object({
  schoolId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const terminalsQuery = z.object({
  schoolId: z.string().uuid().optional(),
});

export const exportsQuery = z.object({
  schoolId: z.string().uuid().optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
