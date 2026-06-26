"use client";

import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, UserRoundX } from "lucide-react";
import { useEffect } from "react";
import { useSocket } from "@/lib/hooks/useSocket";

import { GlassCard } from "@/components/ui/glass-card";
import {
  getStudentAssignedMentor,
  getStudentMentorWorkspace,
  type StudentMentorWorkspaceData,
  type StudentWorkspaceFeedback,
  type StudentWorkspaceMentor,
  type StudentWorkspaceMentorProfile,
} from "@/lib/api/mentor.api";
import { FeedbackStatusPanel } from "./components/feedback-status-panel";
import { FeedbackThreadCard } from "./components/feedback-thread-card";
import { MentorHeader } from "./components/mentor-header";
import { MentorHeroCard } from "./components/mentor-hero-card";

function getFeedbackTime(feedback: StudentWorkspaceFeedback) {
  return (
    feedback.publishedAt ||
    feedback.updatedAt ||
    feedback.createdAt ||
    ""
  );
}

function normalizeFeedbackItems(data: StudentMentorWorkspaceData) {
  const feedbackByKey = new Map<string, StudentWorkspaceFeedback>();
  const pushFeedback = (
    feedback?: StudentWorkspaceFeedback | StudentWorkspaceFeedback[] | null,
    fallbackSubmission?: { id?: number; round?: { id?: number; name?: string } | null }
  ) => {
    const items = Array.isArray(feedback) ? feedback : feedback ? [feedback] : [];

    items.forEach((item, index) => {
      const normalizedItem: StudentWorkspaceFeedback = {
        ...item,
        submission: item.submission ||
          (fallbackSubmission
            ? {
              id: fallbackSubmission.id,
              round: fallbackSubmission.round,
            }
            : item.submission),
      };
      const key =
        normalizedItem.id !== undefined
          ? `id:${normalizedItem.id}`
          : `fallback:${normalizedItem.submission?.id || "unknown"}:${index}:${normalizedItem.content}`;

      feedbackByKey.set(key, {
        ...feedbackByKey.get(key),
        ...normalizedItem,
      });
    });
  };

  pushFeedback(data.feedback);
  pushFeedback(data.mentorFeedback);
  pushFeedback(data.mentorFeedbacks);
  pushFeedback(data.latestSubmission?.feedback, data.latestSubmission || undefined);
  pushFeedback(data.latestSubmission?.mentorFeedbacks, data.latestSubmission || undefined);

  (data.submissions || []).forEach((submission) => {
    pushFeedback(submission.feedback, submission);
    pushFeedback(submission.mentorFeedbacks, submission);
  });

  return Array.from(feedbackByKey.values()).sort(
    (left, right) =>
      new Date(getFeedbackTime(right)).getTime() -
      new Date(getFeedbackTime(left)).getTime()
  );
}

function mergeMentorProfiles(
  ...mentors: Array<StudentWorkspaceMentor | null | undefined>
) {
  return mentors.reduce<StudentWorkspaceMentor | null>((merged, mentor) => {
    const normalizedMentor = normalizeMentorProfile(mentor);
    if (!normalizedMentor) return merged;

    if (!merged) return normalizedMentor;

    return {
      ...normalizedMentor,
      ...merged,
      avatarUrl: merged.avatarUrl || normalizedMentor.avatarUrl,
      avatar_url: merged.avatar_url || normalizedMentor.avatar_url,
      stakeholderProfile: {
        ...normalizedMentor.stakeholderProfile,
        ...merged.stakeholderProfile,
      },
    };
  }, null);
}

function normalizeMentorProfile(
  mentor?: StudentWorkspaceMentor | null
): StudentWorkspaceMentor | null {
  if (!mentor) return null;

  const profile = mergeProfileFields(
    mentor.profile,
    mentor.stakeholder_profile,
    mentor.stakeholderProfile
  );

  return {
    ...mentor,
    stakeholderProfile: profile,
  };
}

function mergeProfileFields(
  ...profiles: Array<StudentWorkspaceMentorProfile | null | undefined>
) {
  return profiles.reduce<StudentWorkspaceMentorProfile | null>(
    (merged, profile) => {
      if (!profile) return merged;
      return {
        ...profile,
        ...merged,
        organization: merged?.organization || profile.organization,
        organizationName: merged?.organizationName || profile.organizationName,
      };
    },
    null
  );
}

export default function MentorWorkspacePage() {
  const params = useParams();
  const eventId = Number(params.id);
  const workspaceQuery = useQuery({
    queryKey: ["studentMentorWorkspace", eventId],
    queryFn: () => getStudentMentorWorkspace(eventId),
    enabled: Number.isFinite(eventId),
  });
  const mentorQuery = useQuery({
    queryKey: ["studentAssignedMentor", eventId],
    queryFn: () => getStudentAssignedMentor(eventId),
    enabled: Number.isFinite(eventId),
    retry: false,
  });
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  const teamId = workspaceQuery.data?.team?.id;

  useEffect(() => {
    if (!socket || !teamId) return;

    socket.emit("join_team_room", teamId);

    socket.on("feedback_updated", () => {
      queryClient.invalidateQueries({ queryKey: ["studentMentorWorkspace", eventId] });
    });

    return () => {
      socket.emit("leave_team_room", teamId);
      socket.off("feedback_updated");
    };
  }, [socket, teamId, queryClient, eventId]);

  if (workspaceQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (workspaceQuery.isError || !workspaceQuery.data) {
    return (
      <GlassCard className="rounded-[24px] p-10 text-center">
        <p className="font-semibold">Unable to load mentor workspace.</p>
      </GlassCard>
    );
  }

  const data = workspaceQuery.data;
  const mentor = normalizeMentorProfile(
    mergeMentorProfiles(
      mentorQuery.data,
      data.team?.mentorAssignments?.[0]?.mentor,
    ),
  );
  const feedbackItems = normalizeFeedbackItems(data);

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
        isConnected={isConnected}
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
