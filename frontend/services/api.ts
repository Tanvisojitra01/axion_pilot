const getApiBaseUrl = () => {
    const raw = process.env.NEXT_PUBLIC_API_URL;
    if (raw) {
        const clean = raw.replace(/\/$/, "");
        return clean.endsWith("/api") ? clean : `${clean}/api`;
    }
    // Default to relative /api so all requests automatically route through the single unified port
    return "/api";
};

const API_BASE_URL = getApiBaseUrl();

export interface User {
    id: number;
    email: string;
    is_active: boolean;
    plan: string;
    created_at: string;
    is_admin: boolean;
    name?: string;
    mobile?: string;
    avatar_url?: string;
}

export interface ProjectRequest {
    api_key?: string;
    ai_provider?: string;
    domain: string;
    topic?: string;
    description?: string;
    difficulty: string;
    tech_stack: string;
    year: string;
}

// Helper to get token
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
})

export const api = {
    // ── Auth ────────────────────────────────────────────────────────────────

    // Direct Login with email + password → immediately returns JWT
    login: async (email: string, password: string) => {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData,
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Login failed');
        }
        return res.json(); // { access_token, token_type }
    },

    // Step 1 backwards-compatibility alias
    loginStep1: async (email: string, password: string) => {
        return api.login(email, password);
    },

    // Step 2 backwards-compatibility fallback
    loginStep2: async (email: string, otp: string) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) return { access_token: token, token_type: "bearer" };
        const res = await fetch(`${API_BASE_URL}/auth/login/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Authentication failed');
        }
        return res.json();
    },

    forgotPassword: async (email: string) => {
        const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Request failed');
        }
        return res.json();
    },

    resetPassword: async (email: string, otp: string, new_password: string) => {
        const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, new_password }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Password reset failed');
        }
        return res.json();
    },

    // Direct Signup → immediately returns JWT
    signup: async (email: string, password: string, full_name?: string, mobile?: string) => {
        const res = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, full_name, mobile }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Signup failed');
        }
        return res.json(); // { access_token, token_type }
    },

    verifySignup: async (email: string, emailOtp: string, mobileOtp: string) => {
        const res = await fetch(`${API_BASE_URL}/auth/verify-signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, email_otp: emailOtp, mobile_otp: mobileOtp }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Verification failed');
        }
        return res.json();
    },

    getMe: async () => {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Not authorized');
        return res.json();
    },

    updatePassword: async (currentPassword: string, newPassword: string) => {
        const res = await fetch(`${API_BASE_URL}/users/me/password`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || 'Password update failed');
        }
        return res.json();
    },

    updateProfile: async (name: string) => {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ name }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || 'Profile update failed');
        }
        return res.json();
    },

    logoutAllDevices: async () => {
        const res = await fetch(`${API_BASE_URL}/users/me/logout-all`, {
            method: 'POST',
            headers: authHeaders(),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || 'Logout from all devices failed');
        }
        return res.json();
    },

    deleteAccount: async () => {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || 'Account deletion failed');
        }
        return res.json();
    },

    // ── Project ─────────────────────────────────────────────────────────────
    generateProject: async (data: ProjectRequest) => {
        const response = await fetch(`${API_BASE_URL}/projects/generate`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Generation failed");
        }
        return response.json();
    },

    getUserStats: async () => {
        const response = await fetch(`${API_BASE_URL}/projects/stats`, {
            headers: authHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch user stats");
        return response.json();
    },

    getProjectById: async (projectId: number) => {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            headers: authHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch project details");
        return response.json();
    },

    listProjects: async () => {
        const response = await fetch(`${API_BASE_URL}/projects/list`, {
            headers: authHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch projects");
        return response.json();
    },

    deleteProject: async (projectId: number) => {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            method: "DELETE",
            headers: authHeaders(),
        });
        if (!response.ok) throw new Error("Failed to delete project");
        return response.json();
    },

    updateProject: async (projectId: number, updates: any) => {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error("Failed to update project");
        return response.json();
    },

    regenerateProject: async (projectId: number, apiKey: string) => {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}/regenerate?api_key=${apiKey}`, {
            method: "POST",
            headers: authHeaders(),
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.detail || "Regeneration failed");
        }
        return response.json();
    },

    // ── Viva ────────────────────────────────────────────────────────────────
    chatViva: async (apiKey: string, history: any[], projectData: any, aiProvider?: string) => {
        const response = await fetch(`${API_BASE_URL}/viva/ask`, {
            method: "POST",
            headers: authHeaders(), // Authentication REQUIRED now
            body: JSON.stringify({
                api_key: apiKey,
                ai_provider: aiProvider,
                messages: history,
                project_data: projectData
            }),
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.detail || "Viva chat failed");
        }
        return response.json();
    },

    // ── Downloads ───────────────────────────────────────────────────────────
    downloadReport: async (projectId: number | string) => {
        const id = typeof projectId === 'object' ? (projectId as any).id : projectId;
        const response = await fetch(`${API_BASE_URL}/projects/download/report/${id}`, {
            headers: authHeaders(),
        });
        if (!response.ok) throw new Error("Report download failed");
        return response.blob();
    },

    downloadPPT: async (projectId: number | string) => {
        const id = typeof projectId === 'object' ? (projectId as any).id : projectId;
        const response = await fetch(`${API_BASE_URL}/projects/download/ppt/${id}`, {
            headers: authHeaders(),
        });
        if (!response.ok) throw new Error("PPT download failed");
        return response.blob();
    },

    downloadCode: async (projectId: number | string) => {
        const id = typeof projectId === 'object' ? (projectId as any).id : projectId;
        const response = await fetch(`${API_BASE_URL}/projects/download/code/${id}`, {
            headers: authHeaders(),
        });
        if (!response.ok) throw new Error("Failed to download code");
        return response.blob();
    },

    downloadFullProject: async (projectId: number | string) => {
        const id = typeof projectId === 'object' ? (projectId as any).id : projectId;
        const response = await fetch(`${API_BASE_URL}/projects/download/full/${id}`, {
            headers: authHeaders(),
        });
        if (!response.ok) throw new Error("Failed to download full project");
        return response.blob();
    },

    // ── Admin ───────────────────────────────────────────────────────────────
    getAdminStats: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/stats`, { headers: authHeaders() });
        if (!res.ok) throw new Error("Admin stats failed");
        return res.json();
    },
    getAdminActivity: async (page = 1, size = 50) => {
        const res = await fetch(`${API_BASE_URL}/admin/activity?page=${page}&size=${size}`, { headers: authHeaders() });
        if (!res.ok) throw new Error("Admin activity failed");
        return res.json();
    },
    getAdminChartProjectsPerDay: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/charts/projects-per-day`, { headers: authHeaders() });
        if (!res.ok) throw new Error("Chart data failed");
        return res.json();
    },
    getAdminChartProjectsPerDomain: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/charts/projects-per-domain`, { headers: authHeaders() });
        if (!res.ok) throw new Error("Domain chart failed");
        return res.json();
    },
    getAdminChartProjectsPerDifficulty: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/charts/projects-per-difficulty`, { headers: authHeaders() });
        if (!res.ok) throw new Error("Difficulty chart failed");
        return res.json();
    },
    adminListUsers: async (filters?: any) => {
        let url = `${API_BASE_URL}/admin/users`;
        if (filters) {
            const params = new URLSearchParams(filters);
            url += `?${params.toString()}`;
        }
        const res = await fetch(url, { headers: authHeaders() });
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
    },
    adminUpdateUserStatus: async (userId: number, status: string) => {
        const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
            method: "POST", headers: authHeaders(), body: JSON.stringify({ status }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Update status failed");
        }
        return res.json();
    },
    adminUpdateUserRole: async (userId: number, role: string) => {
        const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
            method: "PUT", headers: authHeaders(), body: JSON.stringify({ role }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Update role failed");
        }
        return res.json();
    },
    adminDeleteUser: async (userId: number) => {
        const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, { method: "DELETE", headers: authHeaders() });
        if (!res.ok) throw new Error("Delete user failed");
        return res.json();
    },
    adminListAllProjects: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/projects`, { headers: authHeaders() });
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
    },
    adminUpdateProject: async (projectId: number, data: any) => {
        const res = await fetch(`${API_BASE_URL}/admin/projects/${projectId}`, {
            method: "PATCH", headers: authHeaders(), body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Update project failed");
        }
        return res.json();
    },
    adminDeleteProject: async (projectId: number) => {
        const res = await fetch(`${API_BASE_URL}/admin/projects/${projectId}`, {
            method: "DELETE", headers: authHeaders()
        });
        if (!res.ok) throw new Error("Delete project failed");
        return res.json();
    },
    adminListContents: async (type: string) => {
        const res = await fetch(`${API_BASE_URL}/admin/contents?content_type=${type}`, { headers: authHeaders() });
        if (!res.ok) throw new Error("Failed to fetch contents");
        return res.json();
    },
    adminGetConfig: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/config`, { headers: authHeaders() });
        if (!res.ok) throw new Error("Failed to fetch config");
        return res.json();
    },
    adminSaveConfig: async (data: any) => {
        const res = await fetch(`${API_BASE_URL}/admin/config`, {
            method: "POST", headers: authHeaders(), body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Save config failed");
        }
        return res.json();
    },
    adminListTemplates: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/templates`, { headers: authHeaders() });
        if (!res.ok) throw new Error("Templates fetch failed");
        return res.json();
    },
    adminCreateTemplate: async (data: any) => {
        const res = await fetch(`${API_BASE_URL}/admin/templates`, {
            method: "POST", headers: authHeaders(), body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Create template failed");
        return res.json();
    },
    adminDeleteTemplate: async (templateId: number) => {
        const res = await fetch(`${API_BASE_URL}/admin/templates/${templateId}`, { method: "DELETE", headers: authHeaders() });
        if (!res.ok) throw new Error("Delete template failed");
        return res.json();
    },

    getPublicTemplates: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects/templates`, {
                headers: authHeaders(),
            });
            if (!response.ok) return [];
            return response.json();
        } catch {
            return [];
        }
    },
};
