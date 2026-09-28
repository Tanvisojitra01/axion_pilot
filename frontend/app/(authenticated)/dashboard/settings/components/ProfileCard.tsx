"use client";

import { 
    User, 
    Mail, 
    Sparkles, 
    ShieldCheck, 
    ChevronRight,
    ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import Link from "next/link";

interface ProfileCardProps {
    user: any;
}

export function ProfileCard({ user }: ProfileCardProps) {
    return (
        <Card className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl group transition-all duration-300 hover:translate-y-[-4px] overflow-hidden">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -z-10 group-hover:bg-primary/20 transition-all duration-500" />
            
            <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                    <div className="relative group/icon">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-20 group-hover/icon:opacity-40 transition duration-300" />
                        <div className="relative p-2.5 rounded-xl bg-background/50 border border-white/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold tracking-tight">Account Profile</CardTitle>
                        <CardDescription className="text-zinc-500 font-medium tracking-wide">
                            Manage your personal account details
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Email Card */}
                    <div className="relative p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                                </div>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</span>
                            </div>
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shadow-emerald-500/20 drop-shadow-sm" />
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold tracking-tight text-zinc-200 truncate">{user?.email}</span>
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-2 group/btn">
                                Change
                                <ChevronRight className="w-3 h-3 ml-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                            </Button>
                        </div>
                    </div>

                    {/* Plan Card */}
                    <div className="relative p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                                </div>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Subscription Plan</span>
                            </div>
                            <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 h-5 px-2 text-[10px] font-bold tracking-widest rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                                ACTIVE
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold tracking-tight text-zinc-200 capitalize">{user?.plan || 'Free Plan'}</span>
                            <Link href="/dashboard/billing">
                                <Button variant="link" size="sm" className="h-auto p-0 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 group/link">
                                    Upgrade
                                    <ExternalLink className="w-3 h-3 ml-1 group-hover/link:opacity-100 transition-opacity" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Additional Info / Footer link */}
                <div className="pt-2 border-t border-white/[0.05]">
                    <p className="text-[11px] text-zinc-500 font-medium">
                        Your account was created on <span className="text-zinc-300">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>. Your email is verified for all platform communications.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
