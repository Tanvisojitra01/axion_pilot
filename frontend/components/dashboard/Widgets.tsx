"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
    Sparkles, 
    FileText, 
    Presentation, 
    MessageSquare, 
    Briefcase, 
    Activity, 
    Clock, 
    ChevronRight, 
    Rocket,
    Plus,
    FileSearch,
    Cpu,
    MonitorIcon,
    TerminalSquare
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// --- Helper for Count-up animation ---
function CountUp({ value, duration = 1000 }: { value: number | string, duration?: number }) {
    const [count, setCount] = useState(0);
    const target = typeof value === 'string' ? parseInt(value) || 0 : value;

    useEffect(() => {
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [target, duration]);

    return <span>{count}</span>;
}

export function StatsSection({ data }: { data: any }) {
    const stats = [
        { label: "Architectural Vault", value: data?.projects_generated || 0, icon: Briefcase, color: "text-blue-500", glow: "glow-blue", border: "border-blue-soft" },
        { label: "Synthesis Reports", value: data?.reports_created || 0, icon: FileText, color: "text-purple-500", glow: "glow-purple", border: "border-purple-soft" },
        { label: "Visual Decks", value: data?.presentations_created || 0, icon: Presentation, color: "text-orange-500", glow: "glow-orange", border: "border-orange-soft" },
        { label: "Logic Vectors", value: data?.viva_questions || 0, icon: MessageSquare, color: "text-emerald-500", glow: "glow-emerald", border: "border-emerald-soft" },
    ];

    return (
        <div className="space-y-10">
            <div className="flex items-center gap-3 px-2">
                <Activity className="w-4 h-4 text-zinc-600" />
                <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[3px]">Performance Overview</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "apple-card p-10 flex flex-col gap-8 group hover:bg-white/[0.01] transition-all",
                        stat.glow,
                        stat.border
                    )}
                >
                    <div className={cn("p-4 w-fit rounded-2xl apple-glass shadow-soft transition-all duration-500 group-hover:scale-110")}>
                        <stat.icon className={cn("w-6 h-6", stat.color)} />
                    </div>
                    <div>
                        <h3 className="text-4xl font-bold text-white tracking-[-0.05em] leading-none mb-3">
                            <CountUp value={stat.value} />
                        </h3>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[2px]">{stat.label}</p>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
}

export function ActivityFeed() {
    const activities = [
        { text: "Neural synthesis: Face Recognition", time: "2m ago", icon: FileText, color: "text-blue-500" },
        { text: "Compilation sequence: React Master", time: "15m ago", icon: Briefcase, color: "text-purple-500" },
        { text: "Vector logic: 12 Logic Strings", time: "1h ago", icon: MessageSquare, color: "text-emerald-500" },
        { text: "Visual deck: Blockchain Protocol", time: "3h ago", icon: Presentation, color: "text-orange-500" }
    ];

    return (
        <div className="apple-card p-10 flex flex-col h-full group/main transition-all glow-blue border-blue-soft">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <Activity className="w-5 h-5 text-zinc-600" />
                    <h3 className="text-xl font-bold text-white tracking-tight">Active Pulse</h3>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>

            <div className="space-y-12 flex-1 relative">
                {activities.map((act, i) => (
                    <div key={i} className="flex gap-6 group items-start relative">
                        <div className="relative z-10">
                            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 apple-glass border-white/[0.05] group-hover:scale-110 shadow-soft")}>
                                <act.icon className={cn("w-4 h-4", act.color)} />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-zinc-300 leading-none group-hover:text-white transition-colors truncate mb-3">{act.text}</p>
                            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                {act.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            <button className="w-full mt-12 h-12 rounded-2xl apple-glass text-zinc-500 hover:text-white transition-all font-bold text-[10px] tracking-[2px] flex items-center justify-center gap-2 uppercase">
                Pulse History
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}

export function SuggestionPanel() {
    const suggestions = [
        { title: "AI Resume Vector", domain: "Neural Link", diff: "Synthesis", icon: MonitorIcon, color: "text-blue-500", glow: "glow-blue" },
        { title: "Blockchain Protocol", domain: "Ledger", diff: "Advanced", icon: TerminalSquare, color: "text-purple-500", glow: "glow-purple" },
        { title: "IoT Agriculture", domain: "Embedded", diff: "Foundation", icon: Cpu, color: "text-emerald-500", glow: "glow-emerald" }
    ];

    return (
        <div className="apple-card p-10 transition-all glow-purple border-purple-soft">
            <div className="flex items-center gap-4 mb-10">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h3 className="text-xl font-bold text-white tracking-tight">Intelligence</h3>
            </div>
            <div className="space-y-4">
                {suggestions.map((sug, i) => (
                    <button key={i} className={cn("w-full apple-glass rounded-[1.5rem] p-6 hover:bg-white/[0.05] transition-all group flex items-center gap-5 border-white/[0.03]", sug.glow)}>
                        <div className="p-3 rounded-2xl apple-glass border-white/[0.05] group-hover:scale-110 transition-all duration-500">
                            <sug.icon className={cn("w-5 h-5", sug.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-zinc-300 text-[13px] group-hover:text-white transition-colors truncate mb-2">{sug.title}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-[1px]">{sug.domain}</span>
                                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-[1px]">{sug.diff}</span>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-white transition-all" />
                    </button>
                ))}
            </div>
        </div>
    );
}

export function RecentProjectsList({ projects }: { projects: any[] }) {
    return (
        <div className="apple-card p-10 transition-all">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <h3 className="text-xl font-bold text-white tracking-tight">Recent Records</h3>
                </div>
                <Link href="/dashboard/projects" className="text-[9px] font-bold text-zinc-600 hover:text-white uppercase tracking-[2px] transition-all">
                    View Archive
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(projects || []).slice(0, 2).map((proj, i) => (
                    <div key={proj.id} className="apple-glass rounded-[2rem] p-8 hover:bg-white/[0.03] transition-all group relative overflow-hidden border-white/[0.03]">
                        <div className="flex justify-between items-start mb-10">
                            <h4 className="text-lg font-bold text-zinc-300 line-clamp-1 group-hover:text-white transition-colors flex-1">{proj.title}</h4>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Synthesis</span>
                                <span className="text-[11px] font-bold text-white tabular-nums">100%</span>
                            </div>
                            <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden">
                                <div className="h-full w-full bg-white/20 shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                            </div>
                        </div>
                        
                        <Link href={`/dashboard/projects/${proj.id}`} className="block mt-10">
                            <button className="w-full h-12 rounded-2xl apple-glass text-white font-bold text-[11px] tracking-tight hover:bg-white hover:text-black transition-all group/btn uppercase tracking-widest">
                                Open Vault
                            </button>
                        </Link>
                    </div>
                ))}
                
                {(!projects || projects.length === 0) && (
                    <div className="col-span-2 py-16 flex flex-col items-center justify-center text-center apple-glass rounded-[2rem] border-dashed border-white/[0.05]">
                        <FileSearch className="w-10 h-10 text-zinc-800 mb-6" />
                        <div>
                            <p className="text-lg font-bold text-zinc-500 tracking-tight">Zero Records Found</p>
                            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest mt-2">Initialize synthesis to begin</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export function ProjectProgressTracker() {
    const trackerStages = [
        { name: "Global Moderation", progress: 100, color: "bg-blue-500" },
        { name: "Asset Synthesis", progress: 95, color: "bg-purple-500" },
        { name: "Logic Sandbox", progress: 80, color: "bg-emerald-500" },
    ];

    return (
        <div className="apple-card p-10 transition-all">
            <div className="flex items-center gap-4 mb-10">
                <Rocket className="w-5 h-5 text-white" />
                <h3 className="text-xl font-bold text-white tracking-tight">System Vitals</h3>
            </div>
            <div className="space-y-10">
                {trackerStages.map((stage, i) => (
                    <div key={i} className="space-y-4 group">
                        <div className="flex justify-between items-end">
                            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">{stage.name}</span>
                            <span className="text-[11px] font-bold text-white tabular-nums tracking-tighter">{stage.progress}%</span>
                        </div>
                        <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden">
                            <div 
                                className={cn("h-full rounded-full transition-all duration-1000 ease-out", stage.color)}
                                style={{ width: `${stage.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
