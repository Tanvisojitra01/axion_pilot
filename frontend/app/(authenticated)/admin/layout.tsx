"use client";

import AdminGuard from "@/components/AdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <div className="animate-in fade-in zoom-in-95 duration-500">
                {children}
            </div>
        </AdminGuard>
    );
}
