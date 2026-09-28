"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
    label: string;
    onClick: () => Promise<Blob>;
    filename: string;
    className?: string;
}

export default function DownloadButton({ label, onClick, filename, className }: DownloadButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        try {
            setLoading(true);
            const blob = await onClick();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e) {
            alert("Download failed: " + e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={handleDownload}
            disabled={loading}
            variant="outline"
            className={cn("w-full flex items-center justify-center gap-2", className)}
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {label}
        </Button>
    )
}
