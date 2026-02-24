"use client";

import Link from "next/link";

interface BrandLogoProps {
    /** "sm" = sidebar compact, "md" = header, "lg" = landing hero */
    size?: "sm" | "md" | "lg";
    /** show only the icon mark without the wordmark */
    iconOnly?: boolean;
    href?: string;
    className?: string;
}

/** Standalone icon mark — works at any size */
export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            {/* Rounded square bg */}
            <rect width="40" height="40" rx="10" fill="#10a37f" />

            {/* Heart path */}
            <path
                d="M20 29.5C20 29.5 10.5 23.2 10.5 16.8C10.5 14.0 12.75 12 15.5 12C17.15 12 18.63 12.82 19.5 14.07C20.37 12.82 21.85 12 23.5 12C26.25 12 28.5 14.0 28.5 16.8C28.5 23.2 20 29.5 20 29.5Z"
                fill="white"
                fillOpacity="0.95"
            />

            {/* Sparkle dot top-right of heart — signals AI / intelligence */}
            <circle cx="27.5" cy="11.5" r="2" fill="white" fillOpacity="0.7" />
            <circle cx="27.5" cy="11.5" r="1" fill="white" />
        </svg>
    );
}

const sizes = {
    sm: { icon: 26, text: "text-sm",    sub: null },
    md: { icon: 30, text: "text-base",  sub: "text-xs" },
    lg: { icon: 52, text: "text-2xl",   sub: "text-sm" },
};

export default function BrandLogo({
    size = "md",
    iconOnly = false,
    href = "/",
    className = "",
}: BrandLogoProps) {
    const s = sizes[size];

    const inner = (
        <span className={`flex items-center gap-2.5 select-none ${className}`}>
            <LogoMark size={s.icon} />
            {!iconOnly && (
                <span className="flex flex-col leading-tight">
                    <span className={`font-semibold text-gray-900 tracking-tight ${s.text}`}>
                        CareCompanion
                    </span>
                    {s.sub && (
                        <span className={`text-gray-400 font-normal ${s.sub}`}>
                            Alzheimer &amp; Dementia Support
                        </span>
                    )}
                </span>
            )}
        </span>
    );

    if (!href) return inner;
    return (
        <Link href={href} className="inline-flex items-center hover:opacity-90 transition-opacity">
            {inner}
        </Link>
    );
}
