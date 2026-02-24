"use client";

import { Form, Input, Button, Alert } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterForm() {
    const { register, loading, error } = useAuth();

    async function onFinish(values: { name: string; email: string; password: string }) {
        await register(values.name, values.email, values.password);
    }

    return (
        <Form layout="vertical" onFinish={onFinish} className="w-full">
            {error && <Alert message={error} type="error" showIcon className="mb-4" />}

            <Form.Item
                name="name"
                rules={[{ required: true, min: 2, message: "Enter your name (min 2 characters)" }]}
            >
                <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Full Name" size="large" />
            </Form.Item>

            <Form.Item
                name="email"
                rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
            >
                <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, min: 8, message: "Password must be at least 8 characters" }]}
            >
                <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Password (min 8 characters)"
                    size="large"
                />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading} block size="large" className="mt-1">
                Create Account
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                    Sign In
                </Link>
            </p>
        </Form>
    );
}
