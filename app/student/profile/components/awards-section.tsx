import { Award, Crown, Medal } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";

const awards = [
    {
        name: "Spring 2026 Champion",
        description: "Web Platforms · OrbitWave",
        icon: Crown,
    },
    {
        name: "Summer 2026 Finalist",
        description: "DevOps · NebulaForge",
        icon: Award,
    },
    {
        name: "Spring 2025 Finalist",
        description: "Fintech · Pixel Drift",
        icon: Award,
    },
    {
        name: "Best UX Award",
        description: "Round 2 — SEAL Fall 2026",
        icon: Medal,
    },
];

export function AwardsSection() {
    return (
        <GlassCard className="p-5 sm:p-6">
            <h3 className="mb-5 text-base font-semibold text-foreground">
                Awards & Achievements
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {awards.map((award) => (
                    <div
                        key={award.name}
                        className="group relative overflow-hidden rounded-xl border border-border bg-muted/30 p-4 transition hover:border-orange-500/40"
                    >
                        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-500/10 blur-2xl opacity-0 transition group-hover:opacity-100" />

                        <div className="relative flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-black shadow-lg shadow-orange-500/20">
                                <award.icon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                                <h4 className="text-sm font-semibold text-foreground">
                                    {award.name}
                                </h4>

                                <p className="text-[11px] text-muted-foreground">
                                    {award.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
