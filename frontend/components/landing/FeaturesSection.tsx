"use client";

import { motion } from "framer-motion";
import { FileText, MonitorPlay, Bot } from "lucide-react";

const features = [
  {
    title: "Complete Reports",
    description: "Instantly generate comprehensive, plagarism-free, technically accurate project reports tailored to your university guidelines.",
    icon: <FileText size={24} className="text-white relative z-10" />,
    gradient: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50 dark:bg-blue-900/10",
  },
  {
    title: "Pro Presentations",
    description: "Auto-create beautifully structured, visually stunning slides ready for your final demonstration and defense.",
    icon: <MonitorPlay size={24} className="text-white relative z-10" />,
    gradient: "from-purple-500 to-pink-600",
    bgLight: "bg-purple-50 dark:bg-purple-900/10",
  },
  {
    title: "Viva Assistant",
    description: "Mock defense sessions with our AI assistant to anticipate tough questions and articulate your answers confidently.",
    icon: <Bot size={24} className="text-white relative z-10" />,
    gradient: "from-emerald-400 to-teal-500",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6
    }
  },
};



const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 lg:py-32 bg-white dark:bg-[#0a0f1c] relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      
      <div className="absolute -left-40 top-40 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -right-40 bottom-40 w-96 h-96 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-sm font-semibold text-[#2563EB] dark:bg-blue-900/30 dark:border-blue-800 mb-6"
          >
            Powerful Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight mb-6"
          >
            Everything you need for an <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">
              A+ project submission.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-[#475569] dark:text-gray-400"
          >
            Stop wrestling with formatting and layout. ProjectPilot generates perfectly structured deliverables in seconds, so you can focus on the big ideas.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`relative group p-8 rounded-[24px] bg-white dark:bg-gray-900 border border-[#E2E8F0] dark:border-gray-800 ${feature.bgLight} overflow-hidden card-hover premium-shadow`}
            >
              {/* Hover gradient effect behind icon */}
              <div
                className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${feature.gradient} rounded-full blur-[60px] opacity-0 group-hover:opacity-30 transition-opacity duration-700`}
              />

              <div className="relative z-10 flex flex-col items-start gap-6">
                
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300`} />
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-base text-[#475569] dark:text-gray-400 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
