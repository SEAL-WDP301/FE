import { CalendarDays, FileText, Plus, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Textarea } from "@/components/ui/textarea";

import { MentorPageHeader } from "../_components/mentor-page-header";
import { SessionStatusBadge } from "../_components/status-badges";
import { sessions } from "../mock-data";

export default function MentoringSessionsPage() {
    return (
        <div className="mx-auto max-w-[1500px] space-y-6">
            <MentorPageHeader
                title="Mentoring Sessions"
                subtitle="Calendar view, session details, objectives, notes, and follow-up tasks."
                actions={<Button variant="orange" className="rounded-2xl"><Plus className="h-4 w-4" />Create Session</Button>}
            />

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
                <main className="space-y-5">
                    <GlassCard className="rounded-[24px] bg-card p-6">
                        <div className="mb-5 flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold text-foreground">Weekly Calendar</h2>
                        </div>
                        <div className="grid gap-3 md:grid-cols-5">
                            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                                <div key={day} className="min-h-40 rounded-[20px] border border-border bg-muted/40 p-3">
                                    <p className="font-semibold text-foreground">{day}</p>
                                    {sessions[index] ? (
                                        <div className="mt-4 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-3">
                                            <p className="text-sm font-semibold text-foreground">{sessions[index].team}</p>
                                            <p className="mt-1 text-xs text-primary">{sessions[index].time}</p>
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <div className="grid gap-4 md:grid-cols-2">
                        {sessions.map((session) => (
                            <GlassCard key={`${session.team}-${session.time}`} className="rounded-[22px] bg-card p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold text-foreground">{session.team}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">{session.topic}</p>
                                        <p className="mt-2 text-xs text-primary">{session.time} · {session.type}</p>
                                    </div>
                                    <SessionStatusBadge status={session.status} />
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Button variant="orange" size="sm" className="rounded-xl"><Video className="h-4 w-4" />Join Meeting</Button>
                                    <Button variant="soft" size="sm" className="rounded-xl"><FileText className="h-4 w-4" />Add Notes</Button>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </main>

                <aside>
                    <GlassCard className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-foreground">Session Detail Modal</h2>
                        <div className="mt-5 space-y-4">
                            {["Objectives", "Discussion notes", "Team concerns", "Follow-up tasks"].map((label) => (
                                <label key={label} className="block">
                                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
                                    <Textarea className="min-h-20 rounded-2xl border-border bg-muted/40" placeholder={`Add ${label.toLowerCase()}...`} />
                                </label>
                            ))}
                            <Badge variant="outline">Modern modal preview</Badge>
                        </div>
                    </GlassCard>
                </aside>
            </div>
        </div>
    );
}
