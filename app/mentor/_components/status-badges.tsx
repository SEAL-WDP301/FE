import { cn } from "@/lib/utils";

export type RiskLevel = "Low" | "Medium" | "High";
export type TeamStatus = "On Track" | "Need Support" | "At Risk" | "Inactive";
export type SessionStatus = "Scheduled" | "Completed" | "Missed" | "Cancelled";
export type FeedbackPriority = "Low" | "Medium" | "High" | "Critical";

const riskStyles: Record<RiskLevel, string> = {
    Low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    Medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
    High: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

const teamStatusStyles: Record<TeamStatus, string> = {
    "On Track": "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    "Need Support": "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
    "At Risk": "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
    Inactive: "border-border bg-muted/40 text-muted-foreground",
};

const sessionStyles: Record<SessionStatus, string> = {
    Scheduled: "border-orange-500/30 bg-orange-500/10 text-primary",
    Completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    Missed: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
    Cancelled: "border-border bg-muted/40 text-muted-foreground",
};

const priorityStyles: Record<FeedbackPriority, string> = {
    Low: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    Medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
    High: "border-orange-500/30 bg-orange-500/10 text-primary",
    Critical: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

function BadgeBase({ children, className }: { children: React.ReactNode; className: string }) {
    return (
        <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold", className)}>
            {children}
        </span>
    );
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
    return <BadgeBase className={riskStyles[risk]}>{risk} Risk</BadgeBase>;
}

export function TeamStatusBadge({ status }: { status: TeamStatus }) {
    return <BadgeBase className={teamStatusStyles[status]}>{status}</BadgeBase>;
}

export function SessionStatusBadge({ status }: { status: SessionStatus }) {
    return <BadgeBase className={sessionStyles[status]}>{status}</BadgeBase>;
}

export function PriorityBadge({ priority }: { priority: FeedbackPriority }) {
    return <BadgeBase className={priorityStyles[priority]}>{priority}</BadgeBase>;
}
