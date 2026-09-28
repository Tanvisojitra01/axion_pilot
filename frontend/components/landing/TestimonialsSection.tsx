import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "B.Tech CSE, VIT Vellore",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content: "ProjectPilot saved my final year! Generated my ML project report in 20 minutes. The viva prep was exactly what my examiner asked.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "M.Tech AI, NIT Warangal",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content: "The code quality surprised me. Got a working CNN implementation with proper documentation. Scored 9.5 CGPA in my project evaluation!",
    rating: 5,
  },
  {
    name: "Sneha Patel",
    role: "B.Tech IT, SRM Chennai",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    content: "The PPT designs are beautiful and professional. My guide was impressed by the system architecture diagrams. Worth every rupee!",
    rating: 5,
  },
  {
    name: "Arun Kumar",
    role: "B.E. Data Science, BITS",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    content: "Used the viva assistant for 2 weeks before my defense. Felt like I actually built the project myself. Cleared with distinction!",
    rating: 5,
  },
  {
    name: "Meera Iyer",
    role: "B.Tech CSE, Anna University",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    content: "From abstract to conclusion, everything was perfectly structured. The literature review was comprehensive and properly cited.",
    rating: 5,
  },
  {
    name: "Vikash Singh",
    role: "M.Sc CS, Delhi University",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    content: "Best investment I made during my masters. The semester pack helped me complete 3 projects. Highly recommend to all students!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-6">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-foreground">Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Students{" "}
            <span className="gradient-text-accent">Love</span> ProjectPilot
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of students who've transformed their academic journey with AI.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl ios-card-solid hover-lift transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-primary/30 mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10,000+", label: "Projects Generated" },
            { value: "50,000+", label: "Happy Students" },
            { value: "500+", label: "Colleges Covered" },
            { value: "4.9/5", label: "Average Rating" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-2xl ios-card">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
