import { ArrowRight, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

import type { SubmissionSummary } from "../mock-data";
import { SectionTitle } from "./section-title";

type SubmissionStatusCardProps = {
    submission: SubmissionSummary;
};

export function SubmissionStatusCard({ submission }: SubmissionStatusCardProps) {
    return (
        <GlassCard className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="mb-5 flex items-start justify-between gap-4">
                <SectionTitle icon={FileText} label="Submission Status" />
                <Badge variant="success">
                    {submission.status}
                </Badge>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Latest submission
                </p>
                <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-white">
                            {submission.fileName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Uploaded by {submission.uploadedBy} · {submission.lastUpdated}
                        </p>
                    </div>
                </div>
            </div>

            <Button
                variant="outline"
                className="mt-5 rounded-2xl border-white/10 bg-white/[0.03]"
            >
                View Submission
                <ArrowRight className="h-4 w-4" />
            </Button>
        </GlassCard>
    );
}
