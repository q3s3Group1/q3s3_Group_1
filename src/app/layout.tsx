// app/layout.tsx
import type {Metadata} from "next";
import "./globals.css";
import { ClientProviders } from '@/components/ClientProviders';

export const metadata: Metadata = {
    title: "Q3",
    description: "Q3",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}