"use client";

import Image from "next/image";

export function AppBackground() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none select-none overflow-hidden">
            {/* Background Base: Clean Slate (Light) vs Escuro (Dark) */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-500" />

            {/* === DARK MODE: Cidade Noturna === */}
            <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-700 ease-in-out">
                <Image
                    src="/app-background.jpg"
                    alt="Background Night"
                    fill
                    quality={100}
                    priority
                    className="object-cover object-center opacity-90"
                />
                {/* Overlay Escuro Suave */}
                <div
                    className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/50 to-slate-950/80"
                />
            </div>
        </div>
    );
}
