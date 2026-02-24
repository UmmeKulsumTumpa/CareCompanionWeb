exports.up = function (knex) {
    return knex.schema.createTable("messages", (table) => {
        table.uuid("id").primary();
        table.uuid("conversation_id").references("id").inTable("conversations").onDelete("CASCADE");
        table.enu("role", ["user", "assistant"]).notNullable();
        table.text("content").notNullable();
        table.jsonb("related_experiences").nullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("messages");
};
