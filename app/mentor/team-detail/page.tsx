import { ExternalLink, MessageSquarePlus, Save, Video } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Textarea } from "@/components/ui/textarea";

import { MentorPageHeader } from "../_components/mentor-page-header";
import { ProgressBar } from "../_components/progress-bar";
import { RiskBadge, TeamStatusBadge } from "../_components/status-badges";
import { feedbackList, milestones, sessions, teamMembers, teams } from "../mock-data";

const team = teams[0];

export default function TeamDetailPage() {
    return (
        <div className="mx-auto max-w-[1500px] space-y-6">
            <MentorPageHeader
                title={team.name}
                subtitle="Detailed team review workspace for progress, notes, feedback, and sessions."
                actions={<Button variant="orange" className="rounded-2xl"><MessageSquarePlus className="h-4 w-4" />Add Feedback</Button>}
            />

            <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
                <aside className="space-y-5">
                    <GlassCard className="rounded-[24px] bg-card p-5">
                        <Avatar className="h-20 w-20 border border-orange-500/25">
                            <AvatarFallback className="text-2xl">{team.avatar}</AvatarFallback>
                        </Avatar>
                        <h2 className="mt-4 text-2xl font-semibold text-foreground">{team.name}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{team.project}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <TeamStatusBadge status={team.status} />
                            <RiskBadge risk={team.risk} />
                        </div>
                        <div className="mt-5">
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="text-primary">{team.progress}%</span>
                            </div>
                            <ProgressBar value={team.progress} />
                        </div>
                    </GlassCard>

                    <GlassCard className="rounded-[24px] bg-card p-5">
                        <h3 className="font-semibold text-foreground">Team Members</h3>
                        <div className="mt-4 space-y-3">
                            {teamMembers.map((member) => (
                                <div key={member.name} className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 p-3">
                                    <Avatar className="h-10 w-10"><AvatarFallback>{member.initials}</AvatarFallback></Avatar>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{member.name}</p>
                                        <p className="text-xs text-muted-foreground">{member.role} · {member.attendance}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </aside>

                <main className="space-y-5">
                    <GlassCard className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-foreground">Project Information</h2>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Problem statement: Teams lose clarity across hackathon deadlines, submissions, and role-based review flows.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {["Next.js", "NestJS", "PostgreSQL", "Shadcn UI", "Docker"].map((tech) => (
                                <Badge key={tech} variant="outline">{tech}</Badge>
                            ))}
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {["GitHub", "Figma", "Demo"].map((link) => (
                                <Button key={link} variant="soft" size="sm" className="rounded-xl">
                                    <ExternalLink className="h-4 w-4" />
                                    {link}
                                </Button>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-foreground">Milestone Timeline</h2>
                        <div className="mt-5 space-y-4">
                            {milestones.map((milestone) => (
                                <div key={milestone.label} className="flex items-center gap-3">
                                    <span className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_14px_rgba(243,112,33,0.7)]" />
                                    <span className="flex-1 text-sm font-medium text-foreground">{milestone.label}</span>
                                    <Badge variant={milestone.state === "completed" ? "success" : milestone.state === "current" ? "default" : "outline"}>{milestone.state}</Badge>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-foreground">Mentor Notes</h2>
                        <Textarea className="mt-4 min-h-32 rounded-2xl border-border bg-muted/40" placeholder="Private mentor notes with rich text support..." />
                        <Button variant="orange" className="mt-4 rounded-2xl"><Save className="h-4 w-4" />Save Note</Button>
                    </GlassCard>

                    <GlassCard className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-foreground">Feedback History</h2>
                        <div className="mt-5 space-y-3">
                            {feedbackList.slice(0, 3).map((feedback) => (
                                <div key={feedback.title} className="rounded-2xl border border-border bg-muted/40 p-4">
                                    <p className="font-semibold text-foreground">{feedback.title}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{feedback.category} · {feedback.date}</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </main>

                <aside className="space-y-5">
                    <GlassCard className="rounded-[24px] bg-card p-5">
                        <h3 className="font-semibold text-foreground">Quick Actions</h3>
                        <div className="mt-4 grid gap-2">
                            <Button variant="orange" className="rounded-2xl"><Video className="h-4 w-4" />Schedule Session</Button>
                            <Button variant="soft" className="rounded-2xl"><MessageSquarePlus className="h-4 w-4" />Add Feedback</Button>
                        </div>
                    </GlassCard>
                    <GlassCard className="rounded-[24px] bg-card p-5">
                        <h3 className="font-semibold text-foreground">Session History</h3>
                        <div className="mt-4 space-y-3">
                            {sessions.slice(0, 3).map((session) => (
                                <div key={session.time} className="rounded-2xl border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                                    {session.topic} · {session.time}
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </aside>
            </div>
        </div>
    );
}
