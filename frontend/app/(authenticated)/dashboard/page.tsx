"use client";

import { useState, useEffect } from "react";
import ProjectForm from "@/components/ProjectForm";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/components/AuthProvider";
import VivaAssistant from "@/components/VivaAssistant";
import DownloadButton from "@/components/DownloadButton";
import { StatsSection, ActivityFeed, SuggestionPanel, RecentProjectsList, ProjectProgressTracker } from "@/components/dashboard/Widgets";
import { api } from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
    LogOut, 
    Sparkles, 
    FileText, 
    Download, 
    Code, 
    MonitorPlay, 
    Settings, 
    Layers, 
    ArrowRight, 
    Clock, 
    BookOpen, 
    Database, 
    Cpu, 
    Rocket, 
    Activity as ActivityIcon, 
    Zap, 
    PlusCircle, 
    History as LucideHistory 
} from "lucide-react";

export default function Dashboard() {
    const [project, setProject] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [recentProjects, setRecentProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, projectsData] = await Promise.all([
                    api.getUserStats(),
                    api.listProjects()
                ]);
                setStats(statsData);
                setRecentProjects(projectsData || []);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-1000 px-4 lg:px-8 py-10">
            {/* ── Header Area ──────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/[0.04] pb-12">
                <div className="space-y-6 group">
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 rounded-full apple-glass text-[9px] font-bold text-blue-500 tracking-[2px] uppercase">
                            Operational Status: Active
                        </div>
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-bold tracking-[-0.05em] text-white leading-[0.8]">
                        Dash<span className="text-gradient-blue">board</span>
                    </h1>
                    <p className="text-zinc-500 text-lg font-medium tracking-tight">
                        Welcome, <span className="text-white font-bold">{user?.name?.split(" ")[0] || user?.email?.split('@')[0] || 'Creator'}</span>. <br className="hidden md:block" />
                        You've completed <span className="text-blue-500">{stats?.projects_generated || 0}</span> projects in the current cycle.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex flex-col items-end px-6 py-3 rounded-2xl apple-glass shadow-soft glow-blue border-blue-soft">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">System Health</span>
                        <span className="text-xs font-bold text-emerald-500 mt-1 uppercase tracking-tight">Optimal Performance</span>
                    </div>

                    <Link href="/dashboard/projects">
                        <button className="px-8 h-12 rounded-2xl apple-glass text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-[2px] transition-all relative overflow-hidden group/btn shadow-soft">
                            <span className="relative z-10">View All Records</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        </button>
                    </Link>
                </div>
            </div>

            {!project ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-16">
                        {/* ── Performance Section ────────────────────────────────────────── */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 px-2">
                                <ActivityIcon className="w-4 h-4 text-zinc-600" />
                                <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[3px]">System Analytics</h2>
                            </div>
                            <StatsSection data={stats} />
                        </section>

                        {/* ── Quick Controls & Resources ───────────────────────────────────── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="apple-card p-10 group/qa">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-3 rounded-2xl apple-glass text-blue-500">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">Control Panel</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "New Project", icon: PlusCircle, color: "blue", action: () => document.getElementById('project-form')?.scrollIntoView({ behavior: 'smooth' }) },
                                        { label: "Resume", icon: LucideHistory, color: "purple", action: () => router.push('/dashboard/projects') },
                                        { label: "Settings", icon: Settings, color: "zinc", action: () => router.push('/dashboard/settings') },
                                        { label: "Reports", icon: Download, color: "emerald", action: () => router.push('/dashboard/projects') },
                                    ].map((item, i) => (
                                        <button 
                                            key={i}
                                            onClick={item.action}
                                            className="p-6 rounded-2xl apple-glass hover:bg-white/[0.05] transition-all group/item flex flex-col items-center justify-center text-center gap-4 active:scale-[0.95]"
                                        >
                                            <item.icon className="w-6 h-6 text-zinc-600 group-hover/item:text-white transition-colors" />
                                            <span className="text-[9px] font-bold text-zinc-600 group-hover/item:text-white uppercase tracking-widest">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>


                            <div className="apple-card p-10 group/usage overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/[0.02] blur-[80px] -z-10" />
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-3 rounded-2xl apple-glass text-orange-500">
                                        <Database className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">Resources</h3>
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Compute Units</span>
                                            <span className="text-xs font-bold text-white tabular-nums">850 / 1k</span>
                                        </div>
                                        <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                                            <div className="h-full w-[85%] bg-white/40 shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">API Latency</span>
                                            <span className="text-xs font-bold text-white tabular-nums">24ms / Avg</span>
                                        </div>
                                        <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                                            <div className="h-full w-[42%] bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.2)]" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-zinc-700 font-bold tracking-tight italic pt-4">
                                        Optimization active. Cycles reset in <span className="text-zinc-500">4 hours</span>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <RecentProjectsList projects={recentProjects} />
                            <ProjectProgressTracker />
                        </div>


                        {/* ── Launch Area ────────────────────────────────────────────────── */}
                        <div className="group relative rounded-[3rem] p-16 overflow-hidden apple-card hover:bg-white/[0.01] transition-all duration-700">
                            <div className="absolute inset-0 retina-grid opacity-10" />
                            <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/[0.05] blur-[120px] animate-pulse" />
                            
                            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                                <div className="space-y-10 text-center lg:text-left">
                                    <div className="p-6 apple-glass w-fit mx-auto lg:mx-0 rounded-[2.5rem] shadow-apple group-hover:scale-110 transition-all duration-700">
                                        <Rocket className="w-16 h-16 text-white" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h2 className="text-5xl lg:text-7xl font-bold text-white tracking-[-0.05em] mb-6 leading-[0.9]">
                                            Initiate <br /> <span className="text-zinc-500">Production</span>
                                        </h2>
                                        <p className="text-zinc-500 font-medium text-xl max-w-sm tracking-tight leading-relaxed">
                                            Architect production-ready assets in high-fidelity under sixty seconds.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => document.getElementById('project-form')?.scrollIntoView({ behavior: 'smooth' })}
                                        size="xl"
                                        className="rounded-[2rem] px-16 group/launch hover:scale-[1.02] shadow-apple"
                                    >
                                        Execute Launch
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover/launch:translate-x-1" />
                                    </Button>
                                </div>
                                
                                <div className="hidden xl:block relative group/model">
                                    <div className="w-[360px] h-[360px] rounded-[3.5rem] apple-glass p-12 flex items-center justify-center transform group-hover:scale-105 transition-all duration-1000 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                                        <MonitorPlay className="w-40 h-40 text-white/5 group-hover:text-blue-500/20 transition-colors" strokeWidth={0.5} />
                                        <div className="absolute bottom-10 left-10 right-10 p-6 rounded-3xl apple-glass border-white/10 shadow-soft">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[9px] font-bold text-white uppercase tracking-widest">Neural Link Active</span>
                                            </div>
                                            <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                                <div className="h-full w-2/3 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)] group-hover:w-full transition-all duration-1000" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="project-form" className="mt-16 scroll-mt-32 pb-24">
                            <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[6px]">Architectural Interface</span>
                                <h2 className="text-4xl font-bold text-white tracking-tighter">System Configuration</h2>
                                <div className="w-16 h-1 bg-white/[0.05] rounded-full" />
                            </div>
                            <div className="animate-in fade-in zoom-in-95 duration-1000">
                                <ProjectForm onProjectGenerated={setProject} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-4 h-full space-y-12">
                        <ActivityFeed />
                        <SuggestionPanel />
                        
                        <div className="p-10 rounded-[3rem] apple-card relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.02] blur-3xl -z-10" />
                            <h4 className="text-xl font-bold text-white mb-4 tracking-tight">Advisory Hub</h4>
                            <p className="text-sm text-zinc-500 font-semibold mb-8 leading-relaxed">Our specialists are available for architectural optimization and logic verification.</p>
                            <Button variant="outline" className="w-full h-14 rounded-2xl uppercase tracking-widest text-[10px] font-bold">
                                Contact Specialist
                            </Button>
                        </div>
                    </div>

                </div>
            ) : (
                <div className="lg:col-span-12 max-w-6xl mx-auto w-full pb-24">
                    <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-1000">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setProject(null)}
                                className="group text-sm font-bold text-zinc-500 hover:text-white flex items-center gap-3 transition-all"
                            >
                                <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                                Return to Index
                            </button>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                                <Clock className="w-3 h-3" />
                                Archive Generated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>

                        <div className="rounded-[3rem] apple-card overflow-hidden shadow-apple">
                            <div className="p-10 md:p-16 border-b border-white/[0.04] bg-white/[0.01] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full -mr-32 -mt-32 blur-[100px]" />
                                
                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                                        <h2 className="text-5xl lg:text-7xl font-bold leading-[0.9] tracking-[-0.05em] text-white max-w-4xl">
                                            {project.title}
                                        </h2>
                                        <div className="px-4 py-1.5 rounded-full apple-glass text-emerald-500 text-[9px] font-bold uppercase tracking-[2px] border border-emerald-500/10">
                                            Production Ready
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-3 apple-glass px-5 py-2.5 rounded-2xl">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Domain:</span>
                                            <span className="text-xs font-bold text-white">{project.domain || "AI Architecture"}</span>
                                        </div>
                                        <div className="flex items-center gap-3 apple-glass px-5 py-2.5 rounded-2xl">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Index:</span>
                                            <span className="text-xs font-bold text-white">{project.difficulty || "High"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-20">
                                <div className="space-y-12">
                                    <section className="space-y-6">
                                        <h3 className="text-[10px] font-bold uppercase tracking-[4px] text-zinc-600 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl apple-glass flex items-center justify-center text-blue-500">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            Abstract Analysis
                                        </h3>
                                        <p className="text-lg leading-relaxed text-zinc-400 font-medium tracking-tight">{project.abstract}</p>
                                    </section>

                                    {project.features && project.features.length > 0 && (
                                        <section className="space-y-6">
                                            <h3 className="text-[10px] font-bold uppercase tracking-[4px] text-zinc-600 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl apple-glass flex items-center justify-center text-emerald-500">
                                                    <Sparkles className="w-5 h-5" />
                                                </div>
                                                Functional Vector
                                            </h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                {project.features.map((f: string, i: number) => (
                                                    <div key={i} className="flex items-center gap-4 text-xs text-white font-semibold apple-glass px-6 py-4 rounded-2xl border border-white/[0.02]">
                                                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                                        {f}
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>

                                <div className="space-y-12">
                                    <section className="space-y-6">
                                        <h3 className="text-[10px] font-bold uppercase tracking-[4px] text-zinc-600 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl apple-glass flex items-center justify-center text-zinc-300">
                                                <Layers className="w-5 h-5" />
                                            </div>
                                            Logic Architecture
                                        </h3>
                                        <p className="text-lg leading-relaxed text-zinc-400 font-medium tracking-tight">{project.architecture_description}</p>
                                    </section>

                                    {project.database_design && (
                                        <section className="space-y-6">
                                            <h3 className="text-[10px] font-bold uppercase tracking-[4px] text-zinc-600 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl apple-glass flex items-center justify-center text-orange-500">
                                                    <Database className="w-5 h-5" />
                                                </div>
                                                Schema Blueprint
                                            </h3>
                                            <div className="p-8 rounded-[2rem] apple-glass border border-white/[0.02] text-xs font-mono text-zinc-500 overflow-x-auto leading-relaxed tabular-nums">
                                                <pre className="whitespace-pre-wrap">{project.database_design}</pre>
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </div>

                            <div className="p-10 md:p-16 bg-white/[0.01] border-t border-white/[0.04]">
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[3px]">Asset Distribution</p>
                                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Mastery Output</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <DownloadButton
                                            label="Document Report"
                                            filename="project_report.docx"
                                            onClick={() => api.downloadReport(project.id)}
                                            className="h-16 rounded-[1.5rem] font-bold apple-glass hover:bg-white/[0.08] text-white transition-all shadow-soft"
                                        />
                                        <DownloadButton
                                            label="Presentation Deck"
                                            filename="project_presentation.pptx"
                                            onClick={() => api.downloadPPT(project.id)}
                                            className="h-16 rounded-[1.5rem] font-bold apple-glass hover:bg-white/[0.08] text-white transition-all shadow-soft"
                                        />
                                        <DownloadButton
                                            label="Source Repository"
                                            filename="project_code.zip"
                                            onClick={() => api.downloadCode(project.id)}
                                            className="h-16 rounded-[1.5rem] font-bold bg-white text-black hover:bg-zinc-200 shadow-apple transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Viva Assistant */}
                        <div className="pt-8">
                            <VivaAssistant projectData={project} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

