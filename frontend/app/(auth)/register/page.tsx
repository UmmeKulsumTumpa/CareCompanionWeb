import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white px-4">
            {/* Back to home */}
            <div className="absolute top-4 left-6">
                <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <span className="w-6 h-6 rounded-full bg-[#10a37f] flex items-center justify-center">
                        <span className="text-white text-xs font-bold">C</span>
                    </span>
                    CareCompanion
                </Link>
            </div>

            <div className="w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1 text-center">Create an account</h2>
                <p className="text-sm text-gray-500 mb-8 text-center">Save your chat history across devices</p>
                <RegisterForm />
            </div>
        </div>
    );
}
