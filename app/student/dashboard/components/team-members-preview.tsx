import { ArrowRight, UsersRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

import type { TeamMember } from "../mock-data";
import { SectionTitle } from "./section-title";

type TeamMembersPreviewProps = {
    members: TeamMember[];
};

export function TeamMembersPreview({ members }: TeamMembersPreviewProps) {
    return (
        <GlassCard className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <SectionTitle icon={UsersRound} label="Team Members" />
                <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
                >
                    Manage
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {members.map((member) => (
                    <div
                        key={member.name}
                        className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/25"
                    >
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border border-orange-500/25">
                                <AvatarFallback>
                                    {member.initials}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-white">
                                    {member.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {member.role}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {member.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/80"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
