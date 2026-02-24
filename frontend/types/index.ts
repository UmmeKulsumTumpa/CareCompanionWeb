export interface User {
    id: string;
    name: string | null;
    email: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
}

export interface Conversation {
    id: string;
    user_id: string;
    title: string | null;
    created_at: string;
    updated_at: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    role: "user" | "assistant";
    content: string;
    related_experiences: RelatedExperience[] | null;
    created_at: string;
}

export interface GuestMessage {
    role: "user" | "assistant";
    content: string;
    related_experiences?: RelatedExperience[];
    timestamp: string;
}

export interface RelatedExperience {
    text: string;
    source: string;
    url: string;
    similarity_score: number;
}

export interface SourceReference {
    name: string;
    url: string;
}

export interface SendMessageResponse {
    answer: string;
    sources: SourceReference[];
    related_experiences: RelatedExperience[];
    conversationId: string;
}

export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RegisterResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}
