"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/components/AuthProvider";
import { 
    Users, Layers, FileText, Monitor, Activity, ShieldAlert, Clock, Search, Filter, 
    Settings2, Database, Zap, MoreHorizontal, UserPlus, Trash2, Edit3, 
    CheckCircle2, XCircle, Download, ExternalLink, Key, Cpu, LineChart as LineIcon,
    MessageSquare
} from "lucide-react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    Cell, LineChart, Line, AreaChart, Area, PieChart, Pie
} from "recharts";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// --- Helper for Count-up animation ---
function CountUp({ value, duration = 1000 }: { value: number | string, duration?: number }) {
    const [count, setCount] = useState(0);
    const target = typeof value === 'number' ? value : parseInt(value) || 0;

    useEffect(() => {
        let start = 0;
        const end = target;
        if (start === end) { setCount(end); return; }
        
        let startTimestamp: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * (end - start) + start));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [target, duration]);

    return <span>{count}</span>;
}

export default function AdminControlPanel() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    
    // Data States
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [ppts, setPpts] = useState<any[]>([]);
    const [aiConfig, setAiConfig] = useState<any>(null);
    
    // UI States
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [s, u, p, r, ppt, config] = await Promise.all([
                api.getAdminStats(),
                api.adminListUsers(),
                api.adminListAllProjects(),
                api.adminListContents("report"),
                api.adminListContents("presentation"),
                api.adminGetConfig()
            ]);
            setStats(s);
            setUsers(u);
            setProjects(p);
            setReports(r);
            setPpts(ppt);
            setAiConfig(config);
        } catch (err) {
            console.error("Critical failure fetching admin data", err);
            toast.error("Security/Network error fetching system data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.is_admin) fetchData();
    }, [user]);

    // Derived Data
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 u.name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = filterRole === "all" || u.role === filterRole;
            const matchesStatus = filterStatus === "all" || u.status === filterStatus;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, filterRole, filterStatus]);

    // Action Handlers
    const toggleUserStatus = async (userId: number, currentStatus: string) => {
        const newStatus = currentStatus === "active" ? "suspended" : "active";
        try {
            await api.adminUpdateUserStatus(userId, newStatus);
            toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
            fetchData();
        } catch (err) { toast.error("Action failed"); }
    };

    const deleteProject = async (id: number) => {
        if (!confirm("Confirm permanent deletion of project?")) return;
        try {
            await api.adminDeleteProject(id);
            toast.success("Project purged from system");
            fetchData();
        } catch (err) { toast.error("Deletion failed"); }
    };

    const saveAiConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.adminSaveConfig(aiConfig);
            toast.success("AI Configuration synchronized");
        } catch (err) { toast.error("Sync failed"); }
    };

    if (loading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] space-y-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <ShieldAlert className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>
                <p className="text-[10px] font-black tracking-[4px] text-zinc-600 uppercase animate-pulse">Establishing Sudo Connection...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-24 animate-in fade-in duration-700 max-w-[1600px] mx-auto px-4 lg:px-8">
            {/* ── Global Header ────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-[2rem] apple-card p-8 lg:p-12 group/header">
                <div className="absolute inset-0 -z-10 retina-grid opacity-20" />
                
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full apple-glass text-[9px] font-bold tracking-[2px] text-red-500 uppercase">
                            <ShieldAlert className="w-3 h-3" />
                            Sudo Access Secured
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-[-0.05em] leading-[0.9] transition-all">
                            Platform Control <span className="text-gradient-orange">Center</span>
                        </h1>
                        <p className="text-zinc-500 text-xs font-semibold flex items-center gap-2">
                            Session: <span className="text-zinc-300">{user?.email}</span> <div className="w-1 h-1 rounded-full bg-zinc-800" /> Operational Audit Active
                        </p>
                    </div>

                    <div className="text-right space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl apple-glass text-emerald-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-bold uppercase tracking-[1.5px]">Live System</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-white text-4xl font-semibold tracking-tighter tabular-nums">{format(currentTime, 'HH:mm:ss')}</p>
                            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[2px]">{format(currentTime, 'EEEE, MMM do yyyy')}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
                    {[
                        { label: "Assets", value: stats?.counters.total_users, color: "text-blue-500", icon: Users, glow: "glow-blue", border: "border-blue-soft" },
                        { label: "Nodes", value: stats?.counters.active_users, color: "text-emerald-500", icon: Activity, glow: "glow-emerald", border: "border-emerald-soft" },
                        { label: "Projects", value: stats?.counters.total_projects, color: "text-purple-500", icon: Layers, glow: "glow-purple", border: "border-purple-soft" },
                        { label: "Queries", value: stats?.counters.total_viva_questions, color: "text-orange-500", icon: MessageSquare, glow: "glow-orange", border: "border-orange-soft" },
                    ].map((item, i) => (
                        <div key={i} className={cn("p-8 rounded-[2rem] apple-glass border transition-all duration-500 group relative overflow-hidden", item.glow, item.border)}>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                <item.icon className={cn("w-12 h-12", item.color)} />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className={cn("w-10 h-10 rounded-2xl apple-glass flex items-center justify-center transition-transform group-hover:scale-110")}>
                                    <item.icon className={cn("w-5 h-5", item.color)} />
                                </div>
                                <div>
                                    <p className="text-[32px] font-bold text-white tabular-nums tracking-tighter"><CountUp value={item.value || 0} /></p>
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[2px]">{item.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Navigation ──────────────────────────────────────────────────── */}
            <div className="flex items-center gap-1 p-1 rounded-2xl apple-glass w-fit mx-auto lg:mx-0 sticky top-8 z-40 shadow-apple">
                {["overview", "accounts", "projects", "reports", "ppts", "config"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-bold tracking-[1.5px] uppercase transition-all duration-200",
                            activeTab === tab 
                                ? "bg-white/10 text-white shadow-soft" 
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ── Tab Content ──────────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.15, 0, 0.15, 1] }}
                >
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="p-8 rounded-[2rem] apple-card">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-3 uppercase tracking-widest">
                                        <Database className="w-4 h-4 text-blue-500" /> Domain Analysis
                                    </h3>
                                    <div className="w-2 h-2 rounded-full bg-blue-500/20 animate-pulse" />
                                </div>
                                <div className="h-[320px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats?.charts.domains}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{fontSize: 9, fill: '#52525b', fontWeight: 600}} 
                                            />
                                            <YAxis 
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{fontSize: 9, fill: '#52525b', fontWeight: 600}} 
                                            />
                                            <Tooltip 
                                                cursor={{fill: 'rgba(255,255,255,0.02)'}}
                                                contentStyle={{backgroundColor: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '12px'}} 
                                            />
                                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 4, 4]} barSize={32} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="p-8 rounded-[2rem] apple-card">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-3 uppercase tracking-widest">
                                        <Zap className="w-4 h-4 text-orange-500" /> Difficulty Index
                                    </h3>
                                    <div className="w-2 h-2 rounded-full bg-orange-500/20 animate-pulse" />
                                </div>
                                <div className="h-[320px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stats?.charts.difficulty}>
                                            <defs>
                                                <linearGradient id="colorDiff" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{fontSize: 9, fill: '#52525b', fontWeight: 600}} 
                                            />
                                            <YAxis 
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{fontSize: 9, fill: '#52525b', fontWeight: 600}} 
                                            />
                                            <Tooltip 
                                                contentStyle={{backgroundColor: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px'}} 
                                            />
                                            <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorDiff)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "accounts" && (
                        <div className="space-y-6">
                            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between p-6 rounded-3xl apple-card shadow-soft">
                                <div className="relative w-full lg:w-[400px]">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <input 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search records..."
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs font-semibold focus:border-white/20 outline-none transition-all placeholder:text-zinc-700"
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full lg:w-auto">
                                    <select 
                                        value={filterRole} 
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        className="bg-white/[0.03] border border-white/10 text-zinc-400 text-[9px] font-bold uppercase tracking-widest px-6 py-4 rounded-2xl outline-none focus:border-white/20 transition-all cursor-pointer"
                                    >
                                        <option value="all">Roles: All</option>
                                        <option value="user">User</option>
                                        <option value="moderator">Moderator</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <select 
                                        value={filterStatus} 
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="bg-white/[0.03] border border-white/10 text-zinc-400 text-[9px] font-bold uppercase tracking-widest px-6 py-4 rounded-2xl outline-none focus:border-white/20 transition-all cursor-pointer"
                                    >
                                        <option value="all">Status: Any</option>
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-[2rem] apple-card shadow-apple">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.02] border-b border-white/[0.04]">
                                            <th className="px-8 py-6 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Identify</th>
                                            <th className="px-8 py-6 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Clearance</th>
                                            <th className="px-8 py-6 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">State</th>
                                            <th className="px-8 py-6 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Last Entry</th>
                                            <th className="px-8 py-6 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Audit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {filteredUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-white/[0.01] transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl apple-glass flex items-center justify-center text-zinc-300 font-bold group-hover:scale-105 transition-transform">
                                                            {u.name?.charAt(0) || u.email.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-white">{u.name || "N/A"}</p>
                                                            <p className="text-[10px] text-zinc-600 font-semibold">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-lg text-[8px] font-bold tracking-[1.5px] uppercase border",
                                                        u.role === 'admin' ? "bg-red-500/5 border-red-500/10 text-red-500" :
                                                        u.role === 'moderator' ? "bg-purple-500/5 border-purple-500/10 text-purple-500" :
                                                        "bg-blue-500/5 border-blue-500/10 text-blue-500"
                                                    )}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn("w-1 h-1 rounded-full", u.status === 'active' ? "bg-emerald-500" : "bg-red-500")} />
                                                        <span className={cn("text-[9px] font-bold uppercase tracking-widest", u.status === 'active' ? "text-emerald-500" : "text-red-500")}>
                                                            {u.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter tabular-nums">
                                                        {u.last_login ? format(new Date(u.last_login), 'MMM dd, HH:mm') : 'NO_RECORDS'}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => toggleUserStatus(u.id, u.status)}
                                                            className="p-2.5 rounded-xl apple-glass hover:bg-red-500/10 text-zinc-600 hover:text-red-500 transition-all"
                                                        >
                                                            {u.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                                        </button>
                                                        <button className="p-2.5 rounded-xl apple-glass hover:bg-white/10 text-zinc-600 hover:text-white transition-all">
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "projects" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((p) => (
                                <div key={p.id} className="group p-8 rounded-[2rem] apple-card hover:bg-white/[0.01] transition-all">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="p-4 rounded-2xl apple-glass text-blue-500 group-hover:scale-110 transition-transform shadow-soft">
                                            <Layers className="w-5 h-5" />
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => deleteProject(p.id)}
                                                className="p-3 rounded-2xl apple-glass text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-bold text-white tracking-tight mb-3">{p.name}</h4>
                                    <p className="text-[11px] text-zinc-600 font-semibold mb-8 line-clamp-2 leading-relaxed">{p.description || "Project identification and parameters defined within secure environment."}</p>
                                    
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-[8px] font-bold text-zinc-700 uppercase tracking-widest">
                                                <span>Deploy Progress</span>
                                                <span>{p.progress}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)] transition-all duration-1000" 
                                                    style={{ width: `${p.progress}%` }} 
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-6 border-t border-white/[0.03]">
                                            <div className="flex -space-x-1.5">
                                                {[1, 2].map(i => (
                                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-[#050505] apple-glass flex items-center justify-center text-[7px] font-bold text-zinc-500">
                                                        U{i}
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">
                                                {p.owner_email.split('@')[0]}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "reports" && (
                        <div className="space-y-3">
                            {reports.map((r) => (
                                <div key={r.id} className="flex items-center justify-between p-6 rounded-2xl apple-card group">
                                    <div className="flex items-center gap-8">
                                        <div className="p-4 rounded-2xl apple-glass text-emerald-500">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white tracking-tight">{r.project_title}</h4>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">Dynamic_Asset</span>
                                                <span className="text-[9px] text-zinc-600 font-semibold italic">By {r.user_email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="p-3 rounded-xl apple-glass text-zinc-500 hover:text-white transition-all">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button className="h-10 px-6 rounded-xl apple-glass text-white font-bold text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all">
                                            Export
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "ppts" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {ppts.map((p) => (
                                <div key={p.id} className="relative group overflow-hidden rounded-2xl apple-card">
                                    <div className="aspect-[16/10] bg-zinc-950 flex items-center justify-center border-b border-white/[0.04] relative">
                                        <Monitor className="w-10 h-10 text-zinc-900 group-hover:text-orange-500 transition-colors duration-500" />
                                    </div>
                                    <div className="p-6">
                                        <h5 className="text-[11px] font-bold text-white mb-1 truncate">{p.project_title}</h5>
                                        <p className="text-[9px] text-zinc-700 font-bold mb-4 uppercase tracking-[1.5px]">{format(new Date(p.created_at), 'MMM dd, yyyy')}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
                                            <span className="text-[8px] font-bold text-orange-500 uppercase tracking-widest">v2.0_Secure</span>
                                            <ExternalLink className="w-3 h-3 text-zinc-800" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "config" && aiConfig && (
                        <div className="max-w-3xl mx-auto p-10 lg:p-16 rounded-[2.5rem] apple-card">
                            <div className="flex items-center gap-8 mb-16">
                                <div className="p-5 rounded-3xl apple-glass text-orange-500 shadow-soft">
                                    <Cpu className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-white tracking-tighter">AI Orchestration</h3>
                                    <p className="text-zinc-600 text-xs font-semibold">Global parameter definition and API synchronization.</p>
                                </div>
                            </div>

                            <form onSubmit={saveAiConfig} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Selection_Model</label>
                                        <select 
                                            value={aiConfig.model}
                                            onChange={(e) => setAiConfig({...aiConfig, model: e.target.value})}
                                            className="w-full bg-white/[0.03] border border-white/10 text-white p-5 rounded-2xl outline-none focus:border-white/20 transition-all font-bold text-xs"
                                        >
                                            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Key_Vector</label>
                                        <div className="relative">
                                            <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                                            <input 
                                                type="password"
                                                value={aiConfig.api_key}
                                                onChange={(e) => setAiConfig({...aiConfig, api_key: e.target.value})}
                                                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs outline-none focus:border-white/20 transition-all font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 pt-10 border-t border-white/[0.03]">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold text-white uppercase tracking-widest">Quota_Limit</p>
                                            <p className="text-[10px] text-zinc-700 font-semibold">Maximum daily operation limit per node.</p>
                                        </div>
                                        <span className="text-2xl font-semibold text-white tabular-nums">{aiConfig.usage_limit}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="100" max="5000" step="100"
                                        value={aiConfig.usage_limit}
                                        onChange={(e) => setAiConfig({...aiConfig, usage_limit: parseInt(e.target.value)})}
                                        className="w-full h-1 bg-white/[0.03] rounded-full appearance-none cursor-pointer accent-white"
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full py-5 rounded-2xl bg-white text-black text-[10px] font-bold uppercase tracking-[2px] hover:bg-zinc-200 transition-all shadow-apple active:scale-[0.98]"
                                >
                                    Update Configuration
                                </button>
                            </form>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

