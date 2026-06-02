"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";

import {
    FileText,
    Play,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";


const shortcuts = [
    {
        icon: FaGithub,
        label: "GitHub Repo",
        desc: "neon-pulse/seal",
    },

    {
        icon: Play,
        label: "Demo Video",
        desc: "2:48 walkthrough",
    },

    {
        icon: FileText,
        label: "Presentation",
        desc: "18 slides",
    },

    {
        icon: FileText,
        label: "Documentation",
        desc: "Technical brief",
    },
];

export function QuickSubmission() {
    return (
        <GlassCard className="p-5">
            <h2 className="mb-4 text-lg font-semibold">
                Quick Submission Access
            </h2>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {shortcuts.map((item, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ y: -2 }}
                        className="group flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3.5 text-left transition hover:border-primary/40 hover:bg-card/70"
                    >
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary transition group-hover:glow-orange-sm">
                            <item.icon size={18} />
                        </div>

                        <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">
                                {item.label}
                            </div>

                            <div className="truncate text-[11px] text-muted-foreground">
                                {item.desc}
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </GlassCard>
    );
}