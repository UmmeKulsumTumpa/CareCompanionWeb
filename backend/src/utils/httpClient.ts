import axios from "axios";
import env from "../config/env";

const mlClient = axios.create({
    baseURL: env.mlBackend.url,
    timeout: 600000, // 10 min — Qwen 3B on CPU can take several minutes
    headers: { "Content-Type": "application/json" },
});

export default mlClient;
