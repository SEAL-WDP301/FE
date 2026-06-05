"use client";

import Link from "next/link";
import { ArrowRight, Clock, Users } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventCardProps {
    event: {
        id: number;
        name: string;
        category: string;
        round: string;
        teams: number;
        deadline: string;
        progress: number;
    };
}

const getCategoryVariant = (
    category: string
):
    | "ai"
    | "cloud"
    | "cyber"
    | "edtech"
    | "web3" => {

    switch (category) {
        case "AI/ML":
            return "ai";

        case "Cloud":
            return "cloud";

        case "Cyber Security":
            return "cyber";

        case "EdTech":
            return "edtech";

        case "Web3":
            return "web3";

        default:
            return "cloud";
    }
};

export default function EventCard({ event }: EventCardProps) {
    return (
        <GlassCard className="overflow-hidden p-0 seal-card-hover bg-gradient-to-br">
            <div className="relative h-40 rounded-t-3xl bg-gradient-to-br from-orange-500/30 via-orange-500/10 to-transparent">
                <div className="seal-grid absolute inset-0 opacity-30" />

                <div className="absolute left-5 top-5 flex gap-2">
                    <Badge variant={getCategoryVariant(event.category)}>
                        {event.category}
                    </Badge>
                    <Badge variant="outline"
                        className="bg-background/50 border-border text-muted-foreground"
                    >
                        {event.round}
                    </Badge>
                </div>

                <div className="absolute bottom-5 left-5">
                    <h3 className="text-2xl font-bold">
                        {event.name}
                    </h3>
                </div>
            </div>

            <div className="space-y-5 p-5">
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-border bg-card/40 p-3">
                        <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-4 w-4" />
                            Teams
                        </div>

                        <p className="text-xl font-bold">
                            {event.teams}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/40 p-3">
                        <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            Deadline
                        </div>

                        <p className="text-xl font-bold">
                            {event.deadline}
                        </p>
                    </div>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            Evaluation Progress
                        </span>

                        <span className="font-semibold text-orange-400">
                            {event.progress}%
                        </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full bg-orange"
                            style={{
                                width: `${event.progress}%`,
                            }}
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-start">
                    <Link href="/judge/evalution">
                        <Button className="w-full bg-orange hover:bg-orange/90">
                            Review
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </GlassCard>

    );
}