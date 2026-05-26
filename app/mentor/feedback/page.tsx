import { Copy, Edit, Plus, Send, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { MentorPageHeader } from "../_components/mentor-page-header";
import { PriorityBadge } from "../_components/status-badges";
import { feedbackList, mentorProfile } from "../mock-data";

export default function FeedbackManagementPage() {
    return (
        <div className="mx-auto max-w-[1500px] space-y-6">
            <MentorPageHeader
                title="Feedback Management"
                subtitle="Create, organize, and send structured mentor feedback."
                actions={<Button variant="orange" className="rounded-2xl"><Plus className="h-4 w-4" />Create Feedback</Button>}
            />

            <GlassCard className="rounded-[22px] bg-card p-4">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                    <Input placeholder="Search feedback..." className="h-11 rounded-2xl border-white/10 bg-white/[0.03]" />
                    <div className="flex flex-wrap gap-2">
                        {["Team", "Category", "Priority", "Status", "Date"].map((filter) => (
                            <Button key={filter} variant="outline" className="rounded-2xl border-white/10 bg-white/[0.03]">{filter}</Button>
                        ))}
                    </div>
                </div>
            </GlassCard>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
                <main className="grid gap-4 md:grid-cols-2">
                    {feedbackList.map((feedback) => (
                        <GlassCard key={feedback.title} className="rounded-[22px] bg-card p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm text-orange-300">{feedback.team}</p>
                                    <h2 className="mt-1 text-lg font-semibold text-white">{feedback.title}</h2>
                                    <p className="mt-2 text-sm text-muted-foreground">{feedback.category} · {feedback.date}</p>
                                </div>
                                <PriorityBadge priority={feedback.priority} />
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <Avatar className="h-8 w-8"><AvatarFallback>{mentorProfile.initials}</AvatarFallback></Avatar>
                                <Badge variant="outline">{feedback.status}</Badge>
                            </div>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {[Edit, Send, Trash2, Copy].map((Icon, index) => (
                                    <Button key={index} variant="ghost" size="icon-sm" className="rounded-xl text-orange-400 hover:bg-orange-500/10">
                                        <Icon className="h-4 w-4" />
                                    </Button>
                                ))}
                            </div>
                        </GlassCard>
                    ))}
                </main>

                <aside>
                    <GlassCard glow className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-white">Add Feedback Modal</h2>
                        <div className="mt-5 space-y-4">
                            {["Team selector", "Feedback category", "Title", "Priority level", "Visibility settings"].map((field) => (
                                <Input key={field} placeholder={field} className="h-11 rounded-2xl border-white/10 bg-white/[0.03]" />
                            ))}
                            {["Strengths", "Weaknesses", "Suggestions"].map((field) => (
                                <Textarea key={field} placeholder={field} className="min-h-20 rounded-2xl border-white/10 bg-white/[0.03]" />
                            ))}
                            <div className="flex gap-2">
                                <Button variant="outline" className="rounded-2xl border-white/10 bg-white/[0.03]">Save Draft</Button>
                                <Button variant="orange" className="rounded-2xl">Send Feedback</Button>
                            </div>
                        </div>
                    </GlassCard>
                </aside>
            </div>
        </div>
    );
}
