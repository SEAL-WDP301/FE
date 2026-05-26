import { CalendarClock, Clock3, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

import type { DeadlineSummary } from "../mock-data";
import { SectionTitle } from "./section-title";

type DeadlineCardProps = {
    deadline: DeadlineSummary;
};

export function DeadlineCard({ deadline }: DeadlineCardProps) {
    return (
        <GlassCard className="rounded-[24px] border-orange-500/20 bg-card p-6 hover:-translate-y-1">
            <div className="mb-5 flex items-start justify-between gap-4">
                <SectionTitle icon={CalendarClock} label="Next Deadline" />
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_18px_rgba(243,112,33,0.8)]" />
            </div>

            <p className="text-2xl font-semibold tracking-tight text-white">
                {deadline.title}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
                Due date: {deadline.dueDate}
            </p>

            <div className="mt-5 rounded-[20px] border border-orange-500/20 bg-orange-500/10 p-4">
                <div className="flex items-center gap-2 text-orange-300">
                    <Clock3 className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                        {deadline.countdown}
                    </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {deadline.helperText}
                </p>
            </div>

            <Button variant="orange" className="mt-5 w-full rounded-2xl">
                <UploadCloud className="h-4 w-4" />
                Upload Now
            </Button>
        </GlassCard>
    );
}
