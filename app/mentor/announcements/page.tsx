import { Megaphone, Paperclip, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

import { MentorPageHeader } from "../_components/mentor-page-header";
import { announcements } from "../mock-data";

function priorityVariant(priority: string) {
    if (priority === "Urgent") return "destructive" as const;
    if (priority === "Important") return "warning" as const;
    return "outline" as const;
}

export default function AnnouncementsPage() {
    return (
        <div className="mx-auto max-w-[1200px] space-y-6">
            <MentorPageHeader
                title="Announcements"
                subtitle="Important updates, event reminders, and deadline alerts."
                actions={<Button variant="orange" className="rounded-2xl"><Plus className="h-4 w-4" />New Announcement</Button>}
            />

            <div className="space-y-4">
                {announcements.map((announcement) => (
                    <GlassCard key={announcement.title} className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
                        <div className="flex gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                                <Megaphone className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h2 className="text-lg font-semibold text-white">{announcement.title}</h2>
                                    <Badge variant={priorityVariant(announcement.priority)}>{announcement.priority}</Badge>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">{announcement.content}</p>
                                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                                    <span>{announcement.time}</span>
                                    <span className="flex items-center gap-1"><Paperclip className="h-3.5 w-3.5" />Attachment supported</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
