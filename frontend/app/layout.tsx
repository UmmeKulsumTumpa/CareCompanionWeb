import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import AntdProvider from "@/components/shared/AntdProvider";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CareCompanion — Alzheimer's & Dementia Support",
    description: "An evidence-based caregiving assistant for Alzheimer's and dementia caregivers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geist.className} bg-gray-50 min-h-screen flex flex-col`}>
                <AntdProvider>
                    <Header />
                    <main className="flex-1">{children}</main>
                </AntdProvider>
            </body>
        </html>
    );
}
