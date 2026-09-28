"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, User } from "../services/api";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginStep1: (email: string, password: string) => Promise<any>;
    loginStep2: (email: string, otp: string) => Promise<void>;
    signup: (email: string, password: string, fullName: string, mobile?: string) => Promise<void>;
    verifySignup: (email: string, emailOtp: string, mobileOtp?: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<{ message?: string }>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refreshUser = async () => {
        try {
            const userData = await api.getMe();
            setUser(userData);
        } catch (e) {
            logout();
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                await refreshUser();
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    // Direct Login (No OTP or email dependency)
    const login = async (email: string, password: string) => {
        const data = await api.login(email, password);
        if (data?.access_token) {
            localStorage.setItem("token", data.access_token);
            await refreshUser();
        }
    };

    const loginStep1 = async (email: string, password: string) => {
        return login(email, password);
    };

    const loginStep2 = async (email: string, otp: string) => {
        await refreshUser();
    };

    // Direct Signup (No OTP or email dependency)
    const signup = async (email: string, password: string, fullName: string, mobile?: string) => {
        const data = await api.signup(email, password, fullName, mobile);
        if (data?.access_token) {
            localStorage.setItem("token", data.access_token);
            await refreshUser();
        }
    };

    const forgotPassword = async (email: string) => {
        return await api.forgotPassword(email);
    };

    const verifySignup = async (email: string, emailOtp: string, mobileOtp?: string) => {
        await refreshUser();
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login,
            loginStep1, 
            loginStep2, 
            signup, 
            verifySignup,
            forgotPassword,
            logout,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
