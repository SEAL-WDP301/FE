import { CalendarClock, CheckCircle2, TrendingUp } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

import { mentor, reviewSummary } from "../mock-data";

export function MentorHeroCard() {
    return (
        <GlassCard glow className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/15 blur-[90px]" />
            <div className="relative grid gap-7 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="flex flex-col gap-5 sm:flex-row">
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 rounded-full bg-orange-500/30 blur-2xl" />
                        <Avatar className="relative h-24 w-24 border border-orange-500/30">
                            <AvatarFallback className="text-2xl">
                                {mentor.initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight text-white">
                            {mentor.name}
                        </h2>
                        <p className="mt-2 text-sm font-medium text-orange-300">
                            {mentor.role}
                        </p>
                        <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
                            {mentor.bio}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {mentor.expertise.map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-full border border-orange-500/15 bg-orange-500/5 px-3 py-1 text-xs font-medium text-white/85"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>

                        <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarClock className="h-4 w-4 text-orange-400" />
                            {mentor.availability}
                        </div>
                    </div>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-5">
                    <Badge>
                        {reviewSummary.progressStatus}
                    </Badge>
                    <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Feedback completion</span>
                            <span className="font-semibold text-orange-300">{reviewSummary.completion}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#ff8a3d] to-[#f37021]"
                                style={{ width: `${reviewSummary.completion}%` }}
                            />
                        </div>
                    </div>

                    <div className="mt-5 space-y-3">
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                            <TrendingUp className="h-4 w-4 text-orange-400" />
                            <span className="text-sm text-white">Review progress is on track</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm text-white">{reviewSummary.upcomingSession}</span>
                        </div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
