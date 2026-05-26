import { Filter, MessageSquarePlus, Search, Video } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";

import { MentorPageHeader } from "../_components/mentor-page-header";
import { ProgressBar } from "../_components/progress-bar";
import { RiskBadge, TeamStatusBadge } from "../_components/status-badges";
import { teams } from "../mock-data";

export default function MentorTeamsPage() {
    return (
        <div className="mx-auto max-w-[1500px] space-y-6">
            <MentorPageHeader title="My Teams" subtitle="Search, filter, and support your assigned hackathon teams." />

            <GlassCard className="rounded-[22px] bg-card p-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div className="relative xl:max-w-md xl:flex-1">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search team, event, leader..." className="h-11 rounded-2xl border-white/10 bg-white/[0.03] pl-11" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {["Event", "Round", "Status", "Risk Level"].map((filter) => (
                            <Button key={filter} variant="outline" className="rounded-2xl border-white/10 bg-white/[0.03]">
                                <Filter className="h-4 w-4" />
                                {filter}
                            </Button>
                        ))}
                    </div>
                </div>
            </GlassCard>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {teams.map((team) => (
                    <GlassCard key={team.name} className="rounded-[24px] bg-card p-5 hover:-translate-y-1">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-14 w-14 border border-orange-500/25">
                                    <AvatarFallback>{team.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">{team.name}</h2>
                                    <p className="text-sm text-muted-foreground">{team.project}</p>
                                </div>
                            </div>
                            <RiskBadge risk={team.risk} />
                        </div>

                        <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                            <p>Event: <span className="text-white">{team.event}</span></p>
                            <p>Leader: <span className="text-white">{team.leader}</span></p>
                            <p>Members: <span className="text-white">{team.members}</span></p>
                            <p>Last activity: <span className="text-white">{team.lastActivity}</span></p>
                        </div>

                        <div className="mt-5">
                            <div className="mb-2 flex justify-between text-sm">
                                <TeamStatusBadge status={team.status} />
                                <span className="font-semibold text-orange-300">{team.progress}%</span>
                            </div>
                            <ProgressBar value={team.progress} />
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            <Button variant="orange" size="sm" className="rounded-xl">View Team</Button>
                            <Button variant="soft" size="sm" className="rounded-xl">
                                <MessageSquarePlus className="h-4 w-4" />
                                Add Feedback
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-xl text-orange-400 hover:bg-orange-500/10">
                                <Video className="h-4 w-4" />
                                Schedule
                            </Button>
                        </div>
                    </GlassCard>
                ))}
            </section>
        </div>
    );
}
