import { MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

import type { MentorFeedback } from "../mock-data";
import { SectionTitle } from "./section-title";

type MentorFeedbackCardProps = {
    feedback: MentorFeedback;
};

export function MentorFeedbackCard({ feedback }: MentorFeedbackCardProps) {
    return (
        <GlassCard className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <SectionTitle icon={MessageSquareText} label="Mentor Feedback" />

            <blockquote className="mt-5 rounded-[20px] border border-orange-500/15 bg-orange-500/5 p-5 text-sm leading-6 text-white/90">
                “{feedback.comment}”
            </blockquote>

            <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-white">
                        {feedback.mentorName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {feedback.note}
                    </p>
                </div>
                <Button variant="soft" className="rounded-2xl">
                    View Feedback
                </Button>
            </div>
        </GlassCard>
    );
}
