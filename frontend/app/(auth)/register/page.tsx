import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Create Account</h2>
                <p className="text-sm text-gray-500 mb-6 text-center">Save your chat history across devices</p>
                <RegisterForm />
            </div>
        </div>
    );
}
