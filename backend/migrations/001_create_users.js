exports.up = function (knex) {
    return knex.schema.createTable("users", (table) => {
        table.uuid("id").primary();
        table.string("email").unique().notNullable();
        table.string("password").notNullable();
        table.string("name");
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("users");
};
