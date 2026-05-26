import { AlertTriangle, Clock3, Send } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";

import type { TeamQuestion } from "../mock-data";

type TeamQuestionsCardProps = {
    questions: TeamQuestion[];
};

function getBadgeVariant(status: TeamQuestion["status"]) {
    if (status === "Answered") return "success";
    if (status === "Urgent") return "destructive";
    return "warning";
}

export function TeamQuestionsCard({ questions }: TeamQuestionsCardProps) {
    return (
        <GlassCard className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-white">
                    Team Questions
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Ask mentor questions and track response status.
                </p>
            </div>

            <div className="mb-5 flex gap-3">
                <Input
                    placeholder="Ask your mentor something..."
                    className="h-11 rounded-2xl border-white/10 bg-white/[0.03]"
                />
                <Button variant="orange" className="h-11 rounded-2xl px-4">
                    <Send className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-4">
                {questions.map((question) => (
                    <div
                        key={question.question}
                        className="rounded-[20px] border border-white/10 bg-white/[0.035] p-4"
                    >
                        <div className="flex gap-3">
                            <Avatar className="h-10 w-10 border border-orange-500/25">
                                <AvatarFallback>
                                    {question.initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <p className="font-semibold text-white">
                                        {question.member}
                                    </p>
                                    <Badge variant={getBadgeVariant(question.status)}>
                                        {question.status}
                                    </Badge>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-white/90">
                                    {question.question}
                                </p>
                                <div className="mt-3 flex gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-muted-foreground">
                                    {question.status === "Waiting" ? (
                                        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-yellow-300" />
                                    ) : (
                                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" />
                                    )}
                                    {question.response}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
