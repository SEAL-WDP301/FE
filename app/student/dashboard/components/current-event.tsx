import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

import { Clock, Trophy, Upload } from "lucide-react";
import Link from "next/link";
import { CountdownTimer } from "./countdown-timer";

export function CurrentEvent() {
    return (
        <GlassCard className="overflow-hidden p-0 lg:col-span-2">
            <div className="relative h-56 border-b border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-transparent" />

                <div className="absolute left-5 top-5 flex items-center gap-2">
                    <Badge variant="success">
                        LIVE · ROUND 2
                    </Badge>

                    <Badge variant="outline">
                        AI / ML Category
                    </Badge>
                </div>

                <div className="absolute bottom-5 left-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-orange-400">
                        Current Event
                    </p>

                    <h2 className="mt-2 text-4xl font-bold text-white">
                        SEAL Summer 2026 — Agile Frontier
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Team NebulaForge · Current rank{" "}
                        <span className="font-semibold text-orange-400">
                            #7
                        </span>{" "}
                        of 142
                    </p>
                </div>
            </div>

            <div className="space-y-5 p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-orange-400" />
                    Round 2 closes in
                </div>
                <CountdownTimer targetDate="2026-06-27T23:59:59" />

                <div className="flex flex-wrap gap-3">

                    <Button asChild variant="outline">
                        <Link href="/student/submissions">
                            <Upload className="h-4 w-4" />
                            Submit Project
                        </Link>
                    </Button>

                    <Button asChild variant="ghost">
                        <Link href="/student/rankings">
                            <Trophy className="h-4 w-4" />
                            Rankings
                        </Link>
                    </Button>

                </div>
            </div>
        </GlassCard >
    );
}