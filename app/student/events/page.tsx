"use client";

import { useMemo, useState } from "react";

import { Calendar, Crown, Award, Upload } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";

import { EventFilters } from "./components/event-filter";
import { EventsGrid } from "./components/event-grid";

import {
    events,
    FILTERS,
} from "./components/constants";

type FilterType = (typeof FILTERS)[number];

export default function StudentEventsPage() {
    const [filter, setFilter] =
        useState<FilterType>("All");

    const filteredEvents = useMemo(() => {
        if (filter === "All") {
            return events;
        }

        return events.filter(
            (event) => event.status === filter
        );
    }, [filter]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-400">
                    My Events
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Hackathon History
                </h1>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Every SEAL event you have participated in.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    {
                        label: "Total Events",
                        value: "6",
                        icon: Calendar,
                        sub: "Across 3 seasons",
                    },

                    {
                        label: "Highest Rank",
                        value: "#1",
                        icon: Crown,
                        sub: "Spring 2026 Champion",
                    },

                    {
                        label: "Submissions",
                        value: "12",
                        icon: Upload,
                        sub: "11 approved",
                    },

                    {
                        label: "Awards",
                        value: "4",
                        icon: Award,
                        sub: "1 gold · 3 finalist",
                    },
                ].map((item) => (
                    <GlassCard
                        key={item.label}
                        className="min-h-[132px] border border-border p-5 sm:p-6"
                    >
                        <div className="flex items-start justify-between">
                            <div className="min-w-0">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                                    {item.label}
                                </p>

                                <h3 className="mt-3 text-3xl font-bold text-orange-400">
                                    {item.value}
                                </h3>

                                <p className="mt-2 text-xs text-muted-foreground">
                                    {item.sub}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10">
                                <item.icon className="h-5 w-5 text-orange-400" />
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Filters */}
            <EventFilters
                filters={FILTERS}
                active={filter}
                onChange={setFilter}
            />

            {/* Events Grid */}
            <EventsGrid events={filteredEvents} />
        </div>
    );
}
