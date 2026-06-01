import { ChevronDown, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

import type { PermissionMember } from "../mock-data";
import { SettingsToggle } from "./settings-toggle";

type MemberPermissionsSectionProps = {
    members: PermissionMember[];
};

export function MemberPermissionsSection({ members }: MemberPermissionsSectionProps) {
    return (
        <GlassCard className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Member Permissions</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Team Leader controls upload, invites, settings, and meeting permissions.
                    </p>
                </div>
                <Badge variant="warning">
                    Leader only
                </Badge>
            </div>

            <div className="space-y-4">
                {members.map((member) => (
                    <div
                        key={member.name}
                        className="rounded-[22px] border border-border bg-white/[0.035] p-4"
                    >
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-11 w-11 border border-orange-500/25">
                                    <AvatarFallback>{member.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-foreground">{member.name}</p>
                                    <Button variant="ghost" size="sm" className="mt-1 h-auto rounded-xl px-0 py-0 text-xs text-orange-300 hover:bg-transparent">
                                        {member.role}
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                {Object.entries(member.permissions).map(([label, enabled]) => (
                                    <div key={label} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted px-3 py-2">
                                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
                                            {label}
                                        </span>
                                        <SettingsToggle enabled={enabled} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
