import { cn } from "@/lib/utils";

import type { EventPhase, TeamStatus } from "../overview-data";

const phaseStyles: Record<EventPhase, string> = {
    "Registration Open": "border-orange-500/30 bg-orange-500/10 text-orange-300",
    "In Progress": "border-sky-500/30 bg-sky-500/10 text-sky-300",
    "Final Round": "border-purple-500/30 bg-purple-500/10 text-purple-300",
    Closed: "border-border bg-muted text-muted-foreground",
};

const statusStyles: Record<TeamStatus, string> = {
    Registered: "border-border bg-muted text-muted-foreground",
    Approved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    "Semi Final": "border-orange-500/30 bg-orange-500/10 text-orange-300",
    Finalist: "border-purple-500/30 bg-purple-500/10 text-purple-300",
};

type BadgeProps = {
    label: EventPhase | TeamStatus;
    type?: "phase" | "status";
};

export function EventPhaseBadge({ label, type = "phase" }: BadgeProps) {
    const styles = type === "phase"
        ? phaseStyles[label as EventPhase]
        : statusStyles[label as TeamStatus];

    return (
        <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold", styles)}>
            {label}
        </span>
    );
}
