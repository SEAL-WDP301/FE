"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  ExternalLink,
  FileText,
  Loader2,
  MessageSquareText,
  PencilLine,
  Save,
  Trash2,
} from "lucide-react";
import { enqueueSnackbar } from "notistack";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Textarea } from "@/components/ui/textarea";
import {
  createMentorSubmissionFeedback,
  deleteMentorFeedback,
  getMentorSubmission,
  updateMentorFeedback,
} from "@/lib/api/mentor.api";
import { MentorPageHeader } from "../../../../_components/mentor-page-header";
import {
  MentorEmptyState,
  MentorErrorState,
  MentorLoadingState,
} from "../../../../_components/mentor-query-state";

export default function MentorSubmissionDetailPage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const teamId = params.teamId as string;
  const submissionId = params.submissionId as string;
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("draft");

  const query = useQuery({
    queryKey: ["mentorSubmission", submissionId],
    queryFn: () => getMentorSubmission(submissionId),
  });

  useEffect(() => {
    if (!query.data) return;

    setFeedbackContent(query.data.feedback?.content || "");
    setFeedbackStatus(query.data.feedback?.status || "draft");
  }, [query.data]);

  const createFeedbackMutation = useMutation({
    mutationFn: () =>
      createMentorSubmissionFeedback(submissionId, {
        content: feedbackContent.trim(),
        status: feedbackStatus,
      }),
    onSuccess: () => {
      enqueueSnackbar("Feedback created successfully.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["mentorSubmission", submissionId] });
      queryClient.invalidateQueries({ queryKey: ["mentorSubmissions"] });
      queryClient.invalidateQueries({ queryKey: ["mentorFeedback"] });
    },
    onError: (error: unknown) => {
      enqueueSnackbar(
        isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message || "Failed to create feedback."
          : "Failed to create feedback.",
        { variant: "error" }
      );
    },
  });

  const updateFeedbackMutation = useMutation({
    mutationFn: (feedbackId: number) =>
      updateMentorFeedback(feedbackId, {
        content: feedbackContent.trim(),
        status: feedbackStatus,
      }),
    onSuccess: () => {
      enqueueSnackbar("Feedback updated successfully.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["mentorSubmission", submissionId] });
      queryClient.invalidateQueries({ queryKey: ["mentorSubmissions"] });
      queryClient.invalidateQueries({ queryKey: ["mentorFeedback"] });
    },
    onError: (error: unknown) => {
      enqueueSnackbar(
        isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message || "Failed to update feedback."
          : "Failed to update feedback.",
        { variant: "error" }
      );
    },
  });

  const deleteFeedbackMutation = useMutation({
    mutationFn: (feedbackId: number) => deleteMentorFeedback(feedbackId),
    onSuccess: () => {
      enqueueSnackbar("Feedback deleted successfully.", { variant: "success" });
      setFeedbackContent("");
      setFeedbackStatus("draft");
      queryClient.invalidateQueries({ queryKey: ["mentorSubmission", submissionId] });
      queryClient.invalidateQueries({ queryKey: ["mentorSubmissions"] });
      queryClient.invalidateQueries({ queryKey: ["mentorFeedback"] });
    },
    onError: (error: unknown) => {
      enqueueSnackbar(
        isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message || "Failed to delete feedback."
          : "Failed to delete feedback.",
        { variant: "error" }
      );
    },
  });

  if (query.isLoading) return <MentorLoadingState />;
  if (query.isError || !query.data) return <MentorErrorState />;

  const submission = query.data;
  const existingFeedback = submission.feedback;
  const isSubmitting =
    createFeedbackMutation.isPending ||
    updateFeedbackMutation.isPending ||
    deleteFeedbackMutation.isPending;
  const isFeedbackValid = feedbackContent.trim().length > 0;
  const hasResources = Boolean(
    submission.fileUrl ||
    submission.githubUrl ||
    submission.demoUrl ||
    submission.slideUrl
  );

  return (
    <div className="mx-auto max-w-[1300px] space-y-6">
      <MentorPageHeader
        title={submission.round?.name || "Submission Detail"}
        subtitle={`${submission.team?.name || `Team ${submission.teamId}`} · Read-only submission details.`}
        actions={
          <Button asChild variant="outline">
            <Link href={`/mentor/teams/${teamId}`}>Back to team</Link>
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <main className="space-y-5">
          <GlassCard className="rounded-[24px] bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Submitted resources</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {submission.updatedAt
                    ? `Updated ${new Date(submission.updatedAt).toLocaleString()}`
                    : "Update time unavailable"}
                </p>
              </div>
              <Badge variant="outline" className="capitalize">
                {submission.status || "submitted"}
              </Badge>
            </div>

            {hasResources ? (
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {submission.fileUrl ? (
                  <ResourceLink
                    label="Submitted file"
                    href={submission.fileUrl}
                    file
                  />
                ) : null}
                {submission.githubUrl ? (
                  <ResourceLink
                    label="Git repository"
                    href={submission.githubUrl}
                  />
                ) : null}
                {submission.demoUrl ? (
                  <ResourceLink label="Demo" href={submission.demoUrl} />
                ) : null}
                {submission.slideUrl ? (
                  <ResourceLink
                    label="Presentation slides"
                    href={submission.slideUrl}
                  />
                ) : null}
              </div>
            ) : (
              <div className="mt-5">
                <MentorEmptyState
                  title="No submitted resources"
                  description="The API response does not contain a file or external URL."
                />
              </div>
            )}

            {submission.description ? (
              <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Team notes
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                  {submission.description}
                </p>
              </div>
            ) : null}
          </GlassCard>
        </main>

        <GlassCard className="h-fit rounded-[24px] bg-card p-6 xl:sticky xl:top-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Mentor feedback</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Create, update, or delete feedback for this submission.
              </p>
            </div>
            <Badge
              variant={
                submission.feedback?.status === "published" ? "success" : "outline"
              }
            >
              {submission.feedback?.status || "None"}
            </Badge>
          </div>

          <div className="mt-5 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </label>
            <select
              value={feedbackStatus}
              onChange={(event) => setFeedbackStatus(event.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-muted/20 px-3 text-sm outline-none focus:border-ring"
              disabled={isSubmitting}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="resolved">Resolved</option>
            </select>

            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Content
            </label>
            <Textarea
              value={feedbackContent}
              onChange={(event) => setFeedbackContent(event.target.value)}
              placeholder="Add actionable feedback for this submission..."
              className="min-h-36 rounded-2xl border-border bg-muted/20 leading-6"
              disabled={isSubmitting}
            />

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {existingFeedback?.id ? (
                <>
                  <Button
                    variant="orange"
                    onClick={() => updateFeedbackMutation.mutate(existingFeedback.id)}
                    disabled={!isFeedbackValid || isSubmitting}
                  >
                    {updateFeedbackMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Update feedback
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFeedbackContent(existingFeedback.content || "");
                      setFeedbackStatus(existingFeedback.status || "draft");
                    }}
                    disabled={isSubmitting}
                  >
                    <PencilLine className="h-4 w-4" />
                    Reset
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteFeedbackMutation.mutate(existingFeedback.id)}
                    disabled={isSubmitting}
                  >
                    {deleteFeedbackMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  variant="orange"
                  onClick={() => createFeedbackMutation.mutate()}
                  disabled={!isFeedbackValid || isSubmitting}
                >
                  {createFeedbackMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <MessageSquareText className="h-4 w-4" />
                      Create feedback
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function ResourceLink({
  label,
  href,
  file = false,
}: {
  label: string;
  href: string;
  file?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-4 transition-colors hover:border-orange-500/40"
    >
      <span className="flex items-center gap-2 font-medium">
        {file ? (
          <FileText className="h-4 w-4 text-primary" />
        ) : (
          <ExternalLink className="h-4 w-4 text-primary" />
        )}
        {label}
      </span>
      <ExternalLink className="h-4 w-4 text-muted-foreground" />
    </a>
  );
}
