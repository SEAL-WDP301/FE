import { CheckCircle2, CornerDownRight, MessageSquareText } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

import { mentor, type FeedbackItem } from "../mock-data";

type FeedbackThreadCardProps = {
    items: FeedbackItem[];
};

export function FeedbackThreadCard({ items }: FeedbackThreadCardProps) {
    return (
        <GlassCard className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-white">
                    Mentor Feedback Thread
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Threaded review notes, replies, and resolution state.
                </p>
            </div>

            <div className="space-y-4">
                {items.map((item) => {
                    const unresolved = item.state === "unresolved";

                    return (
                        <div
                            key={`${item.category}-${item.timestamp}`}
                            className={cn(
                                "rounded-[22px] border bg-white/[0.035] p-4",
                                unresolved ? "border-orange-500/25 shadow-[0_0_30px_rgba(243,112,33,0.08)]" : "border-white/10"
                            )}
                        >
                            <div className="flex gap-3">
                                <Avatar className="h-11 w-11 border border-orange-500/25">
                                    <AvatarFallback>
                                        {mentor.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-white">
                                                {mentor.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.timestamp} · {item.related}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant={unresolved ? "warning" : "success"}>
                                                {unresolved ? "Unresolved" : "Resolved"}
                                            </Badge>
                                            <Badge variant="outline">
                                                {item.category}
                                            </Badge>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm leading-6 text-white/90">
                                        {item.text}
                                    </p>

                                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                            <CornerDownRight className="h-4 w-4" />
                                            Team Reply
                                        </div>
                                        <p className="text-sm leading-6 text-white/85">
                                            {item.reply}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Button variant="soft" size="sm" className="rounded-xl">
                                            <MessageSquareText className="h-4 w-4" />
                                            Reply
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-xl text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            Mark Resolved
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
}
