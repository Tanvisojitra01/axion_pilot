"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl?: string; // URL for iframe or video source
}

export default function VideoModal({ isOpen, onClose, videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ" }: VideoModalProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-md"
                >
                    <X className="w-5 h-5" />
                </button>

                {videoUrl.endsWith('.webp') || videoUrl.endsWith('.gif') || videoUrl.endsWith('.png') || videoUrl.endsWith('.jpg') ? (
                     /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                        src={videoUrl} 
                        alt="Demo Video" 
                        className="w-full h-full object-contain bg-black"
                    />
                ) : (
                    <iframe
                        width="100%"
                        height="100%"
                        src={videoUrl}
                        title="Demo Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                )}
            </div>

            {/* Backdrop click to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
}
