"use client";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { 
    Camera, 
    Mail, 
    Zap, 
    ChevronRight, 
    User as UserIcon, 
    Calendar, 
    Activity, 
    X,
    MapPin,
    Link as LinkIcon,
    Edit3,
    History,
    Layers,
    ShieldCheck,
    Globe,
    Cpu
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { api } from "@/services/api";
import { ActivityFeed, RecentProjectsList } from "@/components/dashboard/Widgets";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Modals
    const [editNameOpen, setEditNameOpen] = useState(false);
    const [nameInput, setNameInput] = useState(user?.name || "");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        api.getUserStats().then(setStats).catch(console.error);
        api.listProjects().then(setProjects).catch(console.error);
        if (user) setNameInput(user.name || "");
    }, [user]);

    const handleUpdateName = async () => {
        try {
            await api.updateProfile(nameInput);
            setMsg("Identity updated successfully.");
            setTimeout(() => { setEditNameOpen(false); setMsg(""); }, 2000);
        } catch(e: any) {
            setMsg(e.message);
        }
    }

    if (!user) return null;

    return (
        <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-1000 px-4 lg:px-8 py-10">
            
            {/* ── Profile Hero Section ────────────────────────────────────────────── */}
            <div className="relative rounded-[2.5rem] overflow-hidden apple-card border-none bg-[#050505]">
                {/* Mesh Gradient Background */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/30 blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]" />
                </div>

                {/* Cover Image Placeholder (Gradient) */}
                <div className="h-48 md:h-64 bg-gradient-to-r from-zinc-900 to-zinc-950 relative overflow-hidden">
                    <div className="absolute inset-0 retina-grid opacity-20" />
                </div>

                <div className="px-8 pb-10 relative">
                    <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 md:-mt-20">
                        {/* Avatar */}
                        <div className="relative group/avatar">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-zinc-900 border-8 border-[#050505] overflow-hidden flex items-center justify-center shadow-2xl relative z-10">
                                <span className="text-5xl md:text-6xl font-black text-gradient-blue">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 p-3 rounded-2xl apple-glass text-white shadow-apple opacity-0 group-hover/avatar:opacity-100 transition-all z-20 hover:scale-110 active:scale-90">
                                <Camera className="w-5 h-5" />
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                capture="user" 
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        alert("File selected: " + e.target.files[0].name + ". Server upload is pending implementation.");
                                    }
                                }} 
                            />
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[3rem] blur-xl opacity-20 group-hover/avatar:opacity-40 transition-opacity" />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 space-y-4 mb-2">
                            <div className="flex flex-wrap items-center gap-4">
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{user?.name || "Architect"}</h1>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 rounded-full apple-glass text-[9px] font-bold text-blue-400 tracking-[2px] uppercase">
                                        {user?.plan || "Free"} TIER
                                    </span>
                                    {user?.is_admin && (
                                        <span className="px-3 py-1 rounded-full apple-glass text-[9px] font-bold text-purple-400 tracking-[2px] uppercase border-purple-500/20">
                                            ADMINISTRATOR
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-zinc-500 text-sm font-medium">
                                <span className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> {user?.email}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Joined {new Date(user?.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-2 text-emerald-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mb-2">
                            <Button 
                                onClick={() => setEditNameOpen(true)}
                                className="h-12 px-6 rounded-2xl apple-glass hover:bg-white/[0.05] border-white/5 text-white font-bold text-xs uppercase tracking-widest gap-2"
                            >
                                <Edit3 className="w-4 h-4" /> Edit Profile
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Content Grid ───────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Column: About & Identity */}
                <div className="lg:col-span-4 space-y-12">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <UserIcon className="w-4 h-4 text-zinc-600" />
                            <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[3px]">About Identity</h2>
                        </div>
                        <div className="apple-card p-8 space-y-8 glow-blue border-blue-soft">
                            <div className="space-y-4">
                                <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                                    Strategic visionary and architectural pioneer within the Axion platform. Leveraging neural synthesis to build the future of logic.
                                </p>
                            </div>
                            
                            <div className="space-y-5 pt-4 border-t border-white/[0.04]">
                                <div className="flex items-center gap-4 text-zinc-500">
                                    <div className="p-2 rounded-xl apple-glass border-white/5">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-zinc-300">Global Node</span>
                                </div>
                                <div className="flex items-center gap-4 text-zinc-500">
                                    <div className="p-2 rounded-xl apple-glass border-white/5">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-zinc-300">axion-pilot.dev</span>
                                </div>
                                <div className="flex items-center gap-4 text-zinc-500">
                                    <div className="p-2 rounded-xl apple-glass border-white/5">
                                        <Cpu className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-zinc-300">Neural Engine v3.0</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <ShieldCheck className="w-4 h-4 text-zinc-600" />
                            <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[3px]">Access Integrity</h2>
                        </div>
                        <div className="apple-card p-6 flex items-center justify-between group cursor-pointer hover:bg-white/[0.01] transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-white uppercase tracking-wider">Account Verified</p>
                                    <p className="text-[10px] text-zinc-600 font-bold tracking-tight">Level 4 Security Clearance</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-zinc-400 transition-colors" />
                        </div>
                    </section>
                </div>

                {/* Right Column: Activity & Showcase */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="apple-card p-8 text-center space-y-2 glow-blue border-blue-soft transition-all hover:scale-[1.02]">
                            <p className="text-4xl font-bold text-white tracking-tighter">{stats?.projects_generated || 0}</p>
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[2px]">Vaults</p>
                        </div>
                        <div className="apple-card p-8 text-center space-y-2 glow-purple border-purple-soft transition-all hover:scale-[1.02]">
                            <p className="text-4xl font-bold text-white tracking-tighter">{stats?.reports_created || 0}</p>
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[2px]">Syntheses</p>
                        </div>
                        <div className="apple-card p-8 text-center space-y-2 glow-orange border-orange-soft transition-all hover:scale-[1.02]">
                            <p className="text-4xl font-bold text-white tracking-tighter">98.4</p>
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[2px]">Accuracy</p>
                        </div>
                        <div className="apple-card p-8 text-center space-y-2 glow-emerald border-emerald-soft transition-all hover:scale-[1.02]">
                            <p className="text-4xl font-bold text-white tracking-tighter">∞</p>
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[2px]">Uptime</p>
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <History className="w-4 h-4 text-zinc-600" />
                            <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[3px]">Pulse Activity</h2>
                        </div>
                        <ActivityFeed />
                    </section>

                    {/* Recent Records */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <Layers className="w-4 h-4 text-zinc-600" />
                            <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[3px]">Architectural Records</h2>
                        </div>
                        <RecentProjectsList projects={projects} />
                    </section>
                </div>
            </div>

            {/* ── Modals ─────────────────────────────────────────────────────────── */}
            {editNameOpen && (
                <div className="fixed inset-0 bg-background/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="apple-card rounded-[2.5rem] p-10 max-w-md w-full space-y-8 shadow-apple relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -z-10" />
                        
                        <button onClick={() => setEditNameOpen(false)} className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors">
                            <X className="w-6 h-6"/>
                        </button>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-white tracking-tight">Identity Modification</h3>
                            <p className="text-zinc-500 text-sm font-medium">Update your public signature across the network.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[3px] ml-1">Full Signature</label>
                                <input 
                                    value={nameInput} 
                                    onChange={e=>setNameInput(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                                    placeholder="Enter full name..."
                                />
                            </div>
                            
                            {msg && (
                                <p className={cn(
                                    "text-xs font-bold px-4 py-2 rounded-lg",
                                    msg.includes("success") ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                )}>
                                    {msg}
                                </p>
                            )}

                            <Button 
                                onClick={handleUpdateName} 
                                className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs uppercase tracking-[2px] shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
                            >
                                Execute Update
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
