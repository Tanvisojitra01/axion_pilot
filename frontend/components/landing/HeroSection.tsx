"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, LayoutDashboard, FileText, Presentation, Settings, Bot } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const FeatureTags = ["Complete Reports", "Pro Presentations", "Viva Assistant"];

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#F8FAFC] dark:bg-black min-h-screen flex items-center">
      {/* Background Ornaments */}
      <div className="absolute inset-0 z-0 pointer-events-none hero-gradient-bg"></div>
      
      {/* Decorative Blob */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 bg-purple-50 text-sm font-medium text-[#7C3AED] dark:bg-purple-900/30 dark:border-purple-800 mb-6 shadow-sm"
            >
              <Sparkles size={16} className="text-[#7C3AED]" />
              <span>Project Generation Redefined</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0F172A] dark:text-white leading-[1.1] mb-6">
              Your College<br />
              Projects, <br />
              <span className="gradient-text whitespace-nowrap">Done Right.</span>
            </h1>

            <p className="text-lg md:text-xl text-[#475569] dark:text-gray-400 mb-10 max-w-lg leading-relaxed">
              Generate complete college projects instantly. From tailored reports and professional presentations to a dedicated Viva Assistant, all powered by advanced AI.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/signup">
                <button className="btn-gradient px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 group shadow-xl">
                  Start Generating for Free
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#demo">
                <button className="px-8 py-4 rounded-xl text-lg font-semibold text-[#0F172A] dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300">
                  View Demo
                </button>
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-gradient-to-br ${
                    i === 0 ? 'from-blue-100 to-blue-300' : 
                    i === 1 ? 'from-purple-100 to-purple-300' :
                    i === 2 ? 'from-green-100 to-green-300' :
                    'from-yellow-100 to-yellow-300'
                  } shadow-sm z-[${10-i}]`} />
                ))}
              </div>
              <div className="text-sm text-[#475569] font-medium">
                <span className="font-bold text-[#0F172A]">10,000+</span> students<br/>
                saved countless hours.
              </div>
            </div>
          </motion.div>

          {/* Right Product Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring", bounce: 0.4 }}
            className="relative lg:block"
            style={{ perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl rounded-[3rem]" />
            
            <div className="relative bg-white dark:bg-[#0F172A] border border-gray-200/50 dark:border-gray-700/50 rounded-2xl premium-shadow overflow-hidden transform-gpu transition-all duration-500 hover:shadow-2xl">
              
              {/* Fake Browser Headers */}
              <div className="bg-[#F8FAFC] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="ml-4 flex-1 h-6 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex items-center px-3">
                  <span className="text-xs text-gray-400 font-medium font-mono">app.projectpilot.ai/dashboard</span>
                </div>
              </div>

              {/* Fake Dashboard Body */}
              <div className="flex h-[400px]">
                {/* Sidebar */}
                <div className="w-48 border-r border-gray-100 dark:border-gray-800 p-4 hidden sm:block bg-[#F8FAFC] dark:bg-gray-900/50">
                  <div className="space-y-1">
                    {[
                      { icon: <LayoutDashboard size={14} />, label: "Dashboard", active: true },
                      { icon: <FileText size={14} />, label: "Reports" },
                      { icon: <Presentation size={14} />, label: "Presentations" },
                      { icon: <Bot size={14} />, label: "Viva Assistant" },
                      { icon: <Settings size={14} />, label: "Settings" }
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-default
                        ${item.active 
                          ? 'bg-[#EEF2FF] text-[#2563EB] dark:bg-blue-500/10 dark:text-blue-400' 
                          : 'text-[#475569] hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}
                      >
                        {item.icon} {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 bg-white dark:bg-[#0a0f1c]">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-bold text-[#0F172A] dark:text-white mb-1">Project Generator</h3>
                      <p className="text-xs text-[#475569] dark:text-gray-400">AI predicting context and structuring response...</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse-glow" />
                  </div>

                  <div className="space-y-4">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-2 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-full"
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#F8FAFC] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 mb-3 flex items-center justify-center">
                          <FileText size={16} />
                        </div>
                        <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                        <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                      <div className="bg-[#F8FAFC] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 mb-3 flex items-center justify-center">
                          <Presentation size={16} />
                        </div>
                        <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                        <div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                    </div>

                    <div className="bg-[#EEF2FF] border border-blue-100 dark:border-blue-900/50 dark:bg-blue-900/20 rounded-xl p-4 mt-6 flex items-start gap-4">
                      <Bot className="text-[#2563EB] shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-medium text-[#0F172A] mb-2">Generation Complete</p>
                        <p className="text-xs text-[#475569]">Your 45-page Machine Learning project report and 15-slide presentation are ready.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
