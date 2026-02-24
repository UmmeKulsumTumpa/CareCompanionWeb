"use client";

import { Form, Input, Button, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function LoginForm() {
    const { login, loading, error } = useAuth();

    async function onFinish(values: { email: string; password: string }) {
        await login(values.email, values.password);
    }

    return (
        <Form layout="vertical" onFinish={onFinish} className="w-full">
            {error && <Alert message={error} type="error" showIcon className="mb-4" />}

            <Form.Item
                name="email"
                rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
            >
                <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: "Enter your password" }]}
            >
                <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Password"
                    size="large"
                />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading} block size="large" className="mt-1">
                Sign In
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                    Register
                </Link>
            </p>
        </Form>
    );
}
