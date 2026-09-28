"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import { Save, RotateCcw, ChevronLeft, Loader2, CheckCircle2, Pencil, FileText, MonitorPlay, Sparkles, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProjectEditorPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("details");
    const autoSaveTimer = useRef<any>(null);

    // Editable fields
    const [title, setTitle] = useState("");
    const [abstract, setAbstract] = useState("");
    const [problemStatement, setProblemStatement] = useState("");
    const [methodology, setMethodology] = useState("");
    const [literatureSurvey, setLiteratureSurvey] = useState("");
    const [archDescription, setArchDescription] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await api.getProjectById(Number(params.id));
                setProject(data);
                setTitle(data.title || "");
                setAbstract(data.abstract || "");
                setProblemStatement(data.problem_statement || "");
                setMethodology(data.methodology || "");
                setLiteratureSurvey(data.literature_survey || "");
                setArchDescription(data.architecture_description || "");
            } catch (err) {
                router.push("/dashboard/projects");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [params.id]);

    const saveProject = useCallback(async () => {
        if (!project) return;
        setSaving(true);
        setSaved(false);
        setError("");
        try {
            await api.updateProject(project.id, {
                title,
                abstract,
                problem_statement: problemStatement,
                methodology,
                literature_survey: literatureSurvey,
                architecture_description: archDescription,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    }, [project, title, abstract, problemStatement, methodology, literatureSurvey, archDescription]);

    // Auto-save on change (debounced 3s)
    const triggerAutoSave = useCallback(() => {
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(() => {
            saveProject();
        }, 3000);
    }, [saveProject]);

    useEffect(() => {
        if (!loading && project) triggerAutoSave();
        return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
    }, [title, abstract, problemStatement, methodology, literatureSurvey, archDescription]);

    const sections = [
        { id: "details", label: "Project Details", icon: Pencil },
        { id: "report", label: "Report Content", icon: FileText },
        { id: "architecture", label: "Architecture", icon: MonitorPlay },
    ];

    if (loading) return (
        <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm font-black text-muted-foreground uppercase tracking-widest animate-pulse">Loading Editor...</p>
        </div>
    );

    const handleRegenerate = async () => {
        const apiKey = prompt("Please enter your AI API Key to regenerate this project:");
        if (!apiKey) return;
        
        setSaving(true);
        setError("");
        try {
            const newData = await api.regenerateProject(project.id, apiKey);
            setProject({...project, ...newData});
            setTitle(newData.title || "");
            setAbstract(newData.abstract || "");
            setProblemStatement(newData.problem_statement || "");
            setMethodology(newData.methodology || "");
            setLiteratureSurvey(newData.literature_survey || "");
            setArchDescription(newData.architecture_description || "");
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border/40 pb-8">
                <div className="space-y-2">
                    <button onClick={() => router.back()} className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Workspace
                    </button>
                    <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                        <Pencil className="w-7 h-7 text-primary" />
                        Project Editor
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">Edit your project content. Changes auto-save after 3 seconds of inactivity.</p>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-2 text-xs font-bold text-emerald-500 animate-in fade-in">
                            <CheckCircle2 className="w-4 h-4" /> Saved
                        </span>
                    )}
                    {saving && (
                        <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" /> Working...
                        </span>
                    )}
                    {error && (
                        <span className="flex items-center gap-2 text-xs font-bold text-destructive">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </span>
                    )}
                    <Button onClick={handleRegenerate} variant="ghost" className="rounded-xl font-bold px-4 text-primary bg-primary/5 hover:bg-primary/10">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Re-cook AI
                    </Button>
                    <Button onClick={saveProject} disabled={saving} className="rounded-xl font-bold px-6 shadow-lg shadow-primary/20">
                        <Save className="w-4 h-4 mr-2" />
                        Save Now
                    </Button>
                    <Button variant="outline" onClick={() => router.push(`/dashboard/projects/${project.id}`)} className="rounded-xl font-bold px-6">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        View Live
                    </Button>
                </div>
            </div>

            {/* Section tabs */}
            <div className="flex items-center gap-1.5 p-1.5 bg-muted/40 border border-border/40 rounded-2xl w-fit">
                {sections.map((s) => (
                    <button key={s.id} onClick={() => setActiveSection(s.id)} className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all",
                        activeSection === s.id ? "bg-card text-primary shadow-sm border border-border/50" : "text-muted-foreground hover:bg-muted/50"
                    )}>
                        <s.icon className="w-4 h-4" />
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Editor Panels */}
            <div className="space-y-6 animate-in fade-in duration-300">
                {activeSection === "details" && (
                    <div className="space-y-6">
                        <EditorField label="Project Title" value={title} onChange={setTitle} placeholder="Enter project title..." />
                        <EditorField label="Abstract / Description" value={abstract} onChange={setAbstract} placeholder="Enter project abstract..." multiline rows={6} />
                    </div>
                )}

                {activeSection === "report" && (
                    <div className="space-y-6">
                        <EditorField label="Problem Statement" value={problemStatement} onChange={setProblemStatement} placeholder="Define the problem this project solves..." multiline rows={5} />
                        <EditorField label="Literature Survey" value={literatureSurvey} onChange={setLiteratureSurvey} placeholder="Reference previous work and research..." multiline rows={5} />
                        <EditorField label="Methodology" value={methodology} onChange={setMethodology} placeholder="Describe the methodology used..." multiline rows={6} />
                    </div>
                )}

                {activeSection === "architecture" && (
                    <div className="space-y-6">
                        <EditorField label="Architecture Description" value={archDescription} onChange={setArchDescription} placeholder="Describe the system architecture..." multiline rows={8} />
                    </div>
                )}
            </div>

            {/* Auto-save indicator */}
            <div className="fixed bottom-6 right-6 z-50">
                <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border/50 rounded-full shadow-lg text-xs font-bold text-muted-foreground">
                    <Sparkles className="w-3 h-3 text-primary" />
                    Auto-save enabled
                </div>
            </div>
        </div>
    );
}

function EditorField({ label, value, onChange, placeholder, multiline, rows }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean; rows?: number;
}) {
    return (
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{label}</label>
            {multiline ? (
                <textarea
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows || 4}
                    className="w-full bg-muted/30 border border-border/40 rounded-xl px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-y"
                />
            ) : (
                <input
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-muted/30 border border-border/40 rounded-xl px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
            )}
        </div>
    );
}
