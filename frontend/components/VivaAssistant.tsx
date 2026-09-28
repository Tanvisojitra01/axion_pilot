"use client";
import { useState } from "react";
import { api } from "../services/api";
import { Bot, Send, Key, User, Sparkles, CheckCircle2 } from "lucide-react";

export default function VivaAssistant({ projectData }: { projectData: any }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const [showKeyConfig, setShowKeyConfig] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const newMsg = { role: "user", content: input };
        setMessages(prev => [...prev, newMsg]);
        setInput("");
        setLoading(true);

        try {
            const history = [...messages, newMsg];
            const res = await api.chatViva(apiKey || "", history, projectData, "gemini");
            setMessages([...history, { role: "assistant", content: res.response }]);
        } catch (err: any) {
            setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Error: " + (err.message || "Failed to generate response.") }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card border border-border/50 rounded-[2rem] p-6 shadow-sm animate-fade-in-up relative overflow-hidden mt-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground tracking-tight">Viva Assistant</h2>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                            <Sparkles className="w-3 h-3 text-accent" />
                            AI Powered Interview Coach
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        System AI Active
                    </span>
                    <button
                        onClick={() => setShowKeyConfig(!showKeyConfig)}
                        title="Configure custom API key (optional)"
                        className={`p-2 rounded-xl border text-xs transition-all ${showKeyConfig ? 'bg-primary text-white border-primary' : 'bg-muted/40 text-muted-foreground border-border/50 hover:text-foreground'}`}
                    >
                        <Key className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Optional Custom API Key Box */}
            {showKeyConfig && (
                <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-primary uppercase tracking-[0.1em] flex items-center gap-2">
                            <Key className="w-3.5 h-3.5" />
                            Custom API Key (Optional)
                        </label>
                        <span className="text-[10px] text-muted-foreground">Default: Server Gemini Key</span>
                    </div>
                    <div className="relative group">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full text-sm py-2.5 px-4 rounded-xl bg-background border border-border/60 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm"
                            placeholder="Leave empty to use server's built-in Gemini key"
                        />
                    </div>
                </div>
            )}

            <div className="bg-muted/30 rounded-[1.5rem] border border-border/40 h-[400px] overflow-y-auto p-5 mb-4 space-y-4 scrollbar-hide relative shadow-inner">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center">
                            <Bot className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-muted-foreground">Ready to start your prep?</p>
                            <p className="text-xs">Ask specific architecture, logic, or viva defense questions.</p>
                        </div>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        {m.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 shadow-sm">
                                <Bot className="w-4 h-4 text-primary" />
                            </div>
                        )}
                        <div className={`max-w-[85%] rounded-[1.25rem] px-5 py-3.5 text-sm leading-relaxed shadow-sm ${m.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-tr-none font-medium'
                                : 'bg-card text-foreground rounded-tl-none border border-border/50 font-medium whitespace-pre-wrap'
                            }`}>
                            {m.content}
                        </div>
                        {m.role === 'user' && (
                            <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 shadow-sm border border-accent/20">
                                <User className="w-4 h-4 text-accent" />
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3 animate-pulse">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-card border border-border/50 rounded-[1.25rem] rounded-tl-none px-5 py-4 flex items-center gap-1.5 shadow-sm">
                            <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
            </div>

            <div className="relative group p-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-[1.25rem]">
                <div className="bg-background rounded-[1.1rem] overflow-hidden flex items-center">
                    <input
                        className="flex-1 bg-transparent pl-5 pr-14 py-4 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50 font-medium"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your project, architecture, viva questions..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="absolute right-2.5 p-2.5 bg-primary text-primary-foreground rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-40 shadow-lg shadow-primary/20"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <p className="text-[10px] text-center text-muted-foreground/60 mt-4 uppercase tracking-[0.2em] font-bold">
                Project Architect v1.0 • AI Analysis Active
            </p>
        </div>
    );
}
