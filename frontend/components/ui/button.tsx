import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[13px] font-semibold transition-all duration-200 ease-[0.15,0,0.15,1] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 tap-bounce active:scale-[0.98] gpu-accelerated",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-zinc-200 shadow-soft",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-soft",
        outline: "border border-white/10 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.08] text-white",
        secondary: "bg-zinc-900 text-white hover:bg-zinc-800 border border-white/5",
        ghost: "hover:bg-white/[0.05] text-zinc-400 hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-primary text-white shadow-soft hover:brightness-110",
        hero: "bg-white text-black font-bold shadow-apple hover:scale-[1.02]",
        "hero-outline": "border border-white/20 bg-white/5 backdrop-blur-2xl text-white hover:bg-white/10",
        accent: "bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30",
        glass: "apple-glass text-white hover:bg-white/[0.08]",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3 text-[11px] rounded-lg",
        lg: "h-12 px-8 text-sm",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
