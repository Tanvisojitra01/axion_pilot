"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import AuthGuard from "@/components/AuthGuard";

import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex h-screen bg-background text-foreground overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0 bg-muted/20">
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-hide">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
