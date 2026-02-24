import app from "./app";
import env from "./config/env";
import db from "./config/db";

async function start(): Promise<void> {
    await db.raw("SELECT 1");
    console.log("Database connected");

    app.listen(env.port, () => {
        console.log(`Server running on port ${env.port}`);
    });
}

start().catch((err: Error) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
