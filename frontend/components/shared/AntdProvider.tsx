"use client";

import { ConfigProvider } from "antd";

export default function AntdProvider({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#2563eb",
                    borderRadius: 10,
                    fontFamily: "inherit",
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
}
