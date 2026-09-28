"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, MessageSquare, Sparkles, User, Key, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";

export function ChatBot() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    
    // Professional exclusion logic (Don't show on landing or auth-related flows)
    const isExcludedPage = pathname === "/" || [
        "/login", 
        "/signup", 
        "/forgot-password", 
        "/reset-password"
    ].some(path => pathname === path || pathname.startsWith(path + "/"));
    
    const [isMaximized, setIsMaximized] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Load API key from localStorage on mount
    useEffect(() => {
        const savedKey = localStorage.getItem("assistant_api_key");
        if (savedKey) setApiKey(savedKey);
    }, []);

    // Save API key when it changes
    useEffect(() => {
        if (apiKey) localStorage.setItem("assistant_api_key", apiKey);
    }, [apiKey]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || !apiKey) return;

        const newMsg = { role: "user", content: input };
        setMessages(prev => [...prev, newMsg]);
        setInput("");
        setLoading(true);

        try {
            const history = [...messages, newMsg];
            // Passing the provider explicitly as the user requested for chatbot
            const res = await api.chatViva(apiKey || "", history, null, "gemini");
            setMessages(prev => [...prev, { role: "assistant", content: res.response }]);
        } catch (err: any) {
            setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Error: " + (err.message || "Failed to connect to AI service.") }]);
        } finally {
            setLoading(false);
        }
    };

    if (isExcludedPage) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            <div className="absolute bottom-8 right-8 flex flex-col items-end gap-4 pointer-events-none">
                <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className={cn(
                            "bg-[rgba(10,13,20,0.85)] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden",
                            isMaximized ? "w-[85vw] h-[85vh] max-w-5xl" : "w-[420px] h-[650px] max-h-[calc(100vh-8rem)]"
                        )}
                    >
                        {/* Premium Header */}
                        <div className="p-6 border-b border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(59,130,246,0.15)] group">
                                        <Bot className="w-6 h-6 transition-transform group-hover:scale-110" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-black text-white tracking-tight uppercase leading-none mb-1">Axion Guide</h3>
                                    <div className="flex items-center gap-1.5">
                                        <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[3px] leading-none">Intelligence Active</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                                    onClick={() => setIsMaximized(!isMaximized)}
                                >
                                    {isMaximized ? <Minimize2 className="w-4.5 h-4.5" /> : <Maximize2 className="w-4.5 h-4.5" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="w-4.5 h-4.5" />
                                </Button>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide scroll-smooth relative"
                        >
                            {apiKey ? (
                                <>
                                    {messages.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-4 animate-in fade-in duration-1000">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
                                                <div className="w-24 h-24 rounded-[3rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 flex items-center justify-center relative z-10 shadow-2xl backdrop-blur-xl">
                                                    <MessageSquare className="w-10 h-10 text-primary" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <h4 className="text-2xl font-black text-white tracking-tighter">Your Platform Partner.</h4>
                                                <p className="text-xs text-zinc-500 font-bold max-w-[280px] mx-auto leading-relaxed uppercase tracking-widest">
                                                    Ask about blueprints, features, <br /> or platform capabilities.
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2 w-full max-w-[320px] pt-4">
                                                {[
                                                    "Recommend trending AI domains",
                                                    "How do I optimize system architecture?",
                                                    "What's new in the Axion Vault?"
                                                ].map((suggestion) => (
                                                    <button 
                                                        key={suggestion}
                                                        onClick={() => setInput(suggestion)}
                                                        className="text-[10px] font-black text-zinc-400 uppercase tracking-[2px] py-3.5 px-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 text-center shadow-lg"
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {messages.map((m, i) => (
                                        <div 
                                            key={i} 
                                            className={cn(
                                                "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-400 ease-out",
                                                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-2xl backdrop-blur-xl",
                                                m.role === 'assistant' ? 'bg-primary/10 text-primary' : 'bg-white/5 text-zinc-400'
                                            )}>
                                                {m.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                            </div>
                                            <div className={cn(
                                                "max-w-[85%] rounded-[1.75rem] px-6 py-4 text-[13px] font-semibold leading-relaxed shadow-2xl border transition-all",
                                                m.role === 'user' 
                                                    ? 'bg-primary text-primary-foreground border-primary rounded-tr-none' 
                                                    : 'bg-white/[0.03] text-zinc-200 border-white/5 rounded-tl-none'
                                            )}>
                                                {m.content}
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex gap-4 animate-pulse">
                                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-white/10 shadow-2xl">
                                                <Bot className="w-5 h-5" />
                                            </div>
                                            <div className="bg-white/[0.03] border border-white/10 rounded-[1.5rem] rounded-tl-none px-6 py-5 flex items-center gap-2 shadow-2xl backdrop-blur-xl">
                                                <div className="flex gap-1.5">
                                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                                        <div className="w-20 h-20 rounded-[2.5rem] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 relative z-10 shadow-2xl backdrop-blur-xl">
                                            <Key className="w-10 h-10" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-2xl font-black text-white tracking-tighter">Secure Link Required</h4>
                                        <p className="text-xs text-zinc-500 font-bold leading-relaxed uppercase tracking-widest max-w-[240px] mx-auto">Provide your API key to unlock the Assistant functions.</p>
                                    </div>
                                    <div className="w-full space-y-4">
                                        <div className="relative group">
                                            <input
                                                id="chatbot-key-input"
                                                type="password"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-700 shadow-inner group-hover:border-orange-500/30"
                                                placeholder="Enter your key..."
                                                value={apiKey}
                                                onChange={(e) => setApiKey(e.target.value)}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-orange-500 uppercase tracking-widest opacity-50">Local Only</div>
                                        </div>
                                        <Button 
                                            onClick={() => document.getElementById("chatbot-key-input")?.focus()}
                                            className="w-full bg-white text-black hover:bg-zinc-200 h-12 rounded-2xl font-black text-[10px] tracking-[4px] uppercase transition-all shadow-2xl"
                                        >
                                            ACTIVATE ASSISTANT
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Premium Input Area */}
                        <div className="p-6 border-t border-white/5 bg-gradient-to-t from-black/20 to-transparent shrink-0">
                            <div className="relative flex items-center group">
                                <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                <input
                                    className="w-full bg-[rgba(255,255,255,0.02)] border border-white/10 text-white rounded-[1.5rem] pl-6 pr-16 py-4.5 text-sm focus:outline-none focus:border-primary/50 transition-all font-semibold placeholder:text-zinc-600 shadow-2xl relative z-10 backdrop-blur-xl"
                                    placeholder={apiKey ? "Inquire anything..." : "Awaiting configuration..."}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    disabled={!apiKey || loading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || loading || !apiKey}
                                    className="absolute right-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-[1rem] shadow-[0_10px_25px_-5px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 disabled:opacity-0 transition-all z-20 flex items-center gap-2 group/btn"
                                >
                                    <Send className="w-4.5 h-4.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Bubble Button */}
            <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "w-20 h-20 rounded-[2.5rem] bg-primary shadow-[0_20px_50px_-15px_rgba(59,130,246,0.6)] flex items-center justify-center text-white pointer-events-auto transition-all duration-500 relative group overflow-hidden",
                    isOpen && "bg-[rgb(15,18,25)] rotate-90 shadow-none border border-white/10"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {isOpen ? (
                    <X className="w-10 h-10 group-hover:scale-90 transition-transform" />
                ) : (
                    <>
                        <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full scale-50 group-hover:scale-150 transition-all duration-1000" />
                        <MessageSquare className="w-9 h-9 relative z-10 transition-all duration-500 group-hover:rotate-12" />
                        
                        <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-white/5 rounded-full blur-xl animate-pulse" />
                    </>
                )}
            </motion.button>
            </div>
        </div>
    );
}
