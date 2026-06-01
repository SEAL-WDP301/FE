import { CalendarDays, FileText, RotateCcw, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

import type { Meeting } from "../mock-data";

type MeetingScheduleCardProps = {
    meetings: Meeting[];
};

export function MeetingScheduleCard({ meetings }: MeetingScheduleCardProps) {
    return (
        <GlassCard className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Meeting Schedule
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Upcoming mentor sessions and notes.
                    </p>
                </div>
                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400 sm:flex">
                    <CalendarDays className="h-6 w-6" />
                </div>
            </div>

            <div className="space-y-4">
                {meetings.map((meeting) => (
                    <div
                        key={`${meeting.title}-${meeting.time}`}
                        className="rounded-[20px] border border-border bg-white/[0.035] p-4"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className="font-semibold text-foreground">
                                    {meeting.title}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {meeting.date} • {meeting.time}
                                </p>
                            </div>
                            <Badge variant={meeting.type === "Offline" ? "warning" : "default"}>
                                {meeting.type}
                            </Badge>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            {meeting.note}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Button variant="orange" size="sm" className="rounded-xl">
                                <Video className="h-4 w-4" />
                                Join Meeting
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-xl border-border bg-muted">
                                <RotateCcw className="h-4 w-4" />
                                Reschedule
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-xl text-orange-400 hover:bg-orange-500/10 hover:text-orange-300">
                                <FileText className="h-4 w-4" />
                                View Notes
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
