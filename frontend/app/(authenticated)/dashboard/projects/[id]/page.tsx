"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import { 
    Eye, 
    Layers, 
    FileText, 
    MonitorPlay, 
    MessageSquare, 
    Download, 
    ChevronLeft, 
    Loader2, 
    Cpu, 
    Sparkles,
    Database,
    Zap,
    Code,
    BookOpen,
    Info,
    CheckCircle2,
    Clock,
    Pencil
} from "lucide-react";
import Link from "next/link";
import VivaAssistant from "@/components/VivaAssistant";
import DownloadButton from "@/components/DownloadButton";
import { cn } from "@/lib/utils";

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await api.getProjectById(Number(params.id));
                setProject(data);
            } catch (err) {
                console.error(err);
                router.push("/dashboard/projects");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [params.id]);

    if (loading) return (
        <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm font-black text-muted-foreground uppercase tracking-widest animate-pulse">Initializing Workspace...</p>
        </div>
    );

    const tabs = [
        { id: "overview", label: "Overview", icon: Info },
        { id: "code", label: "Code Structure", icon: Code },
        { id: "report", label: "Market Report", icon: FileText },
        { id: "presentation", label: "Presentation", icon: MonitorPlay },
        { id: "viva", label: "Viva Prep", icon: MessageSquare }
    ];

    const renderSafeContent = (content: any) => {
        if (!content) return "";
        if (typeof content === 'string') return content;
        return JSON.stringify(content, null, 2);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32">
            {/* Navigation Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-border/40 pb-10">
                <div className="space-y-4">
                    <button 
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Vault
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-inner">
                            <Layers className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-foreground leading-[1.1] tracking-tight">{project.title}</h1>
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20">
                                    {project.domain}
                                </span>
                                <span className="bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-border/50">
                                    {project.difficulty}
                                </span>
                                <span className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-muted/30 px-3 py-1 rounded-full border border-border/20">
                                    <Sparkles className="w-3 h-3 text-emerald-500" />
                                    AI-Optimized Design
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link href={`/dashboard/projects/${project.id}/edit`}>
                        <button className="flex items-center gap-2 bg-card border border-border/50 text-foreground hover:bg-muted font-bold px-6 py-3 rounded-2xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-sm">
                            <Pencil className="w-4 h-4" /> Edit
                        </button>
                    </Link>
                    <DownloadButton 
                        label="Source Code"
                        filename={`${project.title.replace(/\s+/g, '_')}_Source.zip`}
                        onClick={() => api.downloadCode(project.id)}
                        className="bg-card border border-border/50 text-foreground hover:bg-muted font-bold px-6 py-3 rounded-2xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                    />
                    <DownloadButton 
                        label="Export Everything"
                        filename={`${project.title.replace(/\s+/g, '_')}_Full_Suite.zip`}
                        onClick={() => api.downloadFullProject(project.id)}
                        className="bg-primary text-primary-foreground font-black px-8 py-3 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    />
                </div>
            </div>

            {/* Sticky Tab Navigation */}
            <div className="sticky top-0 z-50 py-4 bg-background/80 backdrop-blur-3xl -mx-4 px-4">
                <div className="flex items-center gap-1.5 p-1.5 bg-muted/40 border border-border/40 rounded-[2rem] w-fit mx-auto shadow-sm">
                    {tabs.map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2.5 px-6 py-3 rounded-[1.75rem] text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === tab.id 
                                    ? "bg-card text-primary shadow-sm border border-border/50" 
                                    : "text-muted-foreground hover:bg-muted/50"
                            )}
                        >
                            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary" : "text-muted-foreground/50")} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Contents */}
            <div className="min-h-[600px] animate-in fade-in zoom-in-95 duration-500">
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-10">
                            <div className="bg-card border border-border/50 rounded-[2.5rem] p-10 shadow-sm space-y-6">
                                <h3 className="text-xl font-black text-foreground flex items-center gap-3">
                                    <Info className="w-5 h-5 text-primary" />
                                    Executive Abstract
                                </h3>
                                <p className="text-lg leading-relaxed text-foreground/80 font-medium">
                                    {renderSafeContent(project.abstract)}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                                    <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Core Features
                                    </h3>
                                    <ul className="space-y-3">
                                        {project.features?.map((f: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-bold text-foreground/70 bg-muted/40 p-4 rounded-2xl border border-border/20">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                                    <h3 className="text-sm font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Literature Survey
                                    </h3>
                                    <p className="text-sm leading-relaxed text-foreground/70 bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10 italic font-medium">
                                        "{renderSafeContent(project.literature_survey)}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                                <h3 className="text-sm font-black text-purple-500 uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Rapid Specifications
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: "Technical Stack", value: project.tech_stack, icon: Code },
                                        { label: "Completion Time", value: "2-3 Weeks", icon: Clock },
                                        { label: "Asset Strength", value: "Production-Ready", icon: Sparkles },
                                        { label: "Security Level", value: "Encryption Enabled", icon: ShieldAlert }
                                    ].map((spec, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/20">
                                            <div className="p-2 bg-background rounded-xl border border-border/50 shadow-sm">
                                                <spec.icon className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{spec.label}</p>
                                                <p className="text-xs font-black text-foreground">{spec.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "code" && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-card border border-border/50 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
                                        <Code className="w-6 h-6 text-primary" />
                                        Platform Code Architecture
                                    </h3>
                                    <p className="text-muted-foreground mt-1 font-medium">Detailed breakdown of the system design and implementation.</p>
                                </div>
                                <button 
                                    onClick={() => api.downloadCode(project)}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-2xl font-black text-xs hover:bg-primary/20 transition-all border border-primary/20"
                                >
                                    <Download className="w-4 h-4" />
                                    Extract Codebase
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">System Architecture Description</h4>
                                        <p className="text-sm leading-relaxed text-foreground/80 font-medium bg-muted/30 p-8 rounded-[2rem] border border-border/40 whitespace-pre-wrap">
                                            {renderSafeContent(project.architecture_description)}
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Database Blueprint</h4>
                                        <div className="bg-slate-950 p-8 rounded-[2rem] border border-white/5 shadow-2xl overflow-x-auto">
                                            <pre className="text-xs font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap">
                                                {renderSafeContent(project.database_design)}
                                            </pre>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">File Hierarchy</h4>
                                        <div className="space-y-2">
                                            {project.files?.map((f: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-card border border-border/50 rounded-2xl hover:bg-muted/20 transition-all cursor-pointer group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary/5 rounded-lg">
                                                            <Code className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <span className="text-xs font-black font-mono text-foreground/80">{f.filename}</span>
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/30 group-hover:text-primary transition-colors">Module Ready</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 space-y-4">
                                        <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                                            <Zap className="w-4 h-4" />
                                            Technology Stack Breakdown
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tech_stack?.split(',').map((tech: string, i: number) => (
                                                <span key={i} className="px-4 py-2 bg-card text-foreground text-xs font-bold rounded-xl border border-border/50 shadow-sm">{tech.trim()}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "report" && (
                    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-card border border-border/50 rounded-[3rem] p-12 shadow-sm space-y-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-[120px]" />
                            
                            <div className="relative space-y-10">
                                <div className="text-center space-y-4">
                                    <p className="text-xs font-black uppercase tracking-[0.5em] text-primary">Technical Documentation</p>
                                    <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">{project.title}</h2>
                                    <div className="flex items-center justify-center gap-4 text-sm font-bold text-muted-foreground pt-2">
                                        <span className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-primary" />
                                            24-Page Project Report
                                        </span>
                                        <div className="w-1.5 h-1.5 bg-border rounded-full" />
                                        <span>Industry Standard</span>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                                            <div className="w-1.5 h-8 bg-primary rounded-full" />
                                            Problem Statement
                                        </h4>
                                        <p className="text-lg leading-relaxed text-foreground/70 pl-6 border-l border-border/50 italic">
                                            "{renderSafeContent(project.problem_statement)}"
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                                            <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
                                            System Methodology
                                        </h4>
                                        <div className="text-base leading-relaxed text-foreground/80 font-medium pl-6 space-y-4 whitespace-pre-wrap">
                                            {renderSafeContent(project.methodology)}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 bg-muted/30 border border-border/40 rounded-[2.5rem] flex flex-col items-center gap-6">
                                    <div className="text-center">
                                        <p className="text-sm font-black text-foreground mb-1">Download Your Formatted Report</p>
                                        <p className="text-xs text-muted-foreground font-medium">Complete with Abstract, Diagrams, and Indexing.</p>
                                    </div>
                                    <DownloadButton 
                                        label="Download Word Report (.docx)"
                                        filename={`${project.title.replace(/\s+/g, '_')}_Report.docx`}
                                        onClick={() => api.downloadReport(project)}
                                        className="w-full max-w-sm py-8 bg-primary text-primary-foreground rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "presentation" && (
                    <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-card border border-border/50 rounded-[3rem] p-20 shadow-sm space-y-10 relative overflow-hidden group">
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] group-hover:scale-110 transition-transform duration-1000" />
                           
                           <div className="relative">
                                <div className="w-24 h-24 bg-accent/10 rounded-[2rem] flex items-center justify-center mx-auto text-accent mb-8 shadow-inner">
                                    <MonitorPlay className="w-12 h-12" />
                                </div>
                                <h1 className="text-5xl font-black text-foreground mb-4">Presentation Ready</h1>
                                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                                    Your professional PowerPoint presentation is exported with high-impact visuals and key architectural slides.
                                </p>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
                                {[
                                    { label: "12 Slides", desc: "Professionally Structured" },
                                    { label: "Full Graphics", desc: "Data Flow Charts Included" },
                                    { label: "Speaker Notes", desc: "Ready for Presentation" }
                                ].map((stat, i) => (
                                    <div key={i} className="p-6 bg-muted/40 rounded-3xl border border-border/20 relative z-10">
                                        <p className="text-2xl font-black text-foreground mb-1">{stat.label}</p>
                                        <p className="text-xs font-bold text-muted-foreground uppercase">{stat.desc}</p>
                                    </div>
                                ))}
                           </div>

                           <DownloadButton 
                                label="Download Presentation (.pptx)"
                                filename={`${project.title.replace(/\s+/g, '_')}_Slides.pptx`}
                                onClick={() => api.downloadPPT(project)}
                                className="relative z-10 mt-8 py-5 px-12 bg-accent text-white rounded-3xl font-black text-lg shadow-2xl shadow-accent/25 hover:scale-[1.05] active:scale-[0.95] transition-all inline-flex items-center gap-4 border-none"
                           />
                        </div>
                    </div>
                )}

                {activeTab === "viva" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <VivaAssistant projectData={project} />
                    </div>
                )}
            </div>
        </div>
    );
}

function ShieldAlert(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
        </svg>
    )
}
