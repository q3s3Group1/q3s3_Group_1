import type {Metadata} from "next";
import "./globals.css";


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
        {children}
        </body>
        </html>
    );
}
