"use client";

import { useState } from "react";
import { api } from "../../services/api";
import Link from "next/link";
import { Mail, Lock, ArrowLeft, Loader2, ShieldCheck, KeyRound, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    
    // UI Stages: 1 = Email, 2 = OTP & New Password, 3 = Success
    const [stage, setStage] = useState(1);
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api.forgotPassword(email);
            if (res.message) setSuccessMessage(res.message);
            setStage(2);
        } catch (err: any) {
            setError(err.message || "Failed to send reset code.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await api.resetPassword(email, otp, newPassword);
            setStage(3);
        } catch (err: any) {
            setError(err.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background font-sans selection:bg-primary/20">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

            <div className="relative z-10 w-full max-w-md px-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="flex justify-center mb-8">
                    <Logo className="scale-125" />
                </div>

                <div className="glass p-8 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl bg-card/60">
                    <div className="mb-8">
                         <Link href="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mb-6">
                            <ArrowLeft className="w-3 h-3" /> Back to Sign In
                         </Link>
                         <h2 className="text-2xl font-bold tracking-tight">
                            {stage === 1 ? "Forgot Password" : stage === 2 ? "Reset Password" : "Password Reset Successfully"}
                         </h2>
                         <p className="text-muted-foreground mt-2 text-sm">
                            {stage === 1 ? "Enter your email to receive a recovery code" : 
                             stage === 2 ? `Check ${email} for your recovery code` :
                             "You can now sign in with your new password."}
                         </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2 animate-in fade-in">
                            <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                            {error}
                        </div>
                    )}

                    {stage === 1 && (
                        <form onSubmit={handleRequest} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-secondary/50 border border-border rounded-xl py-3 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 disabled:opacity-50 mt-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                                    <span className="font-semibold">Send Reset Code</span>
                                    <ShieldCheck className="w-5 h-5" />
                                </>}
                            </button>
                        </form>
                    )}

                    {stage === 2 && (
                        <div className="space-y-5 animate-in slide-in-from-right-4 duration-500">
                            {successMessage && successMessage.includes("[DEV]") && (
                                <div className="p-5 rounded-xl bg-amber-500/15 border-2 border-amber-500/40 text-center">
                                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">⚡ Dev Mode — Your Reset Code</p>
                                    <p className="text-4xl font-mono font-black tracking-[0.4em] text-amber-300">
                                        {successMessage.match(/\d{6}/)?.[0] || ""}
                                    </p>
                                    <p className="text-xs text-amber-400/70 mt-2">Enter this code below to reset your password</p>
                                </div>
                            )}
                            {successMessage && !successMessage.includes("[DEV]") && (
                                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm flex items-start gap-3">
                                    <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <p>{successMessage}</p>
                                </div>
                            )}

                            <form onSubmit={handleReset} className="space-y-5">
                             <div className="space-y-2 text-center mb-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recovery Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-secondary/70 border border-primary/30 rounded-xl py-3 text-center text-xl font-mono tracking-[0.5em] focus:outline-none transition-all"
                                    placeholder="000000"
                                    maxLength={6}
                                    name="otp"
                                    autoComplete="one-time-code"
                                    required
                                    autoFocus
                                />
                                <p className="text-[10px] text-muted-foreground mt-2">Code expires in 5 minutes.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">New Password</label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-secondary/70 border border-border rounded-xl py-3 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground px-1">Must be 8+ characters, including uppercase, digit, and symbol.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground shadow-lg"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                                    <span className="font-semibold">Reset & Secure Account</span>
                                    <KeyRound className="w-5 h-5" />
                                </>}
                            </button>
                        </form>
                    </div>
                    )}

                    {stage === 3 && (
                        <div className="text-center py-6 animate-in zoom-in-95 duration-500">
                             <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                             </div>
                             <Link 
                                href="/login" 
                                className="inline-block w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg transition-all"
                             >
                                Go to Sign In
                             </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
