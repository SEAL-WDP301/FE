import { Bell, CalendarClock, Timer, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

import type { Announcement, UpcomingEvent } from "../overview-data";

type EventHubSidePanelProps = {
    upcomingEvents: UpcomingEvent[];
    announcements: Announcement[];
    quickStats: Array<{
        label: string;
        value: string;
    }>;
};

function announcementVariant(priority: Announcement["priority"]) {
    if (priority === "Urgent") return "destructive" as const;
    if (priority === "Important") return "warning" as const;
    return "outline" as const;
}

export function EventHubSidePanel({
    upcomingEvents,
    announcements,
    quickStats,
}: EventHubSidePanelProps) {
    return (
        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <GlassCard className="rounded-[22px] bg-card p-5">
                <div className="mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-400" />
                    <h2 className="text-base font-semibold text-foreground">
                        Quick Stats
                    </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    {quickStats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-border bg-muted/50 p-4"
                        >
                            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                {stat.label}
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-foreground">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>
            </GlassCard>

            <GlassCard className="rounded-[22px] bg-card p-5">
                <div className="mb-4 flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-orange-400" />
                    <h2 className="text-base font-semibold text-foreground">
                        Upcoming Events
                    </h2>
                </div>

                <div className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                        <div key={event.title} className="relative flex gap-3">
                            {index < upcomingEvents.length - 1 ? (
                                <span className="absolute left-[5px] top-4 h-[calc(100%_+_0.25rem)] w-px bg-border" />
                            ) : null}
                            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500 shadow-[0_0_16px_rgba(243,112,33,0.65)]" />

                            <div>
                                <p className="text-sm font-semibold text-foreground">
                                    {event.title}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {event.date}
                                </p>
                                <p className="mt-1 flex items-center gap-1 text-xs text-orange-400">
                                    <Timer className="h-3.5 w-3.5" />
                                    {event.opensIn}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>

            <GlassCard className="rounded-[22px] bg-card p-5">
                <div className="mb-4 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-400" />
                    <h2 className="text-base font-semibold text-foreground">
                        Announcements
                    </h2>
                </div>

                <div className="space-y-3">
                    {announcements.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-border bg-muted/50 p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-semibold text-foreground">
                                    {item.title}
                                </p>
                                <Badge variant={announcementVariant(item.priority)}>
                                    {item.priority}
                                </Badge>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                {item.time}
                            </p>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </aside>
    );
}
