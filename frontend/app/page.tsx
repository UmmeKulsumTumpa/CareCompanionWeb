"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGuestSession } from "@/hooks/useGuestSession";
import { ArrowRightIcon } from "lucide-react";
import BrandLogo from "@/components/shared/BrandLogo";

export default function LandingPage() {
    const router = useRouter();
    const { startGuestSession, loading } = useGuestSession();

    async function handleGuestAccess() {
        await startGuestSession();
        router.push("/chat");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
            {/* Top right auth links */}
            <div className="absolute top-4 right-6 flex items-center gap-3">
                <Link
                    href="/login"
                    className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                    Sign in
                </Link>
                <Link
                    href="/register"
                    className="text-sm font-medium px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Create account
                </Link>
            </div>

            <div className="max-w-2xl w-full">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <BrandLogo size="lg" href="/" />
                </div>

                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    How can I help you today?
                </h1>
                <p className="text-base text-gray-500 mb-10">
                    Evidence-based support for Alzheimer&apos;s and dementia caregivers.
                </p>

                {/* Suggestion cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                    {[
                        { label: "Managing daily care routines", sub: "Tips for bathing, meals, and medication" },
                        { label: "Handling behavioral changes", sub: "Understand agitation and wandering" },
                        { label: "Communication strategies", sub: "How to talk with someone with dementia" },
                        { label: "Caregiver self-care", sub: "Preventing burnout and finding support" },
                    ].map((card) => (
                        <button
                            key={card.label}
                            onClick={handleGuestAccess}
                            disabled={loading}
                            className="group text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-150 disabled:opacity-60"
                        >
                            <p className="text-sm font-medium text-gray-800">{card.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{card.sub}</p>
                        </button>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                        onClick={handleGuestAccess}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#10a37f] text-white text-sm font-medium hover:bg-[#0d8f6e] transition-colors disabled:opacity-60 shadow-sm"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <ArrowRightIcon size={16} />
                        )}
                        Start a conversation
                    </button>
                </div>

                <p className="text-xs text-gray-400 mt-6">
                    Guest sessions expire after 24 hours. <Link href="/register" className="underline hover:text-gray-600">Create an account</Link> to save your history.
                </p>
            </div>
        </div>
    );
}
