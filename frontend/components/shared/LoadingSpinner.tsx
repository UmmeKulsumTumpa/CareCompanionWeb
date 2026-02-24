"use client";

import { Spin } from "antd";

interface LoadingSpinnerProps {
    size?: "small" | "default" | "large";
    tip?: string;
    fullPage?: boolean;
}

export default function LoadingSpinner({ size = "default", tip, fullPage = false }: LoadingSpinnerProps) {
    if (fullPage) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spin size={size} tip={tip} />
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center py-8">
            <Spin size={size} tip={tip} />
        </div>
    );
}
