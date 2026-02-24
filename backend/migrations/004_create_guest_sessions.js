exports.up = function (knex) {
    return knex.schema.createTable("guest_sessions", (table) => {
        table.uuid("id").primary();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("expires_at").notNullable();
        table.jsonb("messages").defaultTo("[]");
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("guest_sessions");
};
