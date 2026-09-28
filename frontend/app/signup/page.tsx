"use client";

import { useState, useMemo } from "react";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Mail, Lock, Loader2, UserPlus, User, Phone,
    Eye, EyeOff, CheckCircle2, XCircle, ArrowRight
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const validateName = (v: string) =>
    v.trim().length >= 3 ? null : "Name must be at least 3 characters";

const validateEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Please enter a valid email address";

const validatePassword = (v: string) => {
    if (v.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(v)) return "Add at least one uppercase letter";
    if (!/[a-z]/.test(v)) return "Add at least one lowercase letter";
    if (!/[0-9]/.test(v)) return "Add at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(v)) return "Add at least one special character";
    return null;
};

const validateConfirm = (pw: string, cpw: string) =>
    pw === cpw ? null : "Passwords do not match";

function Field({ label, icon: Icon, error, touched, children }: {
    label: string; icon: any; error: string | null; touched: boolean; children: React.ReactNode;
}) {
    const state = !touched ? "idle" : error ? "error" : "ok";
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                <Icon className="w-3.5 h-3.5" />{label}
            </label>
            <div className="relative group">
                {children}
                {touched && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {state === "ok" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-destructive" />}
                    </div>
                )}
            </div>
            {touched && error && (
                <p className="text-xs text-destructive ml-1 animate-in fade-in slide-in-from-top-1 duration-200">{error}</p>
            )}
        </div>
    );
}

function PasswordStrength({ password }: { password: string }) {
    const checks = useMemo(() => [
        { label: "8+ characters", ok: password.length >= 8 },
        { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
        { label: "Lowercase letter", ok: /[a-z]/.test(password) },
        { label: "Number included", ok: /[0-9]/.test(password) },
        { label: "Special character", ok: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ], [password]);
    const passed = checks.filter(c => c.ok).length;
    const colors = ["", "bg-destructive", "bg-orange-400", "bg-yellow-400", "bg-blue-400", "bg-emerald-500"];
    if (!password) return null;
    return (
        <div className="mt-2 space-y-2 animate-in fade-in duration-300">
            <div className="flex gap-1.5">
                {checks.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < passed ? colors[passed] : "bg-muted"}`} />
                ))}
            </div>
            <div className="grid grid-cols-2 gap-1">
                {checks.map(c => (
                    <div key={c.label} className={`flex items-center gap-1.5 text-[11px] font-medium ${c.ok ? "text-emerald-500" : "text-muted-foreground/60"}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${c.ok ? "bg-emerald-500" : "bg-muted"}`} />{c.label}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function SignupPage() {
    const { signup } = useAuth();
    const router = useRouter();

    const [fields, setFields] = useState({ name: "", email: "", mobile: "", password: "", confirm: "" });
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showPw, setShowPw] = useState(false);
    const [showCpw, setShowCpw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setFields(f => ({ ...f, [key]: e.target.value }));
    const touch = (key: string) => () =>
        setTouched(t => ({ ...t, [key]: true }));

    const errors = {
        name: validateName(fields.name),
        email: validateEmail(fields.email),
        password: validatePassword(fields.password),
        confirm: validateConfirm(fields.password, fields.confirm),
    };
    const isValid = Object.values(errors).every(e => e === null);

    const inputClass = (key: string) => {
        const t = touched[key]; const err = errors[key as keyof typeof errors];
        return `w-full bg-secondary/50 border rounded-xl py-3 pl-10 pr-10 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${!t ? "border-border focus:ring-primary/30 focus:border-primary/50" : err ? "border-destructive/60 focus:ring-destructive/20" : "border-emerald-500/50 focus:ring-emerald-500/20"}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ name: true, email: true, password: true, confirm: true });
        if (!isValid) return;
        setError(""); 
        setLoading(true);
        try {
            await signup(fields.email, fields.password, fields.name, fields.mobile || undefined);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Registration failed.");
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background font-sans py-10">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg px-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="flex justify-center mb-8"><Logo className="scale-125" /></div>

                <div className="bg-card/70 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">Create Account</h1>
                        <p className="text-sm text-muted-foreground">Get started with Axion Pilot in seconds</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3 animate-in fade-in">
                            <XCircle className="w-4 h-4 flex-shrink-0" />{error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Field label="Full Name" icon={User} error={errors.name} touched={!!touched.name}>
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
                            <input
                                type="text"
                                value={fields.name}
                                onChange={set("name")}
                                onBlur={touch("name")}
                                placeholder="Alex Rivera"
                                className={inputClass("name")}
                                required
                            />
                        </Field>

                        <Field label="Email Address" icon={Mail} error={errors.email} touched={!!touched.email}>
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
                            <input
                                type="email"
                                value={fields.email}
                                onChange={set("email")}
                                onBlur={touch("email")}
                                placeholder="alex@example.com"
                                className={inputClass("email")}
                                required
                            />
                        </Field>

                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                                <Phone className="w-3.5 h-3.5" />Mobile Number <span className="text-[10px] text-muted-foreground/50 lowercase">(optional)</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
                                <input
                                    type="tel"
                                    value={fields.mobile}
                                    onChange={set("mobile")}
                                    placeholder="+1 555 000 0000"
                                    className="w-full bg-secondary/50 border border-border rounded-xl py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-sm transition-all"
                                />
                            </div>
                        </div>

                        <Field label="Password" icon={Lock} error={errors.password} touched={!!touched.password}>
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
                            <input
                                type={showPw ? "text" : "password"}
                                value={fields.password}
                                onChange={set("password")}
                                onBlur={touch("password")}
                                placeholder="••••••••••••"
                                className={inputClass("password")}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors p-1"
                            >
                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </Field>

                        {fields.password && <PasswordStrength password={fields.password} />}

                        <Field label="Confirm Password" icon={Lock} error={errors.confirm} touched={!!touched.confirm}>
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
                            <input
                                type={showCpw ? "text" : "password"}
                                value={fields.confirm}
                                onChange={set("confirm")}
                                onBlur={touch("confirm")}
                                placeholder="••••••••••••"
                                className={inputClass("confirm")}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCpw(!showCpw)}
                                className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors p-1"
                            >
                                {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </Field>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus className="w-4 h-4" /><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
