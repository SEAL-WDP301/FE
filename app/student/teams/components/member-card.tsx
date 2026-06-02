import { MoreHorizontal, Shield, Trash2, UserRoundCog } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlassCard } from "@/components/ui/glass-card";

import type { TeamMember } from "../mock-data";
import { MemberRoleBadge } from "./member-role-badge";
import { MemberStatusBadge } from "./member-status-badge";

type MemberCardProps = {
    member: TeamMember;
};

export function MemberCard({ member }: MemberCardProps) {
    return (
        <GlassCard className="group rounded-[20px] bg-card p-5 hover:-translate-y-1">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-orange-500/25 blur-xl transition-opacity group-hover:opacity-100" />
                        <Avatar className="relative h-16 w-16 border border-orange-500/25">
                            <AvatarFallback className="text-base">
                                {member.initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div>
                        <p className="text-lg font-semibold text-foreground">
                            {member.name}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {member.university}
                        </p>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="dashboardIcon" size="icon-sm" className="rounded-xl">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel>
                            Member Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <UserRoundCog className="mr-2 h-4 w-4" />
                            View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 focus:text-red-400">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Member
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <MemberRoleBadge role={member.role} />
                <MemberStatusBadge status={member.status} />
            </div>

            <p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">
                {member.bio}
            </p>

            <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Skills
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                        <span
                            key={skill}
                            className="rounded-full border border-orange-500/15 bg-orange-500/5 px-3 py-1 text-xs font-medium text-foreground/85"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                    ["Tasks", member.tasks],
                    ["Uploads", member.uploads],
                    ["Activity", member.activity],
                ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-border bg-white/[0.035] p-3">
                        <p className="text-[11px] text-muted-foreground">
                            {label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                            {value}
                        </p>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
