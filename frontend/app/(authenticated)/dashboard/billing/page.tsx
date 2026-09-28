"use client";

import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Zap, Crown, Rocket, Check, Sparkles, BarChart3, FileText, MonitorPlay, MessageSquare, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
    {
        id: "free",
        name: "Free",
        price: "₹0",
        period: "forever",
        icon: Zap,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        features: [
            "3 Projects / month",
            "Basic Report Generation",
            "Standard PPT Export",
            "5 Viva Questions / project",
            "Community Support",
        ],
        limits: { projects: 3, reports: 3, presentations: 3, viva: 5 }
    },
    {
        id: "pro",
        name: "Pro",
        price: "₹499",
        period: "/ month",
        icon: Crown,
        color: "text-primary",
        bg: "bg-primary/10",
        border: "border-primary/30",
        popular: true,
        features: [
            "25 Projects / month",
            "Advanced Report with Diagrams",
            "Professional PPT with Animations",
            "Unlimited Viva Questions",
            "Priority AI Processing",
            "Full Project Export (ZIP)",
            "Email Support",
        ],
        limits: { projects: 25, reports: 25, presentations: 25, viva: 999 }
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: "₹1,999",
        period: "/ month",
        icon: Rocket,
        color: "text-accent",
        bg: "bg-accent/10",
        border: "border-accent/30",
        features: [
            "Unlimited Projects",
            "White-label Reports",
            "Custom PPT Templates",
            "AI Viva Coach (unlimited)",
            "Dedicated AI Engine",
            "API Access",
            "Priority Support + SLA",
            "Team Collaboration",
        ],
        limits: { projects: 9999, reports: 9999, presentations: 9999, viva: 9999 }
    }
];

export default function BillingPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const currentPlan = plans.find(p => p.id === (user?.plan || "free")) || plans[0];

    useEffect(() => {
        api.getUserStats().then(setStats).catch(console.error);
    }, []);

    const usageItems = [
        { label: "Architectural Records", used: stats?.projects_generated || 0, limit: currentPlan.limits.projects, icon: Layers, color: "text-blue-500" },
        { label: "Synthesis Reports", used: stats?.reports_created || 0, limit: currentPlan.limits.reports, icon: FileText, color: "text-purple-500" },
        { label: "Visual Decks", used: stats?.presentations_created || 0, limit: currentPlan.limits.presentations, icon: MonitorPlay, color: "text-orange-500" },
        { label: "Neural Inquiries", used: stats?.viva_questions || 0, limit: currentPlan.limits.viva, icon: MessageSquare, color: "text-emerald-500" },
    ];

    return (
        <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-1000 px-4 lg:px-8 py-10">
            {/* ── Header Area ──────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/[0.04] pb-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 rounded-full apple-glass text-[9px] font-bold text-blue-500 tracking-[2px] uppercase">
                            Financial Operations
                        </div>
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-bold tracking-[-0.05em] text-white leading-[0.8]">
                        Bill<span className="text-gradient-purple">ing</span>
                    </h1>
                    <p className="text-zinc-500 text-lg font-medium tracking-tight">
                        Manage your subscription parameters and monitor neural usage cycles.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex flex-col items-end px-6 py-3 rounded-2xl apple-glass shadow-soft">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Billing Cycle</span>
                        <span className="text-xs font-bold text-white mt-1 uppercase tracking-tight">Renewal: May 15, 2026</span>
                    </div>
                </div>
            </div>

            {/* Current Plan Card */}
            <div className="relative group overflow-hidden rounded-[3rem] p-12 apple-card border-blue-500/20 bg-blue-500/[0.02]">
                <div className="absolute inset-0 retina-grid opacity-10" />
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/[0.05] blur-[120px]" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex items-center gap-8">
                        <div className={cn("p-8 rounded-[2.5rem] apple-glass shadow-apple transition-all duration-700 group-hover:scale-110")}>
                            <currentPlan.icon className={cn("w-12 h-12", currentPlan.color)} />
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                            <span className="text-[10px] font-bold uppercase tracking-[4px] text-zinc-500">Current System Tier</span>
                            <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tighter leading-none">{currentPlan.name}</h2>
                            <p className="text-zinc-400 font-medium text-lg tracking-tight">
                                {currentPlan.price}<span className="text-sm opacity-50">{currentPlan.period}</span>
                            </p>
                        </div>
                    </div>
                    <div className="px-8 py-3 rounded-2xl apple-glass text-emerald-500 text-[10px] font-bold uppercase tracking-[2px] shadow-soft border border-emerald-500/10">
                        Operational State: Active
                    </div>
                </div>
            </div>

            {/* Usage Metrics */}
            <div className="space-y-8 pt-8">
                <div className="flex items-center gap-3 px-2">
                    <BarChart3 className="w-4 h-4 text-zinc-600" />
                    <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[3px]">Cycle Usage Analytics</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {usageItems.map((item, i) => {
                        const pct = Math.min((item.used / item.limit) * 100, 100);
                        return (
                            <div key={i} className={cn(
                            "apple-card p-8 group hover:bg-white/[0.01] transition-all relative overflow-hidden", 
                            item.used / item.limit > 0.8 ? "glow-orange border-orange-soft" : "glow-blue border-blue-soft"
                        )}>
                                <div className="flex items-center justify-between mb-8">
                                    <div className={cn("p-3 rounded-2xl apple-glass shadow-soft group-hover:scale-110 transition-transform duration-500")}>
                                        <item.icon className={cn("w-5 h-5", item.color)} />
                                    </div>
                                    <span className="text-xs font-bold text-zinc-500 tabular-nums">
                                        {item.used} / {item.limit >= 9999 ? "∞" : item.limit}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.label}</h4>
                                    <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden">
                                        <div 
                                            className={cn("h-full bg-white/40 transition-all duration-1000 shadow-[0_0_8px_rgba(255,255,255,0.2)]")} 
                                            style={{ width: `${pct}%` }} 
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tiers Grid */}
            <div className="space-y-12 pt-16">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[6px]">System Scaling</span>
                    <h2 className="text-4xl font-bold text-white tracking-tighter leading-none">Available Tiers</h2>
                    <div className="w-16 h-1 bg-white/[0.05] rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {plans.map((plan) => {
                        const isCurrent = plan.id === (user?.plan || "free");
                        return (
                            <div key={plan.id} className={cn(
                                "relative apple-card p-12 transition-all duration-500 flex flex-col hover:scale-[1.02]",
                                plan.popular ? "border-primary/20 bg-primary/[0.02]" : "",
                                isCurrent ? "ring-1 ring-white/10" : "hover:bg-white/[0.01]"
                            )}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-white text-black text-[9px] font-bold uppercase tracking-[2px] rounded-full shadow-apple">
                                        Most Popular
                                    </div>
                                )}
                                
                                <div className="mb-12 space-y-6">
                                    <div className={cn("p-5 rounded-3xl w-fit apple-glass shadow-soft")}>
                                        <plan.icon className={cn("w-8 h-8", plan.color)} />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-bold text-white tracking-tight">{plan.name}</h4>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold text-white tracking-tighter">{plan.price}</span>
                                            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{plan.period}</span>
                                        </div>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-16 flex-1">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-start gap-3 text-xs text-zinc-400 font-medium tracking-tight">
                                            <Check className={cn("w-4 h-4 mt-0.5 flex-shrink-0 opacity-40")} />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className={cn(
                                        "w-full h-14 rounded-2xl font-bold text-[10px] uppercase tracking-[2px] transition-all",
                                        isCurrent 
                                            ? "apple-glass text-zinc-600 cursor-default" 
                                            : plan.popular 
                                                ? "bg-white text-black hover:bg-zinc-200 shadow-apple" 
                                                : "apple-glass text-white hover:bg-white/[0.05]"
                                    )}
                                    disabled={isCurrent}
                                >
                                    {isCurrent ? "Current Configuration" : `Initiate ${plan.name} Link`}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
