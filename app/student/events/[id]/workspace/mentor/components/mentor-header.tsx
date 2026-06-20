import { Badge } from "@/components/ui/badge";

export function MentorHeader({
    hasMentor,
    feedbackCount,
}: {
    hasMentor: boolean;
    feedbackCount: number;
}) {
    return (
        <header className="border-b border-border pb-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-400">
                        Team Workspace
                    </p>
                    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
                        Mentor Workspace
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Collaborate with your assigned mentor
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Badge variant={hasMentor ? "success" : "outline"}>
                        {hasMentor ? "Active Mentor" : "No Mentor Assigned"}
                    </Badge>
                    <Badge variant={feedbackCount > 0 ? "default" : "outline"}>
                        {feedbackCount} Feedback
                    </Badge>
                </div>
            </div>
        </header>
    );
}
