import { CalendarClock, MessageSquareText, Plus, Search, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

import { MentorPageHeader } from "./_components/mentor-page-header";
import { ProgressBar } from "./_components/progress-bar";
import { RiskBadge, SessionStatusBadge, TeamStatusBadge } from "./_components/status-badges";
import { activities, attentionItems, sessions, stats, teams } from "./mock-data";

const statIcons = [Search, CalendarClock, MessageSquareText, Video];

export default function MentorDashboardPage() {
    return (
        <div className="mx-auto max-w-[1500px] space-y-6">
            <MentorPageHeader
                title="Mentor Dashboard"
                subtitle="Monitor your assigned teams and mentoring activities."
                actions={
                    <>
                        <Button variant="outline" className="rounded-2xl border-white/10 bg-white/[0.03]">
                            <Search className="h-4 w-4" />
                            Search Teams
                        </Button>
                        <Button variant="orange" className="rounded-2xl">
                            <Plus className="h-4 w-4" />
                            Schedule Session
                        </Button>
                    </>
                }
            />

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = statIcons[index];

                    return (
                        <GlassCard key={stat.label} className="rounded-[22px] bg-card p-5 hover:-translate-y-1">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                        {stat.label}
                                    </p>
                                    <p className="mt-3 text-4xl font-semibold text-white">
                                        {stat.value}
                                    </p>
                                    <p className="mt-2 text-sm text-orange-300">
                                        {stat.trend}
                                    </p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>
                        </GlassCard>
                    );
                })}
            </section>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
                <main className="space-y-5">
                    <GlassCard className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-white">Today&apos;s Sessions</h2>
                        <div className="mt-5 space-y-4">
                            {sessions.slice(0, 3).map((session) => (
                                <div key={`${session.team}-${session.time}`} className="flex flex-col gap-3 rounded-[20px] border border-white/10 bg-white/[0.035] p-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="font-semibold text-white">{session.team}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">{session.topic} · {session.time} · {session.type}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <SessionStatusBadge status={session.status} />
                                        <Button variant="orange" size="sm" className="rounded-xl">Quick Join</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-white">Team Progress Overview</h2>
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            {teams.map((team) => (
                                <div key={team.name} className="rounded-[20px] border border-white/10 bg-white/[0.035] p-4">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-white">{team.name}</p>
                                            <p className="text-xs text-muted-foreground">{team.milestone}</p>
                                        </div>
                                        <RiskBadge risk={team.risk} />
                                    </div>
                                    <ProgressBar value={team.progress} />
                                    <div className="mt-3 flex items-center justify-between text-sm">
                                        <TeamStatusBadge status={team.status} />
                                        <span className="font-semibold text-orange-300">{team.progress}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </main>

                <aside className="space-y-5">
                    <GlassCard className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-white">Teams Requiring Attention</h2>
                        <div className="mt-5 space-y-3">
                            {attentionItems.map((item) => (
                                <div key={item.team} className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-white">{item.team}</p>
                                        <Badge variant={item.level === "High" ? "destructive" : "warning"}>{item.level}</Badge>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">{item.reason}</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-white">Recent Activities</h2>
                        <div className="mt-5 space-y-4">
                            {activities.map((activity) => (
                                <div key={activity} className="flex gap-3 text-sm">
                                    <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_14px_rgba(243,112,33,0.7)]" />
                                    <span className="text-muted-foreground">{activity}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </aside>
            </div>
        </div>
    );
}
