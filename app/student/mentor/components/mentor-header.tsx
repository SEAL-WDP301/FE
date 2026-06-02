import { MessageSquareText, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MentorHeader() {
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
                    <Badge variant="success">
                        Active Mentor
                    </Badge>
                    <Badge variant="warning">
                        Review Pending
                    </Badge>
                    <Button variant="orange" className="rounded-2xl px-5">
                        <Video className="h-4 w-4" />
                        Book Meeting
                    </Button>
                    <Button variant="outline" className="rounded-2xl border-border bg-muted px-5">
                        <MessageSquareText className="h-4 w-4" />
                        Message Mentor
                    </Button>
                </div>
            </div>
        </header>
    );
}
