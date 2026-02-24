import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Welcome back</h2>
                <p className="text-sm text-gray-500 mb-6 text-center">Sign in to access your chat history</p>
                <LoginForm />
            </div>
        </div>
    );
}
