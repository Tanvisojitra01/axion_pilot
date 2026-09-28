"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { 
    Search, 
    Filter, 
    Layers, 
    Clock, 
    Trash2, 
    Download, 
    Eye, 
    FileText, 
    ChevronRight,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function MyProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [domainFilter, setDomainFilter] = useState("All");
    const [difficultyFilter, setDifficultyFilter] = useState("All");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await api.listProjects();
                setProjects(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this project? This cannot be undone.")) return;
        try {
            await api.deleteProject(id);
            setProjects(projects.filter(p => p.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesDomain = domainFilter === "All" || p.domain === domainFilter;
        const matchesDiff = difficultyFilter === "All" || p.difficulty === difficultyFilter;
        return matchesSearch && matchesDomain && matchesDiff;
    });

    const domains = ["All", ...Array.from(new Set(projects.map(p => p.domain)))];

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 px-4 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/[0.04] pb-12">
                <div className="space-y-6">
                    <h1 className="text-6xl lg:text-8xl font-bold tracking-[-0.05em] text-white leading-[0.8]">
                        The <span className="text-gradient-blue">Vault</span>
                    </h1>
                    <p className="text-zinc-500 text-lg font-medium tracking-tight">
                        A curated archive of your <span className="text-white font-bold">{projects.length}</span> architectural achievements.
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Filter records..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white/[0.03] border border-white/[0.05] rounded-2xl py-3.5 pl-12 pr-6 text-[13px] font-medium w-full md:w-80 focus:border-white/20 focus:bg-white/[0.05] outline-none transition-all placeholder:text-zinc-700"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-3 apple-glass px-5 py-2.5 rounded-2xl border-white/[0.05]">
                    <Filter className="w-3.5 h-3.5 text-zinc-600" />
                    <select 
                        value={domainFilter}
                        onChange={(e) => setDomainFilter(e.target.value)}
                        className="bg-transparent text-white text-[11px] font-bold uppercase tracking-[2px] outline-none cursor-pointer appearance-none"
                    >
                        {domains.map(d => <option key={d} value={d} className="bg-black text-white">{d}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-3 apple-glass px-5 py-2.5 rounded-2xl border-white/[0.05]">
                    <Layers className="w-3.5 h-3.5 text-zinc-600" />
                    <select 
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                        className="bg-transparent text-white text-[11px] font-bold uppercase tracking-[2px] outline-none cursor-pointer appearance-none"
                    >
                        <option value="All" className="bg-black text-white">Index: All</option>
                        <option value="Beginner" className="bg-black text-white">Beginner</option>
                        <option value="Intermediate" className="bg-black text-white">Intermediate</option>
                        <option value="Advanced" className="bg-black text-white">Advanced</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="h-[40vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="apple-card p-32 text-center space-y-6">
                    <div className="w-20 h-20 apple-glass rounded-3xl flex items-center justify-center mx-auto text-zinc-700">
                        <Eye className="w-10 h-10" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white tracking-tight">Zero Matches Found</p>
                        <p className="text-zinc-500 max-w-sm mx-auto mt-2 font-medium">Refine your query parameters to locate specific architectural records.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((p) => (
                        <div key={p.id} className={cn(
                            "apple-card p-10 flex flex-col justify-between group animate-in zoom-in-95 duration-500 hover:bg-white/[0.01] transition-all",
                            p.difficulty === 'Beginner' ? 'glow-emerald border-emerald-soft' :
                            p.difficulty === 'Intermediate' ? 'glow-blue border-blue-soft' :
                            'glow-purple border-purple-soft'
                        )}>
                            <div>
                                <div className="flex justify-between items-start mb-10">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[2px] border",
                                        p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 
                                        p.status === 'flagged' ? 'bg-red-500/10 text-red-500 border-red-500/10' :
                                        'bg-blue-500/10 text-blue-500 border-blue-500/10'
                                    )}>
                                        {p.status || 'Active'}
                                    </span>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600">
                                        <Clock className="w-3.5 h-3.5" />
                                        {format(new Date(p.created_at), 'MMM dd')}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-500 transition-colors line-clamp-1 tracking-tight">
                                        {p.title}
                                    </h3>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        <span className="apple-glass text-[9px] font-bold uppercase tracking-[1px] px-3 py-1.5 rounded-lg text-zinc-500">{p.domain}</span>
                                        <span className={cn(
                                            "text-[9px] font-bold uppercase tracking-[1px] px-3 py-1.5 rounded-lg border",
                                            p.difficulty === 'Beginner' ? 'border-emerald-500/10 text-emerald-500' :
                                            p.difficulty === 'Intermediate' ? 'border-blue-500/10 text-blue-500' :
                                            'border-red-500/10 text-red-500'
                                        )}>{p.difficulty}</span>
                                    </div>

                                    <p className="text-xs font-bold text-zinc-600 flex items-center gap-2 pt-2 truncate">
                                        <Layers className="w-3.5 h-3.5 text-zinc-800" />
                                        {p.tech_stack}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/[0.03] grid grid-cols-2 gap-4">
                                <Link href={`/dashboard/projects/${p.id}`} className="col-span-2">
                                    <Button className="w-full h-12 rounded-[1.25rem] shadow-apple">
                                        Open Workspace
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                                <button 
                                    onClick={() => api.downloadReport(p)}
                                    className="h-12 apple-glass rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white/[0.05] transition-all text-zinc-400"
                                >
                                    <FileText className="w-3.5 h-3.5" />
                                    Record
                                </button>
                                <button 
                                    onClick={() => handleDelete(p.id)}
                                    className="h-12 bg-red-500/[0.03] text-red-500/50 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Erase
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
