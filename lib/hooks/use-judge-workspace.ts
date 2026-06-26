"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  judgeApi,
  type JudgeAssignedEvent,
  type JudgeRoundSubmission,
} from "@/lib/api/judge.api";

export interface JudgeWorkspaceSubmission extends JudgeRoundSubmission {
  eventId: number;
  eventName: string;
  roundId: number;
  roundName: string;
  roundStatus: string;
}

export interface JudgeDashboardStats {
  pendingReviews: number;
  completedReviews: number;
  assignedTeams: number;
  averageScore: string | null;
  openRoundCount: number;
}

async function fetchWorkspaceSubmissions(
  events: JudgeAssignedEvent[],
): Promise<JudgeWorkspaceSubmission[]> {
  const rounds = events.flatMap((event) =>
    event.rounds.map((round) => ({ event, round })),
  );

  // Deduplicate rounds by roundId since a judge might be assigned to multiple tracks in the same round
  const uniqueRounds = Array.from(
    new Map(rounds.map((r) => [r.round.roundId, r])).values()
  );

  if (!uniqueRounds.length) return [];

  const batches = await Promise.all(
    uniqueRounds.map(async ({ event, round }) => {
      const submissions = await judgeApi.getRoundSubmissions(round.roundId);
      return submissions.map((submission) => ({
        ...submission,
        eventId: event.id,
        eventName: event.name,
        roundId: round.roundId,
        roundName: round.roundName,
        roundStatus: round.roundStatus,
      }));
    }),
  );

  return batches.flat();
}

export function useJudgeWorkspace() {
  const eventsQuery = useQuery({
    queryKey: ["judge", "events"],
    queryFn: judgeApi.getAssignedEvents,
  });

  const submissionsQuery = useQuery({
    queryKey: [
      "judge",
      "workspace-submissions",
      eventsQuery.data?.map((event) => event.id).join(",") ?? "",
    ],
    queryFn: () => fetchWorkspaceSubmissions(eventsQuery.data ?? []),
    enabled: !!eventsQuery.data?.length,
  });

  const submissions = submissionsQuery.data ?? [];

  const stats = useMemo<JudgeDashboardStats>(() => {
    const pendingReviews = submissions.filter(
      (item) =>
        item.scoringStatus === "pending" || item.scoringStatus === "in_review",
    ).length;
    const completedReviews = submissions.filter(
      (item) => item.scoringStatus === "completed",
    ).length;

    const scored = submissions.filter(
      (item) => item.weightedScore != null && item.scoringStatus === "completed",
    );
    const averageScore =
      scored.length > 0
        ? (
            scored.reduce((sum, item) => sum + (item.weightedScore ?? 0), 0) /
            scored.length
          ).toFixed(1)
        : null;

    const openRoundCount =
      eventsQuery.data?.reduce(
        (count, event) =>
          count + event.rounds.filter((round) => round.roundStatus === "open").length,
        0,
      ) ?? 0;

    return {
      pendingReviews,
      completedReviews,
      assignedTeams: submissions.length,
      averageScore,
      openRoundCount,
    };
  }, [eventsQuery.data, submissions]);

  const pendingSubmissions = useMemo(
    () =>
      submissions.filter(
        (item) =>
          item.scoringStatus === "pending" || item.scoringStatus === "in_review",
      ),
    [submissions],
  );

  const isLoading = eventsQuery.isLoading || submissionsQuery.isLoading;
  const isError = eventsQuery.isError || submissionsQuery.isError;

  return {
    events: eventsQuery.data ?? [],
    submissions,
    pendingSubmissions,
    stats,
    isLoading,
    isError,
    refetch: async () => {
      await eventsQuery.refetch();
      await submissionsQuery.refetch();
    },
  };
}
