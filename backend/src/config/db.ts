import knex from "knex";
import env from "./env";

const db = knex({
    client: "pg",
    connection: {
        host: env.db.host,
        port: env.db.port,
        database: env.db.name,
        user: env.db.user,
        password: env.db.password,
    },
    pool: { min: 2, max: 10 },
    migrations: {
        directory: "./migrations",
        tableName: "knex_migrations",
        extension: "js",
    },
});

export default db;
