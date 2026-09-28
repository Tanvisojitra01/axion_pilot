import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Cpu, Download, MessageCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Enter Your Topic",
    description: "Tell us your project domain, semester, and any specific requirements. Our AI understands academic contexts perfectly.",
    gradient: "from-primary to-blue-400",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Generates Everything",
    description: "In minutes, get a complete project bundle — report, code, PPT, and architecture diagrams tailored to your needs.",
    gradient: "from-accent to-pink-400",
  },
  {
    number: "03",
    icon: Download,
    title: "Download & Customize",
    description: "Export your project assets instantly. Make any tweaks you need — it's all yours to submit.",
    gradient: "from-green-400 to-emerald-400",
  },
  {
    number: "04",
    icon: MessageCircle,
    title: "Prepare for Viva",
    description: "Practice with our AI interviewer. Get department-specific questions and boost your confidence.",
    gradient: "from-orange-400 to-amber-400",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-6">
            <Cpu className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            From Idea to Viva in{" "}
            <span className="gradient-text-accent">4 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            No more late nights. No more stress. Let AI do the heavy lifting while you focus on learning.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative group">
                  {/* Card */}
                  <div className="relative p-8 rounded-2xl ios-card-solid hover-lift transition-all duration-300 text-center h-full">
                    {/* Step Number Badge */}
                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r ${step.gradient} text-white text-sm font-bold shadow-lg`}>
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow (hidden on last item and mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 w-6 h-6 items-center justify-center -translate-y-1/2 z-10">
                      <ArrowRight className="w-5 h-5 text-white/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button variant="hero" size="xl">
            Start Your Project Now
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
