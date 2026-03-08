/** @param { import("knex").Knex } knex */
exports.up = async function (knex) {
  await knex.schema.createTable('schools', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name').notNullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable('terminals', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('school_id').references('id').inTable('schools').onDelete('CASCADE');
    t.string('activation_code').unique().notNullable();
    t.string('token_hash');
    t.jsonb('device_meta');
    t.timestamp('last_heartbeat_at');
    t.timestamps(true, true);
  });

  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('email').unique().notNullable();
    t.string('password_hash').notNullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable('students', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('school_id').references('id').inTable('schools').onDelete('CASCADE');
    t.string('external_id').notNullable();
    t.string('name').notNullable();
    t.timestamps(true, true);
    t.unique(['school_id', 'external_id']);
  });

  await knex.schema.createTable('palm_templates', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('student_id').references('id').inTable('students').onDelete('CASCADE');
    t.string('hand').notNullable();
    t.binary('rgb_enc').notNullable();
    t.binary('ir_enc').notNullable();
    t.integer('quality');
    t.timestamps(true, true);
  });

  await knex.schema.createTable('nfc_cards', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('student_id').references('id').inTable('students').onDelete('CASCADE');
    t.string('uid').unique().notNullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable('attendance_events', (t) => {
    t.string('id').primary();
    t.uuid('student_id').references('id').inTable('students');
    t.string('terminal_id').notNullable();
    t.uuid('school_id').references('id').inTable('schools');
    t.bigInteger('ts').notNullable();
    t.float('confidence');
    t.timestamps(true, true);
  });

  await knex.schema.createTable('meal_events', (t) => {
    t.string('id').primary();
    t.uuid('student_id').references('id').inTable('students');
    t.string('terminal_id').notNullable();
    t.uuid('school_id').references('id').inTable('schools');
    t.bigInteger('ts').notNullable();
    t.string('method').notNullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable('terminal_heartbeats', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('terminal_id').notNullable();
    t.string('app_version');
    t.string('os_version');
    t.string('device_model');
    t.string('last_error');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/** @param { import("knex").Knex } knex */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('terminal_heartbeats');
  await knex.schema.dropTableIfExists('meal_events');
  await knex.schema.dropTableIfExists('attendance_events');
  await knex.schema.dropTableIfExists('nfc_cards');
  await knex.schema.dropTableIfExists('palm_templates');
  await knex.schema.dropTableIfExists('students');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('terminals');
  await knex.schema.dropTableIfExists('schools');
};
