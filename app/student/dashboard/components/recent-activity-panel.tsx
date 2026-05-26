import { Clock3 } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";

import type { ActivityItem } from "../mock-data";
import { SectionTitle } from "./section-title";

type RecentActivityPanelProps = {
    activities: ActivityItem[];
};

export function RecentActivityPanel({ activities }: RecentActivityPanelProps) {
    return (
        <GlassCard className="rounded-[24px] bg-card p-6">
            <SectionTitle icon={Clock3} label="Recent Activity" />

            <div className="mt-6 space-y-5">
                {activities.map((activity, index) => (
                    <div key={activity.label} className="relative flex gap-3">
                        {index < activities.length - 1 ? (
                            <span className="absolute left-[5px] top-4 h-[calc(100%_+_0.25rem)] w-px bg-white/10" />
                        ) : null}
                        <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500 shadow-[0_0_16px_rgba(243,112,33,0.65)]" />
                        <div>
                            <p className="text-sm font-medium text-white">
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
