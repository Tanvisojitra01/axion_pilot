import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does ProjectPilot AI generate projects?",
    answer: "Our AI uses advanced language models trained specifically on academic content. You provide your topic, domain, and requirements, and our system generates a complete project bundle including reports, code, presentations, and viva preparation materials — all tailored to academic standards.",
  },
  {
    question: "Is the generated content unique and plagiarism-free?",
    answer: "Yes! Each project is uniquely generated based on your specific inputs. Our AI creates original content every time, ensuring your submission is unique. We recommend running a final plagiarism check as a best practice.",
  },
  {
    question: "Which departments and project types are supported?",
    answer: "We currently support Computer Science, IT, AI/ML, Data Science, and Electronics projects. This includes web applications, machine learning models, data analysis, IoT systems, and more. We're constantly adding new domains based on student requests.",
  },
  {
    question: "How does the Viva Assistant work?",
    answer: "Our AI Viva Assistant simulates a real viva examination. It generates questions based on your project content and department, provides difficulty-based questioning, follow-up questions, and detailed explanations to help you understand your project deeply.",
  },
  {
    question: "Can I customize the generated content?",
    answer: "Absolutely! All generated content is fully editable. You receive Word documents, PowerPoint files, and source code that you can modify to match your exact requirements. We encourage you to personalize and add your own insights.",
  },
  {
    question: "What formats do I get for downloads?",
    answer: "Projects include PDF/DOCX reports (IEEE/university format), PPTX presentations, source code in a ZIP file (ready for GitHub), and a comprehensive viva Q&A document. Everything you need for submission!",
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "Yes! We offer a 30-day money-back guarantee. If you're not satisfied with the quality of generated projects, we'll refund your payment — no questions asked.",
  },
  {
    question: "How quickly can I get my project?",
    answer: "Most projects are generated within 5-10 minutes! Complex projects with extensive code requirements may take up to 15 minutes. You'll receive real-time updates as each component is generated.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Got{" "}
            <span className="gradient-text">Questions?</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to know about ProjectPilot AI. Can't find what you're looking for? Reach out to our support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-2xl border border-white/10 bg-card/50 backdrop-blur-sm px-6 data-[state=open]:border-primary/30 data-[state=open]:bg-card transition-all duration-200"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary py-5 text-base font-medium [&[data-state=open]]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
