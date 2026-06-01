import {
    Activity,
    ChevronDown,
    Mail,
    Search,
    Send,
    SlidersHorizontal,
    UserPlus,
    UsersRound,
    UserRoundCheck,
    X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";

import { MemberCard } from "./components/member-card";
import {
    memberActivities,
    members,
    pendingInvites,
    roleFilters,
    teamStats,
} from "./mock-data";

const statIcons = [UsersRound, UserPlus, UserRoundCheck];

export default function TeamMembersPage() {
    return (
        <div className="mx-auto max-w-[1500px] space-y-6">
            <header className="border-b border-border pb-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
                            Team Workspace
                        </p>
                        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
                            Team Members
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Manage your team and collaboration
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className="px-3 py-1.5">
                            4 / 5 Members
                        </Badge>
                        <Button variant="orange" className="rounded-2xl px-5">
                            <UserPlus className="h-4 w-4" />
                            Invite Member
                        </Button>
                    </div>
                </div>
            </header>

            <section className="grid gap-4 md:grid-cols-3">
                {teamStats.map((stat, index) => {
                    const Icon = statIcons[index];

                    return (
                        <GlassCard key={stat.label} className="rounded-[20px] bg-card p-5 hover:-translate-y-1">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                        {stat.label}
                                    </p>
                                    <p className="mt-3 text-2xl font-semibold text-foreground">
                                        {stat.value}
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {stat.helper}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>
                        </GlassCard>
                    );
                })}
            </section>

            <GlassCard className="rounded-[20px] bg-card p-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="relative w-full xl:max-w-md">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search member by name, skill, or role..."
                            className="h-11 rounded-2xl border-border bg-muted pl-11"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" className="rounded-2xl border-border bg-muted">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filter
                            <ChevronDown className="h-4 w-4" />
                        </Button>

                        {roleFilters.map((filter) => (
                            <Button
                                key={filter}
                                variant={filter === "All" ? "soft" : "ghost"}
                                size="sm"
                                className="rounded-xl"
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>
                </div>
            </GlassCard>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        {members.map((member) => (
                            <MemberCard key={member.name} member={member} />
                        ))}
                    </div>

                    <GlassCard className="rounded-[20px] bg-card p-6">
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    Pending Invitations
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Track invites that are waiting for student response.
                                </p>
                            </div>
                            <Badge variant="warning">
                                {pendingInvites.length} Pending
                            </Badge>
                        </div>

                        <div className="grid gap-3 lg:grid-cols-2">
                            {pendingInvites.map((invite) => (
                                <div
                                    key={invite.email}
                                    className="rounded-[20px] border border-border bg-white/[0.035] p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-foreground">
                                                {invite.name}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {invite.email}
                                            </p>
                                        </div>
                                        <Badge variant="warning">
                                            Pending
                                        </Badge>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                                        <span>{invite.sentTime}</span>
                                        <span>{invite.role}</span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Button variant="soft" size="sm" className="rounded-xl">
                                            <Send className="h-4 w-4" />
                                            Resend
                                        </Button>
                                        <Button variant="ghost" size="sm" className="rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200">
                                            <X className="h-4 w-4" />
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                <aside className="space-y-5">
                    <GlassCard glow className="rounded-[20px] bg-card p-6">
                        <div className="mb-5">
                            <h2 className="text-lg font-semibold text-foreground">
                                Invite Member
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Modal preview for sending a secure team invitation.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <label className="block">
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                    Student Email
                                </span>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="student@fpt.edu.vn"
                                        className="h-11 rounded-2xl border-border bg-muted pl-11"
                                    />
                                </div>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                    Student Code
                                </span>
                                <Input
                                    placeholder="SE171234"
                                    className="h-11 rounded-2xl border-border bg-muted"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                    Role
                                </span>
                                <Button
                                    variant="outline"
                                    className="h-11 w-full justify-between rounded-2xl border-border bg-muted px-4"
                                >
                                    Developer
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </label>

                            <Button variant="orange" className="w-full rounded-2xl">
                                <Send className="h-4 w-4" />
                                Send Invite
                            </Button>
                        </div>
                    </GlassCard>

                    <GlassCard className="rounded-[20px] bg-card p-6">
                        <div className="mb-5 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                                <Activity className="h-4 w-4" />
                            </div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Recent Member Activity
                            </h2>
                        </div>

                        <div className="space-y-5">
                            {memberActivities.map((activity, index) => (
                                <div key={activity.label} className="relative flex gap-3">
                                    {index < memberActivities.length - 1 ? (
                                        <span className="absolute left-[5px] top-4 h-[calc(100%_+_0.25rem)] w-px bg-white/10" />
                                    ) : null}
                                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500 shadow-[0_0_16px_rgba(243,112,33,0.65)]" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            {activity.label}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </aside>
            </section>
        </div>
    );
}
