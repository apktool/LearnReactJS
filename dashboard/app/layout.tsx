import '@/app/ui/global.css';
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import React from "react";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: {
        template: '%s | Apktool Dashboard',
        default: "Apktool"
    },
    description: 'Generated by create next app',
    metadataBase: new URL("http://localhost:3000")
}

export default function RootLayout({children,}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>{children}</body>
        </html>
    )
}
