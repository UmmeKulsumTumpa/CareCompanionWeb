export interface User {
    id: string;
    email: string;
    password: string;
    name: string | null;
    created_at: Date;
}

export interface Conversation {
    id: string;
    user_id: string;
    title: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface Message {
    id: string;
    conversation_id: string;
    role: "user" | "assistant";
    content: string;
    related_experiences: RelatedExperience[] | null;
    created_at: Date;
}

export interface GuestSession {
    id: string;
    created_at: Date;
    expires_at: Date;
    messages: GuestMessage[];
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

export interface MLChatRequest {
    query: string;
    chat_history: { role: string; content: string }[];
    include_related_experiences: boolean;
}

export interface MLChatResponse {
    answer: string;
    sources: SourceReference[];
    related_experiences: RelatedExperience[];
}

export interface JwtPayload {
    id: string;
    email: string;
    iat?: number;
    exp?: number;
}
