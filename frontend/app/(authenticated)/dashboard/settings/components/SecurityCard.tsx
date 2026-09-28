"use client";

import { useState } from "react";
import { 
    Key, 
    ShieldCheck, 
    Eye, 
    EyeOff, 
    Loader2, 
    CheckCircle2, 
    AlertCircle,
    Fingerprint
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { PasswordStrength } from "./PasswordStrength";

export function SecurityCard() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await api.updatePassword(currentPassword, newPassword);
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword("");
            setNewPassword("");
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "Failed to update password" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl group transition-all duration-300 hover:translate-y-[-4px] overflow-hidden relative">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 to-cyan-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-in fade-in slide-in-from-left-full duration-1000" />
            
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative group/icon">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-20 group-hover/icon:opacity-40 transition duration-300" />
                            <div className="relative p-2.5 rounded-xl bg-background/50 border border-white/10 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                            </div>
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">Security Settings</CardTitle>
                            <CardDescription className="text-zinc-500 font-medium tracking-wide">
                                Protect your account with a secure password
                            </CardDescription>
                        </div>
                    </div>
                    {/* 2FA Status */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2">
                        <Fingerprint className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-400 tracking-widest">2FA ENABLED</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="max-w-md">
                    {message && (
                        <div className={`mb-6 p-4 rounded-2xl text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                            message.type === 'success'
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                                Current Password
                            </label>
                            <div className="relative group">
                                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="pl-10 h-12 bg-white/[0.02] border-white/10 hover:border-white/20 focus:border-blue-500/50 focus:ring-blue-500/20 focus:ring-4 transition-all duration-300"
                                    placeholder="Enter your current password"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                                New Password
                            </label>
                            <div className="relative group">
                                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pl-10 h-12 bg-white/[0.02] border-white/10 hover:border-white/20 focus:border-cyan-500/50 focus:ring-cyan-500/20 focus:ring-4 transition-all duration-300"
                                    placeholder="Create a strong password"
                                    required
                                />
                            </div>
                            <PasswordStrength password={newPassword} />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-[1.03] active:scale-95 hover:brightness-110 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 font-bold tracking-tight text-white disabled:opacity-50 disabled:scale-100"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
