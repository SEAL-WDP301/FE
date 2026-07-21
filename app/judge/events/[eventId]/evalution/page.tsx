"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PanelLeftOpen,
} from "lucide-react";
import { useSnackbar } from "notistack";

import { TeamListPanel } from "./components/team-list-pannel";
import { TeamSelectorBar } from "./components/team-selector-bar";
import { TeamHeader } from "./components/team-header";
import { RoundTabs } from "./components/round-tabs";
import { SubmissionContentCard } from "./components/submission-content-card";
import { CriteriaScoring } from "./components/criteria-score";
import { ScoreSummary } from "./components/score-summary";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { judgeApi } from "@/lib/api/judge.api";

function buildScoreState(
  myScores: Array<{ criterionId: number; scoreValue: number | string; comment?: string | null }>,
) {
  const scores: Record<number, number> = {};
  const comments: Record<number, string> = {};

  myScores.forEach((entry) => {
    scores[entry.criterionId] = Number(entry.scoreValue);
    comments[entry.criterionId] = entry.comment ?? "";
  });

  return { scores, comments };
}

export default function EvaluationPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [collapsed, setCollapsed] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, string>>({});

  const eventIdParam = params.eventId as string;
  const roundIdParam = searchParams.get("roundId");
  const submissionIdParam = searchParams.get("submissionId");

  const { data: assignedEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["judge", "events"],
    queryFn: judgeApi.getAssignedEvents,
  });

  const selectedEvent = useMemo(() => {
    if (!assignedEvents.length) return null;
    if (eventIdParam) {
      return assignedEvents.find((e) => e.id === Number(eventIdParam)) ?? assignedEvents[0];
    }
    return assignedEvents[0];
  }, [assignedEvents, eventIdParam]);

  const eventRounds = useMemo(() => selectedEvent?.rounds ?? [], [selectedEvent]);

  const selectedRoundId = useMemo(() => {
    if (roundIdParam) {
      const parsed = Number(roundIdParam);
      if (eventRounds.some((r) => r.roundId === parsed)) return parsed;
    }
    return eventRounds[0]?.roundId ?? null;
  }, [eventRounds, roundIdParam]);

  const selectedRound = eventRounds.find((r) => r.roundId === selectedRoundId);

  useEffect(() => {
    if (!selectedEvent || !selectedRoundId) return;
    if (
      eventIdParam === String(selectedEvent.id) &&
      roundIdParam === String(selectedRoundId)
    ) {
      return;
    }
    const urlParams = new URLSearchParams();
    urlParams.set("roundId", String(selectedRoundId));
    router.replace(`/judge/events/${selectedEvent.id}/evalution?${urlParams.toString()}`, { scroll: false });
  }, [selectedEvent, selectedRoundId, eventIdParam, roundIdParam, router]);

  const {
    data: roundSubmissions = [],
    isLoading: submissionsLoading,
  } = useQuery({
    queryKey: ["judge", "round-submissions", selectedRoundId],
    queryFn: () => judgeApi.getRoundSubmissions(selectedRoundId!),
    enabled: !!selectedRoundId,
  });

  useEffect(() => {
    if (!roundSubmissions.length) {
      setSelectedSubmissionId(null);
      return;
    }
    const exists = roundSubmissions.some(
      (s) => (s.submissionId ?? s.id) === selectedSubmissionId,
    );
    if (!selectedSubmissionId || !exists) {
      const requestedId = Number(submissionIdParam);
      const requested = roundSubmissions.find(
        (submission) =>
          Number.isFinite(requestedId) &&
          (submission.submissionId ?? submission.id) === requestedId,
      );
      setSelectedSubmissionId(
        requested
          ? requested.submissionId ?? requested.id
          : roundSubmissions[0].submissionId ?? roundSubmissions[0].id,
      );
    }
  }, [roundSubmissions, selectedSubmissionId, submissionIdParam]);

  const {
    data: submissionDetail,
    isLoading: detailLoading,
  } = useQuery({
    queryKey: ["judge", "submission", selectedSubmissionId],
    queryFn: () => judgeApi.getSubmissionDetail(selectedSubmissionId!),
    enabled: !!selectedSubmissionId,
  });

  useEffect(() => {
    if (!submissionDetail) return;
    const next = buildScoreState(submissionDetail.myScores);
    setScores(next.scores);
    setComments(next.comments);
  }, [submissionDetail]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSubmissionId || !submissionDetail) {
        throw new Error("No submission selected");
      }

      const payload = {
        scores: submissionDetail.rubrics
          .filter((rubric) => scores[rubric.id] !== undefined)
          .map((rubric) => {
            return {
              criterionId: rubric.id,
              scoreValue: scores[rubric.id],
              comment: comments[rubric.id]?.trim() || undefined,
            };
          }),
      };

      if (!payload.scores.length) {
        throw new Error("Enter at least one criterion score before saving");
      }

      return judgeApi.submitScores(selectedSubmissionId, payload);
    },
    onSuccess: () => {
      enqueueSnackbar("Scores saved successfully", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["judge", "submission", selectedSubmissionId] });
      queryClient.invalidateQueries({ queryKey: ["judge", "round-submissions", selectedRoundId] });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (error instanceof Error ? error.message : "Failed to save scores");
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  const handleSelectRound = useCallback(
    (roundId: number) => {
      if (!selectedEvent) return;
      const urlParams = new URLSearchParams();
      urlParams.set("roundId", String(roundId));
      router.replace(`/judge/events/${selectedEvent.id}/evalution?${urlParams.toString()}`);
      setSelectedSubmissionId(null);
    },
    [router, selectedEvent],
  );

  const handleSelectSubmission = useCallback(
    (submissionId: number) => {
      setSelectedSubmissionId(submissionId);
      if (!selectedEvent || !selectedRoundId) return;
      const urlParams = new URLSearchParams();
      urlParams.set("roundId", String(selectedRoundId));
      urlParams.set("submissionId", String(submissionId));
      router.replace(
        `/judge/events/${selectedEvent.id}/evalution?${urlParams.toString()}`,
        { scroll: false },
      );
    },
    [router, selectedEvent, selectedRoundId],
  );

  const selectedSubmissionIndex = roundSubmissions.findIndex(
    (submission) =>
      (submission.submissionId ?? submission.id) === selectedSubmissionId,
  );
  const previousSubmission =
    selectedSubmissionIndex > 0 ? roundSubmissions[selectedSubmissionIndex - 1] : null;
  const nextSubmission =
    selectedSubmissionIndex >= 0 && selectedSubmissionIndex < roundSubmissions.length - 1
      ? roundSubmissions[selectedSubmissionIndex + 1]
      : null;

  const roundStatus = submissionDetail?.round.status;
  const submissionDeadline = submissionDetail?.round.submissionDeadline;
  const scoringLocked =
    !roundStatus ||
    roundStatus === "results_published" ||
    roundStatus === "not_started" ||
    (roundStatus === "open" &&
      (!submissionDeadline || new Date(submissionDeadline) > new Date()));

  if (eventsLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!assignedEvents.length) {
    return (
      <GlassCard className="p-10 text-center">
        <AlertCircle className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
        <h2 className="text-xl font-semibold">No assigned events</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You have not been assigned as a judge for any event.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mt-3 text-5xl font-bold tracking-tight text-muted-foreground">
          Evaluation
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {selectedEvent?.name} — select a round and submission, review the work, then score it using the rubric.
        </p>
      </div>

      <RoundTabs
        rounds={eventRounds}
        selectedRoundId={selectedRoundId}
        onSelectRound={handleSelectRound}
      />

      <TeamSelectorBar
        teams={roundSubmissions}
        selectedSubmissionId={selectedSubmissionId}
        onSelectSubmission={handleSelectSubmission}
        isLoading={submissionsLoading}
      />

      <div className="mt-2 flex h-[calc(100vh-220px)] gap-5 overflow-hidden">
        <TeamListPanel
          teams={roundSubmissions}
          selectedSubmissionId={selectedSubmissionId}
          onSelectSubmission={handleSelectSubmission}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isLoading={submissionsLoading}
        />

        <main className="flex-1 overflow-y-auto pr-2">
          {collapsed && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              type="button"
              onClick={() => setCollapsed(false)}
              className="mb-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-card/40 px-5 py-3 hover:border-orange-500/40 hover:bg-orange-500/10"
            >
              <PanelLeftOpen size={16} />
              Show teams
            </motion.button>
          )}

          {detailLoading && selectedSubmissionId ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={!previousSubmission}
                  onClick={() =>
                    previousSubmission &&
                    handleSelectSubmission(
                      previousSubmission.submissionId ?? previousSubmission.id,
                    )
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground">
                  {selectedSubmissionIndex >= 0
                    ? `${selectedSubmissionIndex + 1}/${roundSubmissions.length}`
                    : `0/${roundSubmissions.length}`}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  disabled={!nextSubmission}
                  onClick={() =>
                    nextSubmission &&
                    handleSelectSubmission(nextSubmission.submissionId ?? nextSubmission.id)
                  }
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <TeamHeader
                detail={submissionDetail}
                roundName={selectedRound?.roundName}
              />

              <div className="mt-8 space-y-8">
                <SubmissionContentCard detail={submissionDetail} />
                <div className="mt-8">
                  <h2 className="mb-6 text-3xl font-bold">Rubric Evaluation</h2>
                  
                  {scoringLocked && (
                    <div className="mb-6 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-2xl flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm">Scoring is currently locked</h4>
                        <p className="text-sm mt-1 opacity-90">
                          {roundStatus === "not_started" && "This round has not started yet."}
                          {roundStatus === "results_published" && "Results for this round have been published, so scores can no longer be changed."}
                          {roundStatus === "open" && "This round is still accepting submissions. Judges can score only after the submission deadline or when the round moves to Closed/Judging."}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-8 xl:grid-cols-12">
                    <div className="xl:col-span-8">
                      <CriteriaScoring
                        rubrics={submissionDetail?.rubrics ?? []}
                        scores={scores}
                        comments={comments}
                        disabled={scoringLocked || saveMutation.isPending}
                        onScoreChange={(id, value) =>
                          setScores((prev) => ({ ...prev, [id]: value }))
                        }
                        onCommentChange={(id, value) =>
                          setComments((prev) => ({ ...prev, [id]: value }))
                        }
                      />
                    </div>

                    <div className="xl:col-span-4">
                      <ScoreSummary
                        rubrics={submissionDetail?.rubrics ?? []}
                        scores={scores}
                        scoringStatus={submissionDetail?.scoringStatus}
                        isSaving={saveMutation.isPending}
                        disabled={scoringLocked}
                        onSubmit={() => saveMutation.mutate()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
