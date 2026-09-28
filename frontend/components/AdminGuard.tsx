"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { Loader2, ShieldOff } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const SUPER_ADMIN_EMAIL = "niyant214@gmail.com";

    useEffect(() => {
        if (!loading) {
            const isSuperAdmin = user?.email.toLowerCase() === SUPER_ADMIN_EMAIL;
            if (!user || !isSuperAdmin) {
                router.replace("/dashboard");
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-[#0a0d14]">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-zinc-600 font-black tracking-[4px] uppercase text-[10px] animate-pulse">
                    Authenticating Super-Sudo Credentials...
                </p>
            </div>
        );
    }

    const isSuperAdmin = user?.email.toLowerCase() === SUPER_ADMIN_EMAIL;
    if (!user || !isSuperAdmin) {
        return null;
    }

    return <>{children}</>;
}
