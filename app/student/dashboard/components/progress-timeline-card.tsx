import { Check, Lock, Send, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

import type { ProgressStep } from "../mock-data";
import { SectionTitle } from "./section-title";

type ProgressTimelineCardProps = {
    steps: ProgressStep[];
};

export function ProgressTimelineCard({ steps }: ProgressTimelineCardProps) {
    const completedCount = steps.filter((step) => step.status === "completed").length;

    return (
        <GlassCard className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <SectionTitle icon={ShieldCheck} label="Progress Timeline" />
                <Badge variant="outline">
                    {completedCount} of {steps.length} milestones completed
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-5">
                {steps.map((step, index) => {
                    const completed = step.status === "completed";
                    const current = step.status === "current";
                    const locked = step.status === "locked";

                    return (
                        <div key={step.label} className="relative">
                            {index < steps.length - 1 ? (
                                <div className="absolute left-10 top-5 hidden h-px w-[calc(100%_-_1.5rem)] bg-white/10 md:block">
                                    <div
                                        className={cn(
                                            "h-full",
                                            completed ? "bg-orange-500" : "bg-transparent"
                                        )}
                                    />
                                </div>
                            ) : null}

                            <div className="relative flex items-center gap-3 md:flex-col md:items-start">
                                <div
                                    className={cn(
                                        "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                                        completed && "border-orange-500 bg-orange-500 text-black",
                                        current && "border-orange-400 bg-orange-500/10 text-orange-400 shadow-[0_0_0_6px_rgba(243,112,33,0.12),0_0_28px_rgba(243,112,33,0.38)]",
                                        locked && "border-white/10 bg-white/[0.03] text-muted-foreground"
                                    )}
                                >
                                    {completed ? <Check className="h-4 w-4" /> : null}
                                    {current ? <Send className="h-4 w-4" /> : null}
                                    {locked ? <Lock className="h-4 w-4" /> : null}
                                </div>

                                <div className="md:mt-3">
                                    <p
                                        className={cn(
                                            "text-sm font-semibold",
                                            locked ? "text-muted-foreground" : "text-white"
                                        )}
                                    >
                                        {step.label}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {completed ? "Completed" : current ? "In progress" : "Locked"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
}
