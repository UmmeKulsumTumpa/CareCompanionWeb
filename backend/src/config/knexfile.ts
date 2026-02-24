import type { Knex } from "knex";
import dotenv from "dotenv";
dotenv.config();

const config: Knex.Config = {
    client: "pg",
    connection: {
        host: process.env.DB_HOST ?? "localhost",
        port: parseInt(process.env.DB_PORT ?? "5432"),
        database: process.env.DB_NAME ?? "caregiver_db",
        user: process.env.DB_USER ?? "postgres",
        password: process.env.DB_PASSWORD ?? "",
    },
    pool: { min: 2, max: 10 },
    migrations: {
        directory: "../../migrations",
        tableName: "knex_migrations",
        extension: "js",
    },
};

export default config;
