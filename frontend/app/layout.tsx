import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/AuthProvider";
import { ChatBot } from "../components/ChatBot";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "AxionX | AI Project Generator",
  description: "Next-generation AI Project Generator, Viva Assistant, and Management Control Center.",
  metadataBase: new URL("https://axiox.com"),
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0f1219" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <ChatBot />
        </AuthProvider>
      </body>
    </html>
  );
}
