"use client";

import { Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGuestSession } from "@/hooks/useGuestSession";

export default function LandingPage() {
    const router = useRouter();
    const { startGuestSession, loading } = useGuestSession();

    async function handleGuestAccess() {
        await startGuestSession();
        router.push("/chat");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4">
            <div className="max-w-xl">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">You Are Not Alone</h1>
                <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                    CareCompanion provides evidence-based guidance for caregivers.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/register">
                        <Button type="primary" size="large" className="w-full sm:w-auto px-8">
                            Create an Account
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button size="large" className="w-full sm:w-auto px-8">Sign In</Button>
                    </Link>
                    <Button
                        size="large"
                        type="dashed"
                        loading={loading}
                        onClick={handleGuestAccess}
                        className="w-full sm:w-auto px-8"
                    >
                        Continue as Guest
                    </Button>
                </div>
                <p className="text-xs text-gray-400 mt-6">Guest sessions expire after 24 hours.</p>
            </div>
        </div>
    );
}
