"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, MessageSquareText, Paperclip, Send, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import type { ChatFeedbackMessage } from "../mock-data";

type TeamMentorChatCardProps = {
    messages: ChatFeedbackMessage[];
};

const quickPrompts = [
    "Clarify mentor feedback",
    "Request code review",
    "Ask for demo advice",
];

function getStatusVariant(status: ChatFeedbackMessage["status"]) {
    if (status === "Reviewed") return "success";
    if (status === "Needs action") return "warning";
    return "outline";
}

export function TeamMentorChatCard({ messages }: TeamMentorChatCardProps) {
    const [thread, setThread] = useState(messages);
    const [messageType, setMessageType] = useState<ChatFeedbackMessage["type"]>("Chat");
    const [draft, setDraft] = useState("");

    const pendingCount = useMemo(
        () => thread.filter((message) => message.status === "Needs action").length,
        [thread]
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const nextMessage = draft.trim();

        if (!nextMessage) return;

        setThread((currentThread) => [
            ...currentThread,
            {
                id: `team-message-${Date.now()}`,
                author: "Team Nova",
                initials: "TN",
                role: "Team",
                type: messageType,
                timestamp: "Just now",
                message: nextMessage,
                status: messageType === "Feedback" ? "Needs action" : undefined,
            },
        ]);
        setDraft("");
    }

    return (
        <GlassCard className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-orange-300">
                        <MessageSquareText className="h-5 w-5" />
                        <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                            Team x Mentor
                        </span>
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Chat & Feedback Workspace
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Discuss blockers, capture mentor feedback, and keep follow-up actions in one thread.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{thread.length} messages</Badge>
                    <Badge variant={pendingCount > 0 ? "warning" : "success"}>
                        {pendingCount} pending
                    </Badge>
                </div>
            </div>

            <div className="max-h-[430px] space-y-4 overflow-y-auto pr-1">
                {thread.map((item) => {
                    const fromTeam = item.role === "Team";

                    return (
                        <div
                            key={item.id}
                            className={cn(
                                "flex gap-3",
                                fromTeam && "flex-row-reverse"
                            )}
                        >
                            <Avatar className="h-10 w-10 border border-orange-500/25">
                                <AvatarFallback>{item.initials}</AvatarFallback>
                            </Avatar>

                            <div
                                className={cn(
                                    "max-w-[82%] rounded-[22px] border p-4",
                                    fromTeam
                                        ? "border-orange-500/20 bg-orange-500/10"
                                        : "border-border bg-white/[0.035]"
                                )}
                            >
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <p className="text-sm font-semibold text-foreground">
                                        {item.author}
                                    </p>
                                    <Badge variant={item.type === "Feedback" ? "default" : "outline"}>
                                        {item.type}
                                    </Badge>
                                    {item.status ? (
                                        <Badge variant={getStatusVariant(item.status)}>
                                            {item.status}
                                        </Badge>
                                    ) : null}
                                </div>

                                <p className="text-sm leading-6 text-foreground/90">
                                    {item.message}
                                </p>

                                <div
                                    className={cn(
                                        "mt-3 flex items-center gap-2 text-xs text-muted-foreground",
                                        fromTeam && "justify-end"
                                    )}
                                >
                                    {item.status === "Reviewed" ? (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                                    ) : null}
                                    <span>{item.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {quickPrompts.map((prompt) => (
                    <button
                        key={prompt}
                        type="button"
                        onClick={() => setDraft(prompt)}
                        className="flex h-10 items-center justify-center gap-2 rounded-2xl border border-border bg-white/[0.035] px-3 text-sm text-muted-foreground transition hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-foreground"
                    >
                        <Sparkles className="h-4 w-4 text-orange-300" />
                        <span className="truncate">{prompt}</span>
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 rounded-[22px] border border-border bg-white/[0.035] p-3">
                <div className="mb-3 flex flex-wrap gap-2">
                    {(["Chat", "Feedback"] as const).map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setMessageType(type)}
                            className={cn(
                                "h-9 rounded-xl px-3 text-sm font-medium transition",
                                messageType === type
                                    ? "bg-orange-500 text-foreground"
                                    : "bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <Textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Send a message or record feedback for the mentor..."
                    className="min-h-24 resize-none rounded-2xl border-border bg-muted"
                />

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <Button type="button" variant="ghost" className="rounded-xl text-muted-foreground">
                        <Paperclip className="h-4 w-4" />
                        Attach file
                    </Button>
                    <Button type="submit" variant="orange" className="rounded-xl">
                        <Send className="h-4 w-4" />
                        Send
                    </Button>
                </div>
            </form>
        </GlassCard>
    );
}
