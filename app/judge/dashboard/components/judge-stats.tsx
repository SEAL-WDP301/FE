"use client";

import {
    CheckCircle2,
    ClipboardCheck,
    Users,
    Trophy,
} from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";

const stats = [
    {
        icon: ClipboardCheck,
        label: "Pending Reviews",
        value: 12,
    },

    {
        icon: CheckCircle2,
        label: "Completed Reviews",
        value: 48,
    },

    {
        icon: Users,
        label: "Assigned Teams",
        value: 16,
    },

    {
        icon: Trophy,
        label: "Avg. Score Given",
        value: "8.2",
        suffix: "/10",
    },
];

export function JudgeStats() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => {
                const Icon = item.icon;

                return (
                    <GlassCard
                        key={index}
                        className="p-5"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {item.label}
                                </p>

                                <div className="mt-2 flex items-end gap-1">
                                    <h3 className="text-3xl font-bold">
                                        {item.value}
                                    </h3>

                                    {item.suffix && (
                                        <span className="mb-1 text-sm text-muted-foreground">
                                            {item.suffix}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                                <Icon className="h-5 w-5" />
                            </div>
                        </div>
                    </GlassCard>
                );
            })}
        </div>
    );
}