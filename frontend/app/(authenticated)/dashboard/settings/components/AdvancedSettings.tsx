"use client";

import { useState } from "react";
import { 
    ShieldAlert, 
    LogOut, 
    Trash2, 
    AlertCircle,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/services/api";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export function AdvancedSettings() {
    const { logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    const handleLogoutAll = async () => {
        setLoading('logout');
        try {
            await api.logoutAllDevices();
            // Redirect to login or just logout locally
            logout();
            router.push('/login');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(null);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading('delete');
        try {
            await api.deleteAccount();
            logout();
            router.push('/signup');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(null);
        }
    };

    return (
        <Card className="border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.03)] backdrop-blur-xl group transition-all duration-300 hover:translate-y-[-4px] overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                    <div className="relative group/icon">
                        <div className="absolute -inset-1 bg-red-500 rounded-xl blur opacity-20 group-hover/icon:opacity-40 transition duration-300" />
                        <div className="relative p-2.5 rounded-xl bg-background/50 border border-red-500/20 flex items-center justify-center">
                            <ShieldAlert className="w-5 h-5 text-red-500" />
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold tracking-tight text-red-500">Danger Zone</CardTitle>
                        <CardDescription className="text-zinc-500 font-medium tracking-wide">
                            Irreversible actions for your account
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Logout All */}
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between h-full">
                        <div className="mb-4">
                            <h4 className="text-sm font-bold text-zinc-200 mb-1">Logout from all devices</h4>
                            <p className="text-[11px] text-zinc-500">Security measure if you suspect suspicious activity.</p>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleLogoutAll}
                            disabled={loading !== null}
                            className="w-full border-white/10 hover:bg-white/5 hover:text-white transition-all duration-300 text-[11px] font-bold tracking-widest gap-2"
                        >
                            {loading === 'logout' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                            REVOKE ALL SESSIONS
                        </Button>
                    </div>

                    {/* Delete Account */}
                    <div className="p-5 rounded-2xl bg-red-500/[0.02] border border-red-500/10 hover:bg-red-500/[0.04] transition-all duration-300 flex flex-col justify-between h-full">
                        <div className="mb-4">
                            <h4 className="text-sm font-bold text-red-400 mb-1">Delete Account</h4>
                            <p className="text-[11px] text-zinc-500">This action is permanent and cannot be undone.</p>
                        </div>
                        
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-300 text-[11px] font-bold tracking-widest gap-2"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    DELETE PERMANENTLY
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-zinc-900 border-zinc-800 backdrop-blur-xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-zinc-400">
                                        This will permanently delete your account and remove all your data from our servers. 
                                        All your generated projects will be lost forever.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700">Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={handleDeleteAccount}
                                        className="bg-red-600 text-white hover:bg-red-700 font-bold"
                                    >
                                        Delete Forever
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
