"use client";

import { useState, useEffect } from "react";
import { api, ProjectRequest } from "../services/api";
import { Sparkles, Code2, BookOpen, Layers, Rocket, Loader2, AlignLeft, Layout, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const domains = [
    "Machine Learning",
    "Web Development",
    "Data Science",
    "IoT (Internet of Things)",
    "Blockchain",
    "Cybersecurity",
    "Cloud Computing",
    "Artificial Intelligence",
    "App Development (Android/iOS)",
    "Embedded Systems",
    "Big Data Analysis",
    "AR/VR Technology",
    "Game Development",
    "NLP (Natural Language Processing)"
];

const difficulties = ["Beginner", "Intermediate", "Advanced"];

export default function ProjectForm({ onProjectGenerated }: { onProjectGenerated: (data: any) => void }) {
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState<any[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
    const [formData, setFormData] = useState<ProjectRequest>({
        api_key: "",
        domain: "Machine Learning",
        topic: "",
        description: "",
        difficulty: "Intermediate",
        tech_stack: "",
        year: "Final Year",
    });

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await api.getPublicTemplates();
                setTemplates(data || []);
            } catch (err) {
                console.error("Failed to fetch templates", err);
            }
        };
        fetchTemplates();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (selectedTemplateId) setSelectedTemplateId(null);
    };

    const handleSelectTemplate = (t: any) => {
        setFormData({
            ...formData,
            domain: t.domain,
            difficulty: t.difficulty,
            tech_stack: t.tech_stack,
            topic: t.name,
            description: t.description
        });
        setSelectedTemplateId(t.id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await api.generateProject(formData);
            onProjectGenerated(data);
        } catch (error) {
            alert("Error: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 max-w-4xl mx-auto">
            {/* Template Selection */}
            {templates.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-bold uppercase tracking-[4px] text-zinc-600 flex items-center gap-4">
                            <Sparkles className="w-3 h-3 text-blue-500" />
                            Pre-configured Blueprints
                        </label>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-6 px-2 scrollbar-hide no-scrollbar">
                        {templates.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => handleSelectTemplate(t)}
                                className={cn(
                                    "flex-shrink-0 w-72 p-8 rounded-[2.5rem] border text-left transition-all duration-500 group relative overflow-hidden",
                                    selectedTemplateId === t.id 
                                        ? "apple-glass border-blue-500 shadow-apple scale-[1.02] bg-white/[0.05]" 
                                        : "apple-card border-white/[0.05] hover:border-white/20 text-zinc-400 hover:text-white"
                                )}
                            >
                                <div className={cn(
                                    "p-3 w-fit rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110",
                                    selectedTemplateId === t.id ? "apple-glass text-white shadow-soft" : "apple-glass text-zinc-600 border-white/[0.05]"
                                )}>
                                    <Layout className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 line-clamp-1 tracking-tight text-white">{t.name}</h3>
                                <p className={cn(
                                    "text-[9px] font-bold uppercase tracking-[2px] mb-4",
                                    selectedTemplateId === t.id ? "text-blue-500" : "text-zinc-600"
                                )}>
                                    {t.domain}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border",
                                        selectedTemplateId === t.id ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/[0.05] text-zinc-600"
                                    )}>
                                        {t.difficulty}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="apple-card p-10 lg:p-16 relative overflow-hidden shadow-apple">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.02] blur-[100px] -mr-32 -mt-32" />
                
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-[1.25rem] apple-glass flex items-center justify-center text-white shadow-soft">
                            <Rocket className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-white leading-none">
                            {selectedTemplateId ? "Blueprint Parameters" : "Synthesis Configuration"}
                        </h2>
                    </div>
                    <p className="text-zinc-500 text-lg font-medium tracking-tight ml-0 lg:ml-16">Define the architectural constraints for your production asset.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Provider & API Key */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="space-y-3 md:col-span-4">
                            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-[2px] ml-2">
                                Neural Engine
                            </label>
                            <div className="relative group">
                                <select
                                    name="ai_provider"
                                    value={formData.ai_provider || "gemini"}
                                    onChange={handleChange}
                                    className="w-full apple-glass border-white/[0.05] rounded-2xl py-4 pl-6 pr-12 text-white focus:border-white/20 outline-none appearance-none cursor-pointer hover:bg-white/[0.05] transition-all font-bold text-[13px] tracking-tight"
                                >
                                    <option value="gemini" className="bg-black">Standard Synth</option>
                                    <option value="openai" className="bg-black">OpenAI X-1</option>
                                    <option value="anthropic" className="bg-black">Claude Prime</option>
                                    <option value="xai" className="bg-black">Grok Logic</option>
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 rotate-90 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-3 md:col-span-8">
                            <div className="flex justify-between items-center px-2">
                                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-[2px]">
                                    Access Credential
                                </label>
                                <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">System Default Active</span>
                            </div>
                            <input
                                type="password"
                                name="auth_key"
                                autoComplete="off"
                                value={formData.api_key}
                                onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                                className="w-full apple-glass border-white/[0.05] rounded-2xl py-4 px-6 text-white focus:border-white/20 transition-all font-mono text-[13px] placeholder:text-zinc-800"
                                placeholder="Enter secure key or leave for system bypass"
                            />
                        </div>
                    </div>

                    {/* Domain & Difficulty */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-[2px] ml-2">
                                Sector Domain
                            </label>
                            <div className="relative group">
                                <select
                                    name="domain"
                                    value={formData.domain}
                                    onChange={handleChange}
                                    className="w-full apple-glass border-white/[0.05] rounded-2xl py-4 pl-6 pr-12 text-white focus:border-white/20 outline-none appearance-none cursor-pointer hover:bg-white/[0.05] transition-all font-bold text-[13px] tracking-tight"
                                >
                                    {domains.map((d) => (
                                        <option key={d} value={d} className="bg-black text-white">{d}</option>
                                    ))}
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 rotate-90 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-[2px] ml-2">
                                Index Complexity
                            </label>
                            <div className="relative group">
                                <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                    className="w-full apple-glass border-white/[0.05] rounded-2xl py-4 pl-6 pr-12 text-white focus:border-white/20 outline-none appearance-none cursor-pointer hover:bg-white/[0.05] transition-all font-bold text-[13px] tracking-tight"
                                >
                                    {difficulties.map((diff) => (
                                        <option key={diff} value={diff} className="bg-black text-white">{diff}</option>
                                    ))}
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 rotate-90 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack & Topic */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-[2px] ml-2">
                                Implementation Stack
                            </label>
                            <input
                                type="text"
                                name="tech_stack"
                                value={formData.tech_stack}
                                onChange={handleChange}
                                className="w-full apple-glass border-white/[0.05] rounded-2xl py-4 px-6 text-white focus:border-white/20 transition-all font-bold text-[13px] placeholder:text-zinc-800"
                                placeholder="e.g. Next.js, Cloudflare, Supabase"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-[2px] ml-2">
                                Logic Vector (Topic)
                            </label>
                            <input
                                type="text"
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                placeholder="e.g. Quantum Analytics Engine"
                                className="w-full apple-glass border-white/[0.05] rounded-2xl py-4 px-6 text-white focus:border-white/20 transition-all font-bold text-[13px] placeholder:text-zinc-800"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-[2px] ml-2 flex items-center gap-2">
                            Structural Abstract
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Detail the core functional objectives and architectural constraints..."
                            rows={5}
                            className="w-full apple-glass border-white/[0.05] rounded-[2rem] py-6 px-8 text-white focus:border-white/20 transition-all resize-none leading-relaxed font-medium text-[14px] placeholder:text-zinc-800"
                        />
                    </div>

                    <Button 
                        type="submit" 
                        disabled={loading}
                        size="xl"
                        className="w-full h-16 rounded-[1.5rem] text-lg font-bold shadow-apple group/launch"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin mr-3" />
                        ) : (
                            <Sparkles className="w-6 h-6 mr-3 transition-transform group-hover/launch:rotate-12" />
                        )}
                        {loading ? "Synthesizing Architecture..." : "Initiate System Synthesis"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
