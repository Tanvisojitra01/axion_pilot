"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Settings,
    CreditCard,
    LogOut,
    ChevronLeft,
    User,
    Layers,
    Shield,
    Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/components/AuthProvider";

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const { logout, user } = useAuth();

    const baseLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Vault", href: "/dashboard/projects", icon: Layers },
        { name: "Profile", href: "/dashboard/profile", icon: User },
        { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
        ...(user?.email === "niyant214@gmail.com" ? [
            { name: "Admin Hub", href: "/admin", icon: Shield }
        ] : []),
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col border-r border-white/[0.04] bg-[#050505] h-screen transition-all duration-700 ease-[cubic-bezier(0.15,0,0.15,1)] relative z-30",
                collapsed ? "w-[72px]" : "w-64",
                className
            )}
        >
            <div className="px-6 py-10 flex items-center justify-between h-24">
                {!collapsed ? (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                        <Logo />
                    </div>
                ) : (
                    <div className="animate-in fade-in zoom-in duration-700 mx-auto">
                        <Logo variant="minimal" />
                    </div>
                )}
                
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full absolute -right-3 top-20 apple-glass shadow-apple text-zinc-600 hover:text-white transition-all"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronLeft className={cn("h-3 w-3 transition-transform duration-700", collapsed && "rotate-180")} />
                </Button>
            </div>

            <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
                {baseLinks.map((link) => {
                    const isActive = link.href === "/dashboard" 
                        ? pathname === "/dashboard"
                        : pathname.startsWith(link.href);
                        
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-bold tracking-tight transition-all duration-300 relative overflow-hidden group",
                                isActive
                                    ? "apple-glass text-white shadow-soft glow-blue border border-white/5"
                                    : "text-zinc-600 hover:text-white hover:bg-white/[0.03]",
                                collapsed && "justify-center px-0 h-11 w-11 mx-auto"
                            )}
                        >
                            <link.icon className={cn(
                                "h-4 w-4 transition-all duration-500",
                                isActive ? "text-white" : "text-zinc-700 group-hover:text-zinc-300"
                            )} />
                            
                            {!collapsed && <span>{link.name}</span>}
                        </Link>
                    );
                })}
            </div>

            {!collapsed && (
                <div className="mx-4 mb-6 p-6 rounded-[1.5rem] apple-glass border-blue-500/10 glow-blue group/pro overflow-hidden relative">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/10 rounded-full blur-2xl group-hover/pro:scale-150 transition-transform duration-700" />
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-3 h-3 text-blue-500" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-[2px]">Pro Version</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-medium mb-5 leading-relaxed">Get unlimited AI reports & 4K exports.</p>
                    <Link href="/dashboard/billing">
                        <button className="w-full py-2.5 rounded-xl bg-blue-500 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-blue-400 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]">
                            Upgrade
                        </button>
                    </Link>
                </div>
            )}

            <div className="p-4 mt-auto border-t border-white/[0.04]">
                <button
                    className={cn(
                        "w-full flex items-center h-12 rounded-2xl text-zinc-600 hover:text-white hover:bg-white/[0.03] transition-all duration-300 px-4 group/logout",
                        collapsed && "justify-center px-0 h-11 w-11 mx-auto"
                    )}
                    onClick={logout}
                >
                    <LogOut className="h-4 w-4 transition-transform group-hover/logout:-translate-x-1" />
                    {!collapsed && <span className="ml-4 text-[13px] font-bold tracking-tight">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}


