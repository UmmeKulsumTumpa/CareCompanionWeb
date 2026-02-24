import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/shared/ReduxProvider";
import AntdProvider from "@/components/shared/AntdProvider";
import AuthInitializer from "@/components/shared/AuthInitializer";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CareCompanion — Alzheimer's & Dementia Support",
    description: "An evidence-based caregiving assistant for Alzheimer's and dementia caregivers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geist.className} bg-white`}>
                <ReduxProvider>
                    <AntdProvider>
                        <AuthInitializer />
                        {children}
                    </AntdProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}

