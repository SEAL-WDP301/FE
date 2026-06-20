"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { getMentorFeedback } from "@/lib/api/mentor.api";
import { MentorPageHeader } from "../_components/mentor-page-header";
import {
  MentorEmptyState,
  MentorErrorState,
  MentorLoadingState,
} from "../_components/mentor-query-state";

export default function FeedbackManagementPage() {
  const query = useQuery({
    queryKey: ["mentorFeedback"],
    queryFn: getMentorFeedback,
  });

  if (query.isLoading) return <MentorLoadingState />;
  if (query.isError) return <MentorErrorState />;

  const feedbackItems = query.data || [];

  return (
    <div className="mx-auto max-w-[1300px] space-y-6">
      <MentorPageHeader
        title="Feedback Management"
        subtitle="Feedback associated with your assigned team submissions."
      />
      {feedbackItems.length === 0 ? (
        <MentorEmptyState
          title="No feedback yet"
          description="Feedback returned by the mentor API will appear here."
        />
      ) : (
        <div className="space-y-4">
          {feedbackItems.map((feedback) => {
            const teamId =
              feedback.teamId ||
              feedback.submission?.teamId ||
              feedback.team?.id;

            return (
              <GlassCard key={feedback.id} className="rounded-[24px] bg-card p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">
                      {feedback.team?.name ||
                        feedback.submission?.team?.name ||
                        `Submission ${feedback.submissionId || ""}`}
                    </h2>
                    <Badge
                      variant={
                        feedback.status === "published" ? "success" : "outline"
                      }
                    >
                      {feedback.status || "Feedback"}
                    </Badge>
                  </div>
                  <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
                    {feedback.content}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Updated{" "}
                    {feedback.updatedAt
                      ? new Date(feedback.updatedAt).toLocaleString()
                      : "at an unavailable time"}
                  </p>
                </div>

                {feedback.submissionId && teamId ? (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/mentor/teams/${teamId}/submissions/${feedback.submissionId}`}
                    >
                      View submission
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
