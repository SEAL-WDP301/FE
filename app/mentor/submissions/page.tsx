import { Download, Eye, MessageSquarePlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Textarea } from "@/components/ui/textarea";

import { MentorPageHeader } from "../_components/mentor-page-header";
import { submissions } from "../mock-data";

export default function SubmissionsReviewPage() {
    return (
        <div className="mx-auto max-w-[1500px] space-y-6">
            <MentorPageHeader title="Submissions Review" subtitle="Review team deliverables, readiness, comments, and approval status." />

            <GlassCard className="rounded-[22px] bg-card p-4">
                <div className="flex flex-wrap gap-2">
                    {["Event", "Round", "Status", "Submission type"].map((filter) => (
                        <Button key={filter} variant="outline" className="rounded-2xl border-border bg-muted/40">{filter}</Button>
                    ))}
                </div>
            </GlassCard>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
                <main className="grid gap-4 md:grid-cols-2">
                    {submissions.map((submission) => (
                        <GlassCard key={`${submission.team}-${submission.title}`} className="rounded-[22px] bg-card p-5">
                            <div className="mb-4 h-28 rounded-[20px] border border-border bg-gradient-to-br from-orange-500/15 to-muted/40" />
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm text-primary">{submission.team}</p>
                                    <h2 className="mt-1 font-semibold text-foreground">{submission.title}</h2>
                                    <p className="mt-2 text-sm text-muted-foreground">{submission.round} · {submission.time} · {submission.type}</p>
                                </div>
                                <Badge variant={submission.status === "Ready" ? "success" : submission.status === "Needs Revision" ? "destructive" : "default"}>
                                    {submission.status}
                                </Badge>
                            </div>
                            <div className="mt-5 flex flex-wrap gap-2">
                                <Button variant="orange" size="sm" className="rounded-xl"><Eye className="h-4 w-4" />View</Button>
                                <Button variant="soft" size="sm" className="rounded-xl"><MessageSquarePlus className="h-4 w-4" />Add Review</Button>
                                <Button variant="ghost" size="sm" className="rounded-xl text-primary"><Download className="h-4 w-4" />Download</Button>
                            </div>
                        </GlassCard>
                    ))}
                </main>

                <aside>
                    <GlassCard glow className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-foreground">Review Panel</h2>
                        <div className="mt-5 space-y-4">
                            <Textarea placeholder="Mentor comments..." className="min-h-24 rounded-2xl border-border bg-muted/40" />
                            <Textarea placeholder="Improvement suggestions..." className="min-h-24 rounded-2xl border-border bg-muted/40" />
                            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
                                <p className="text-sm font-semibold text-foreground">Readiness indicator</p>
                                <p className="mt-1 text-xs text-muted-foreground">Ready after architecture clarification.</p>
                            </div>
                            <Button variant="orange" className="w-full rounded-2xl">Submit Review</Button>
                        </div>
                    </GlassCard>
                </aside>
            </div>
        </div>
    );
}
