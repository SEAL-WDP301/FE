import { Pencil, UserPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

import type { TeamSummary } from "../mock-data";

type TeamHeroCardProps = {
    team: TeamSummary;
};

export function TeamHeroCard({ team }: TeamHeroCardProps) {
    const stats = [
        ["Track", team.track],
        ["Current round", team.currentRound],
        ["Members", team.memberCount],
        ["Mentor", team.mentor],
    ];

    return (
        <GlassCard
            glow
            className="group min-h-[260px] rounded-[24px] bg-card p-6 hover:-translate-y-1"
        >
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/15 blur-[90px]" />
            <div className="absolute left-8 top-10 h-28 w-28 rounded-full bg-[#ff8a3d]/15 blur-[55px]" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#ff8a3d] to-[#f37021] opacity-40 blur-xl" />
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-[24px] border border-orange-400/30 bg-gradient-to-br from-[#ff8a3d] to-[#f37021] text-4xl font-black text-black shadow-[0_20px_60px_rgba(243,112,33,0.24)]">
                            {team.initials}
                        </div>
                    </div>

                    <div>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            <Badge variant="success">
                                {team.status}
                            </Badge>
                            <Badge>
                                {team.currentRound}
                            </Badge>
                        </div>

                        <h1 className="text-4xl font-semibold tracking-tight text-white">
                            {team.name}
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            {team.description}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button variant="orange" className="rounded-2xl px-5">
                        <UserPlus className="h-4 w-4" />
                        Invite Member
                    </Button>
                    <Button
                        variant="outline"
                        className="rounded-2xl border-white/10 bg-white/[0.03] px-5"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit Team
                    </Button>
                </div>
            </div>

            <div className="relative mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(([label, value]) => (
                    <div
                        key={label}
                        className="rounded-[20px] border border-white/10 bg-white/[0.035] p-4"
                    >
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            {label}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">
                            {value}
                        </p>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
