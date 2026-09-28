import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Single Project",
    price: "₹499",
    period: "one-time",
    description: "Perfect for a single project submission",
    features: [
      "1 Complete Project Bundle",
      "PDF Report Generation",
      "PPT Presentation",
      "Source Code (ZIP)",
      "10 Viva Questions",
      "Email Support",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Semester Pack",
    price: "₹1,999",
    period: "per semester",
    description: "Best value for your entire semester",
    features: [
      "5 Complete Project Bundles",
      "All Report Formats",
      "Professional PPTs",
      "GitHub-Ready Code",
      "Unlimited Viva Practice",
      "AI Viva Assistant",
      "Priority Support",
      "Custom Templates",
    ],
    cta: "Get Semester Pack",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Unlimited",
    price: "₹2,999",
    period: "per year",
    description: "For power users and multiple projects",
    features: [
      "Unlimited Projects",
      "All Premium Features",
      "Advanced AI Viva Prep",
      "Voice-Based Practice",
      "Team Collaboration",
      "API Access",
      "Dedicated Support",
      "Early Feature Access",
    ],
    cta: "Go Unlimited",
    variant: "gradient" as const,
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[200px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Simple, Transparent{" "}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Choose the plan that fits your academic needs. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl transition-all duration-300 flex flex-col ${plan.popular
                  ? "ios-card scale-[1.02] border-primary/30 shadow-glow"
                  : "ios-card-solid hover-lift"
                }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold flex items-center gap-2 shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-3">
                  <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a href="/signup" className="w-full">
                <Button
                  variant={plan.variant}
                  size="lg"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </a>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <p className="text-center text-sm text-muted-foreground mt-12">
          💯 30-day money-back guarantee. No questions asked.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
