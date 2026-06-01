import { Activity } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";

import type { MentorActivity } from "../mock-data";

type MentorActivityTimelineProps = {
    activities: MentorActivity[];
};

export function MentorActivityTimeline({ activities }: MentorActivityTimelineProps) {
    return (
        <GlassCard className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                    <Activity className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                    Mentor Activity
                </h2>
            </div>

            <div className="space-y-5">
                {activities.map((activity, index) => (
                    <div key={activity.label} className="relative flex gap-3">
                        {index < activities.length - 1 ? (
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
    );
}
