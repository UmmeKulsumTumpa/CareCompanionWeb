import apiClient from "../utils/apiClient";
import { LoginResponse, RegisterResponse } from "@/types";

export async function register(name: string, email: string, password: string): Promise<RegisterResponse> {
    const { data } = await apiClient.post<RegisterResponse>("/auth/register", { name, email, password });
    return data;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>("/auth/login", { email, password });
    return data;
}

export async function logout(): Promise<void> {
    await apiClient.post("/auth/logout");
}
