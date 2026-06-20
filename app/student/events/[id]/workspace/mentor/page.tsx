"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, UserRoundX } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import {
  getStudentAssignedMentor,
  getStudentMentorWorkspace,
} from "@/lib/api/mentor.api";
import { FeedbackStatusPanel } from "./components/feedback-status-panel";
import { FeedbackThreadCard } from "./components/feedback-thread-card";
import { MentorHeader } from "./components/mentor-header";
import { MentorHeroCard } from "./components/mentor-hero-card";

export default function MentorWorkspacePage() {
  const params = useParams();
  const eventId = Number(params.id);
  const workspaceQuery = useQuery({
    queryKey: ["studentMentorWorkspace", eventId],
    queryFn: () => getStudentMentorWorkspace(eventId),
  });
  const mentorQuery = useQuery({
    queryKey: ["studentAssignedMentor", eventId],
    queryFn: () => getStudentAssignedMentor(eventId),
  });

  if (workspaceQuery.isLoading || mentorQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (workspaceQuery.isError || mentorQuery.isError || !workspaceQuery.data) {
    return (
      <GlassCard className="rounded-[24px] p-10 text-center">
        <p className="font-semibold">Unable to load mentor workspace.</p>
      </GlassCard>
    );
  }

  const data = workspaceQuery.data;
  const mentor =
    mentorQuery.data || data.team?.mentorAssignments?.[0]?.mentor || null;
  const feedbackItems = [
    ...(data.feedback || []),
    ...(data.mentorFeedback || []),
    ...(data.latestSubmission?.feedback ? [data.latestSubmission.feedback] : []),
  ].filter(
    (feedback, index, allFeedback) =>
      allFeedback.findIndex((item) => item.id === feedback.id) === index
  );

  const resolvedCount = feedbackItems.filter(
    (feedback) =>
      feedback.status === "published" || feedback.status === "resolved"
  ).length;
  const pendingCount = feedbackItems.length - resolvedCount;
  const resolvedProgress =
    feedbackItems.length > 0
      ? Math.round((resolvedCount / feedbackItems.length) * 100)
      : 0;
  const feedbackStats = [
    { label: "Total feedback", value: String(feedbackItems.length) },
    { label: "Published", value: String(resolvedCount) },
    { label: "Pending", value: String(pendingCount) },
    {
      label: "Current round",
      value: data.currentActiveRound?.name || "N/A",
    },
  ];

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <MentorHeader
        hasMentor={Boolean(mentor)}
        feedbackCount={feedbackItems.length}
      />

      {!mentor ? (
        <GlassCard className="flex min-h-64 flex-col items-center justify-center rounded-[24px] p-8 text-center">
          <UserRoundX className="h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No mentor assigned</h2>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            The organizer has not assigned a mentor to this team for the current event.
          </p>
        </GlassCard>
      ) : (
        <>
          <MentorHeroCard
            mentor={mentor}
            feedbackCount={feedbackItems.length}
            roundName={data.currentActiveRound?.name}
          />

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <main>
              <FeedbackThreadCard items={feedbackItems} mentor={mentor} />
            </main>

            <aside>
              <FeedbackStatusPanel
                stats={feedbackStats}
                resolvedProgress={resolvedProgress}
              />
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
