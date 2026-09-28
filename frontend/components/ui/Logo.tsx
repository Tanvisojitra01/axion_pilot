import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    variant?: "default" | "minimal";
    href?: string;
    onClick?: (e: React.MouseEvent) => void;
}

export function Logo({ className, variant = "default", href = "/", onClick }: LogoProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center group select-none transition-opacity duration-300 hover:opacity-[0.95]", 
                variant === "minimal" ? "pl-4" : "pl-6",
                className
            )}
        >
            <Image 
                src="/axionx-logo-icon.png" 
                alt="AxionX System Icon" 
                width={50}
                height={50}
                className={cn(
                    "transition-all duration-300 object-contain w-auto", 
                    variant === "minimal" 
                        ? "h-[32px] md:h-[40px] -ml-2" 
                        : "h-[40px] md:h-[50px] -ml-2"
                )}
            />
            <span className={cn(
                "font-black tracking-[0.1em] uppercase text-foreground transition-all duration-300 group-hover:tracking-[0.15em]",
                variant === "minimal" ? "text-sm -ml-1" : "text-lg -ml-2"
            )}>
                AxionX
            </span>
        </Link>
    );
}
