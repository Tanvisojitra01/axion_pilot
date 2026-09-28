"use client";

import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
    password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
    const getStrength = (pwd: string) => {
        if (!pwd) return { score: 0, label: "", color: "bg-muted" };
        let score = 0;
        if (pwd.length > 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^a-zA-Z0-9]/.test(pwd)) score++;

        if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
        if (score === 2) return { score: 2, label: "Medium", color: "bg-yellow-500" };
        if (score >= 3) return { score: 3, label: "Strong", color: "bg-emerald-500" };
        return { score: 0, label: "", color: "bg-muted" };
    };

    const strength = getStrength(password);

    if (!password) return null;

    return (
        <div className="space-y-2 mt-2 px-1">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Password Strength: <span className={cn(
                        strength.label === "Weak" && "text-red-500",
                        strength.label === "Medium" && "text-yellow-500",
                        strength.label === "Strong" && "text-emerald-500"
                    )}>{strength.label}</span>
                </span>
            </div>
            <div className="flex gap-1 h-1">
                {[1, 2, 3].map((step) => (
                    <div
                        key={step}
                        className={cn(
                            "h-full flex-1 rounded-full transition-all duration-500",
                            step <= strength.score ? strength.color : "bg-muted"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
