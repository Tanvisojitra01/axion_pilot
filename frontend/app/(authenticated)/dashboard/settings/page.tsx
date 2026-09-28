"use client";

import { useAuth } from "@/components/AuthProvider";
import { ProfileCard } from "./components/ProfileCard";
import { SecurityCard } from "./components/SecurityCard";
import { AdvancedSettings } from "./components/AdvancedSettings";
import { Settings as SettingsIcon, ShieldIcon, HelpCircle } from "lucide-react";

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-1000 px-4 lg:px-8 py-10">
            {/* ── Header Section ──────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/[0.04] pb-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 rounded-full apple-glass text-[9px] font-bold text-blue-500 tracking-[2px] uppercase">
                            Secure Workspace
                        </div>
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-bold tracking-[-0.05em] text-white leading-[0.8] flex items-center gap-6">
                        Preferen<span className="text-gradient-blue">ces</span>
                    </h1>
                    <p className="text-zinc-500 text-lg font-medium tracking-tight max-w-2xl leading-relaxed">
                        Fine-tune your architectural profile, security parameters, and operational environment.
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <button className="p-3 rounded-2xl apple-glass text-zinc-500 hover:text-white transition-all shadow-soft active:scale-[0.95]">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                    <div className="hidden md:flex items-center gap-3 px-6 py-3 rounded-2xl apple-glass shadow-soft glow-blue border-blue-soft">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-bold text-zinc-400 tracking-[1px]">ENCRYPTED</span>
                    </div>
                </div>
            </div>

            {/* ── Layout Sections ───────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-16 pt-6">
                {/* Profile Section */}
                <section className="space-y-8">
                    <div className="flex items-center gap-3 px-2">
                        <SettingsIcon className="w-4 h-4 text-zinc-600" />
                        <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[3px]">Identity</h2>
                    </div>
                    <ProfileCard user={user} />
                </section>

                {/* Security Section */}
                <section className="space-y-8">
                    <div className="flex items-center gap-3 px-2">
                        <ShieldIcon className="w-4 h-4 text-zinc-600" />
                        <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[3px]">Cybersecurity</h2>
                    </div>
                    <SecurityCard />
                </section>

                {/* Advanced Section */}
                <section className="space-y-8 pb-20">
                    <div className="flex items-center gap-3 px-2">
                        <HelpCircle className="w-4 h-4 text-zinc-600" />
                        <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[3px]">Environment</h2>
                    </div>
                    <AdvancedSettings />
                </section>
            </div>
        </div>
    );
}
