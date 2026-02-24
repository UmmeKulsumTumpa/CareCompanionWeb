import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api",
    timeout: 600000, // 10 min — matches backend → ML backend timeout
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        const guestSessionId = sessionStorage.getItem("guestSessionId");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (guestSessionId) {
            config.headers["x-guest-session-id"] = guestSessionId;
        }
    }
    return config;
});

export default apiClient;
