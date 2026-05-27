import { ArrowRight, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

import type { MyEvent } from "../overview-data";
import { EventPhaseBadge } from "./event-phase-badge";

type MyEventsSectionProps = {
    events: MyEvent[];
};

export function MyEventsSection({ events }: MyEventsSectionProps) {
    return (
        <section>
            <div className="mb-4">
                <h2 className="text-2xl font-semibold text-foreground">My Events</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Your active startup-style hackathon workspaces.
                </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                {events.map((event) => (
                    <GlassCard key={`${event.teamName}-${event.eventName}`} className="rounded-[24px] bg-card p-4 hover:-translate-y-1">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <EventPhaseBadge label={event.status} type="status" />
                                    <span className="text-xs text-muted-foreground">{event.round}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">{event.teamName}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{event.eventName}</p>
                            </div>

                            <div className="min-w-[220px]">
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-semibold text-orange-300">{event.progress}%</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#ff8a3d] to-[#f37021]"
                                        style={{ width: `${event.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            <Button variant="orange" className="rounded-2xl">
                                Open Workspace
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="rounded-2xl border-border bg-card">
                                <FileText className="h-4 w-4" />
                                View Submission
                            </Button>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </section>
    );
}
