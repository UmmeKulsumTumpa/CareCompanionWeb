import dotenv from "dotenv";
dotenv.config();

const env = {
    port: parseInt(process.env.PORT ?? "5000"),
    nodeEnv: process.env.NODE_ENV ?? "development",
    db: {
        host: process.env.DB_HOST ?? "localhost",
        port: parseInt(process.env.DB_PORT ?? "5432"),
        name: process.env.DB_NAME ?? "caregiver_db",
        user: process.env.DB_USER ?? "postgres",
        password: process.env.DB_PASSWORD ?? "",
    },
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET ?? "change_this_access_secret",
        refreshSecret: process.env.JWT_REFRESH_SECRET ?? "change_this_refresh_secret",
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
    },
    mlBackend: {
        url: process.env.ML_BACKEND_URL ?? "http://localhost:8000",
    },
    guestSessionTtlHours: parseInt(process.env.GUEST_SESSION_TTL_HOURS ?? "24"),
    chatHistoryLimit: parseInt(process.env.CHAT_HISTORY_LIMIT ?? "10"),
};

export default env;
