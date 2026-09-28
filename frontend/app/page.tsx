"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Terminal,
  Cpu,
  DownloadCloud,
  Code2,
  Presentation,
  Database,
  Zap,
  Folder
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 transition-colors">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo variant="default" className="pl-0" />
          <div className="hidden md:flex items-center gap-12 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/70">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link 
              href="/signup" 
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all font-black uppercase text-[10px] shadow-sm hover:scale-[1.02]"
            >
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center w-full relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full"></div>
        </div>

        {/* Hero Section */}
        <section className="pt-24 pb-20 px-6 mt-12 w-full max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="mb-6 mt-4 flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
             <div className="flex items-center gap-2.5 border border-primary/20 bg-primary/10 rounded-full px-4 py-1.5 mb-8 text-[10px] font-black text-primary tracking-[0.2em] uppercase shadow-[0_0_25px_-5px_rgba(59,130,246,0.3)] backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                AxionX Generation Engine v2.0
             </div>
             <Image 
               src="/axionx-logo-icon.png" 
               alt="AxionX System Icon" 
               width={110}
               height={110}
               className="h-[80px] md:h-[110px] w-auto object-contain select-none image-render-auto opacity-100 drop-shadow-[0_0_20px_rgba(59,130,246,0.15)]"
             />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[1.0] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-both">
            Architect Systems. <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400 drop-shadow-sm pb-2 inline-block">At the Speed of Thought.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground opacity-80 max-w-[650px] font-medium leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
            Stop writing boilerplate. AxionX compiles full-stack production codebases, precise SRS documentation, and presentation decks in <span className="text-foreground font-bold border-b border-primary/50">under 60 seconds</span>.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500 fill-mode-both">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto min-w-[170px] bg-primary text-primary-foreground px-7 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] text-sm uppercase tracking-widest shadow-sm"
            >
              Start Building
            </Link>
            <a 
              href="#preview" 
              className="w-full sm:w-auto min-w-[170px] bg-card text-foreground px-7 py-3 border border-border/80 rounded-xl font-bold hover:bg-muted transition-all duration-300 hover:scale-[1.02] text-sm uppercase tracking-widest shadow-sm"
            >
              View Demo
            </a>
          </div>
        </section>

        {/* Minimal Feature Grid */}
        <section id="features" className="py-24 px-6 w-full max-w-[1200px] mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "AI Project Generation", desc: "Instantly create advanced architectures.", icon: Cpu, color: "from-blue-500 to-indigo-500" },
              { title: "Code + Documentation", desc: "Production code with full SRS reports.", icon: Code2, color: "from-indigo-500 to-purple-500" },
              { title: "PPT + Viva Ready", desc: "Presentation decks and interactive prep.", icon: Presentation, color: "from-purple-500 to-pink-500" },
              { title: "Fast Output System", desc: "Download the complete package in seconds.", icon: Zap, color: "from-cyan-500 to-blue-500" }
             ].map((feature, i) => (
              <div 
                key={i} 
                className="group relative bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8 transition-all duration-300 ease-out hover:-translate-y-[6px] hover:scale-[1.02] hover:border-blue-500/40 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] hover:bg-white/[0.05] cursor-pointer overflow-hidden"
              >
                {/* Top Accent Line */}
                <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${feature.color} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Icon Container with Glow */}
                <div className="relative mb-6 inline-flex">
                   <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-md opacity-20 group-hover:opacity-60 group-hover:animate-pulse transition-all duration-500"></div>
                   <div className="w-12 h-12 bg-black/50 border border-white/10 rounded-full flex items-center justify-center relative z-10 shadow-inner group-hover:border-white/20 transition-colors duration-300">
                     <feature.icon className="w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300" />
                   </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-6 w-full max-w-[1200px] mx-auto">
           <div className="grid md:grid-cols-3 gap-8">
             {[
               { step: "01", title: "Enter Topic", desc: "Specify your project domain, technology stack, and functional requirements.", icon: Terminal, color: "from-blue-500 to-blue-300", glow: "hover:border-blue-500/50 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]" },
               { step: "02", title: "AI Builds Project", desc: "AxionX compiles codebase, database schemas, and all technical documentation.", icon: Cpu, color: "from-purple-500 to-purple-300", glow: "hover:border-purple-500/50 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]" },
               { step: "03", title: "Download & Present", desc: "Retrieve your fully structured output and prepare for final execution.", icon: DownloadCloud, color: "from-cyan-500 to-cyan-300", glow: "hover:border-cyan-500/50 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)]" }
             ].map((item, i) => (
               <div 
                 key={i} 
                 className={`relative flex flex-col items-start bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-10 rounded-2xl transition-all duration-300 ease-out hover:-translate-y-[6px] hover:scale-[1.02] cursor-pointer overflow-hidden group ${item.glow}`}
               >
                 {/* Top Accent Line */}
                 <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${item.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
                 
                 {/* Watermark Number */}
                 <div className="absolute -top-6 -right-2 text-9xl font-black text-white/[0.02] group-hover:text-white/[0.04] transition-colors duration-300 pointer-events-none select-none tracking-tighter">
                   {item.step}
                 </div>

                 {/* Icon Container */}
                 <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-lg opacity-30 group-hover:opacity-70 group-hover:animate-pulse transition-all duration-500"></div>
                    <div className="w-14 h-14 bg-black/60 border border-white/10 rounded-full flex items-center justify-center relative z-10 shadow-inner group-hover:border-white/20 transition-colors duration-300">
                      <item.icon className="w-6 h-6 text-white/90 group-hover:text-white transition-colors duration-300" />
                    </div>
                 </div>

                 <div className="relative z-10 mt-auto">
                    <div className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 group-hover:text-white/50 transition-colors">Step {item.step}</div>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-white transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-[280px]">{item.desc}</p>
                 </div>
               </div>
             ))}
           </div>
        </section>

        {/* Product Preview */}
        <section id="preview" className="py-24 px-6 w-full max-w-5xl mx-auto relative z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="bg-card/60 backdrop-blur-xl border border-border/60 rounded-[2rem] overflow-hidden shadow-[0_0_60px_-15px_rgba(0,0,0,0.5)] flex flex-col w-full min-h-[500px] transition-all duration-700 hover:border-primary/20 hover:shadow-primary/5 relative z-10">
             {/* Mock Header */}
             <div className="h-14 border-b border-border/60 flex items-center justify-between px-6 bg-background/40">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-border" />
                   <div className="w-3 h-3 rounded-full bg-border" />
                   <div className="w-3 h-3 rounded-full bg-border" />
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">AxionX Console</div>
                <div className="w-10"></div>
             </div>
             {/* Mock Body */}
             <div className="flex bg-background flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 border-r border-border p-4 hidden md:flex flex-col gap-2 bg-card/20">
                   <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 pl-2 mt-2">Workspaces</div>
                   <div className="bg-muted px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-3 border border-border/50">
                      <Terminal className="w-4 h-4 text-primary" /> System Core
                   </div>
                   <div className="text-muted-foreground/60 px-4 py-2 text-sm font-medium flex items-center gap-3">
                      <Folder className="w-4 h-4" /> Operations
                   </div>
                </div>
                {/* Content */}
                <div className="flex-1 flex flex-col p-8 md:p-12">
                   <div className="mb-8">
                      <div className="text-2xl font-black text-foreground mb-2">Initialize Build</div>
                      <div className="text-sm text-muted-foreground font-medium">Define parameters for system generation.</div>
                   </div>
                   <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-2 pl-4 max-w-2xl mb-12 shadow-sm">
                      <span className="text-primary font-mono font-bold text-sm">~</span>
                      <input 
                        type="text" 
                        readOnly 
                        value="E-Commerce Architecture & Docs"
                        className="bg-transparent border-none outline-none text-sm text-foreground flex-1 font-mono font-medium"
                      />
                      <button className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg hover:scale-[1.05] transition-transform shadow-lg shadow-primary/20 animate-pulse">Execute</button>
                   </div>
                   
                   {/* Output Cards */}
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { title: "Source Code.zip", desc: "React, Node, PostgreSQL", icon: Code2, color: "from-blue-500 to-indigo-500", glow: "hover:border-blue-500/40 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)]" },
                        { title: "Architecture.pdf", desc: "Requirement Specs & Diagrams", icon: Database, color: "from-emerald-500 to-teal-500", glow: "hover:border-emerald-500/40 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)]" },
                        { title: "Presentation.pptx", desc: "12 Slides Prepared", icon: Presentation, color: "from-purple-500 to-pink-500", glow: "hover:border-purple-500/40 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.2)]" }
                      ].map((card, i) => (
                        <div key={i} className={`group relative bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-xl p-6 transition-all duration-300 ease-out hover:-translate-y-[4px] hover:scale-[1.02] hover:bg-white/[0.05] cursor-pointer overflow-hidden ${card.glow}`}>
                           {/* Top Accent Line */}
                           <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${card.color} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
                           
                           {/* Icon Container with Glow */}
                           <div className="relative mb-5 inline-flex">
                              <div className={`absolute inset-0 bg-gradient-to-tr ${card.color} rounded-full blur-md opacity-20 group-hover:opacity-50 group-hover:animate-pulse transition-all duration-500`}></div>
                              <div className="w-10 h-10 bg-black/60 border border-white/10 rounded-full flex items-center justify-center relative z-10 shadow-inner group-hover:border-white/20 transition-colors duration-300">
                                <card.icon className="w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300" />
                              </div>
                           </div>
                           
                           <div className="relative z-10">
                              <div className="text-sm font-bold text-white mb-1 tracking-tight">{card.title}</div>
                              <div className="text-xs text-gray-400 font-medium leading-relaxed">{card.desc}</div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-6 w-full max-w-4xl mx-auto text-sm">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Personal", price: "Free", desc: "For exploratory use." },
              { name: "Professional", price: "$12", period: "/mo", desc: "Advanced system access.", selected: true },
              { name: "Enterprise", price: "$49", period: "/mo", desc: "Infinite scale production." }
            ].map((plan, i) => (
              <div key={i} className={plan.selected ? "bg-card border-primary/50 border-[1px] p-8 rounded-3xl flex flex-col shadow-2xl shadow-primary/20 relative scale-100 md:scale-105 z-10" : "bg-card/30 border-border/50 border p-8 rounded-3xl flex flex-col transition-all hover:bg-card/60 hover:-translate-y-1"}>
                {plan.selected && (
                   <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-md">Recommended</span>
                )}
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{plan.name}</h4>
                <div className="text-3xl font-black text-foreground mb-2">{plan.price}</div>
                <p className="text-xs font-medium text-muted-foreground mb-8 leading-relaxed">{plan.desc}</p>
                <Link 
                  href="/signup" 
                  className={plan.selected ? "mt-auto bg-primary text-primary-foreground py-3.5 rounded-xl text-center text-[10px] font-black uppercase tracking-widest shadow-md shadow-primary/10 transition-all hover:scale-[1.02]" : "mt-auto bg-muted/30 border border-border/50 text-foreground py-3.5 rounded-xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all"}
                >
                  Sign Up
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 flex flex-col items-center text-center px-6">
           <h2 className="text-3xl font-black text-foreground mb-8 tracking-tight">Ready to Initialize System?</h2>
           <Link 
              href="/signup" 
              className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all text-sm uppercase tracking-[0.1em] shadow-lg shadow-primary/10 hover:scale-[1.02]"
            >
              Start Building Now
            </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <Logo variant="minimal" className="pl-0 opacity-40 hover:opacity-100 transition-opacity" />
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
             <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
             <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
             <Link href="#" className="hover:text-foreground transition-colors">Security</Link>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
             &copy; 2026 AxionX Systems
          </div>
        </div>
      </footer>
    </div>
  );
}
