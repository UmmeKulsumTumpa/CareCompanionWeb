exports.up = function (knex) {
    return knex.schema.createTable("conversations", (table) => {
        table.uuid("id").primary();
        table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.string("title");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("conversations");
};
