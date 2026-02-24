import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api";

const apiClient = axios.create({
    baseURL: BASE_URL,
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

// Automatically refresh the access token on 401 responses
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            const refreshToken =
                typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
                    localStorage.setItem("accessToken", data.accessToken);
                    if (data.refreshToken) {
                        localStorage.setItem("refreshToken", data.refreshToken);
                    }
                    original.headers.Authorization = `Bearer ${data.accessToken}`;
                    return apiClient(original);
                } catch {
                    // Refresh also failed — clear tokens so AuthInitializer clears the store
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                }
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
