import { CalendarClock, Trophy, UsersRound } from "lucide-react";
import NextLink from "next/link";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

import type { ActiveEvent } from "../overview-data";
import { EventPhaseBadge } from "./event-phase-badge";

type ActiveEventsSectionProps = {
    events: ActiveEvent[];
};

export function ActiveEventsSection({ events }: ActiveEventsSectionProps) {
    return (
        <section>
            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">Active Events</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ongoing hackathons accepting teams, submissions, and final demos.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                {events.map((event) => (
                    <GlassCard key={event.title} className="group rounded-[24px] bg-card p-0 hover:-translate-y-1">
                        <div className={`relative h-36 overflow-hidden rounded-t-[24px] bg-gradient-to-br ${event.accent}`}>
                            <div className="absolute inset-0 seal-grid opacity-20" />
                            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                                <EventPhaseBadge label={event.phase} />
                                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-xl">
                                    SEAL
                                </span>
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
                            <p className="mt-2 min-h-16 text-sm leading-6 text-muted-foreground">
                                {event.description}
                            </p>

                            <div className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4 text-orange-400" />
                                    {event.deadline}
                                </div>
                                <div className="flex items-center gap-2">
                                    <UsersRound className="h-4 w-4 text-orange-400" />
                                    {event.participants}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-orange-400" />
                                    {event.prizePool}
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {event.tracks.map((track) => (
                                    <span key={track} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                        {track}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                                <Button asChild variant="outline" className="rounded-2xl border-border bg-card">
                                    <NextLink href="/events">View Event</NextLink>
                                </Button>
                                <Button variant="orange" className="rounded-2xl">
                                    Register Now
                                </Button>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </section>
    );
}
