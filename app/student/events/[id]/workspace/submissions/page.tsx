"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "@/lib/api/workspace.api";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  UploadCloud,
  File,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Lock,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useSnackbar } from "notistack";

type RoundSubmissionEntry = {
  round: {
    id: number;
    roundNumber: number;
    name: string;
    status: string;
    submissionType: "file" | "github_link";
    submissionDeadline: string | null;
    maxFileSizeMb: number;
    isTrackSpecific: boolean;
  };
  teamRound: { status: string; score: number | null } | null;
  submission: {
    id: number;
    githubUrl?: string | null;
    fileUrl?: string | null;
    description?: string | null;
    updatedAt: string;
    history?: Array<{
      action: string;
      timestamp: string;
      userName?: string;
      fileName?: string;
    }>;
  } | null;
  canSubmit: boolean;
  canView: boolean;
  lockReason: string | null;
};

function useCountdown(targetDate: string | null) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function roundTabLabel(entry: RoundSubmissionEntry) {
  if (entry.submission) return "Submitted";
  if (entry.canSubmit) return "Active";
  if (entry.teamRound?.status === "eliminated") return "Eliminated";
  if (entry.round.status === "not_started") return "Locked";
  return "Closed";
}

export default function SubmissionsPage() {
  const params = useParams();
  const eventId = Number(params.id);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedRoundId, setSelectedRoundId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["workspace", eventId],
    queryFn: () => workspaceApi.getWorkspaceOverview(eventId),
  });

  const workspaceData = data?.data;
  const roundSubmissions: RoundSubmissionEntry[] =
    workspaceData?.roundSubmissions ?? [];
  const isLeader = workspaceData?.role === "leader";
  const teamStatus = workspaceData?.team?.status as string | undefined;
  const teamApproved =
    workspaceData?.canSubmit !== false && teamStatus === "approved";
  const assignedRepoUrl = workspaceData?.team?.githubRepoUrl as string | undefined;

  const selectedEntry = useMemo(
    () => roundSubmissions.find((entry) => entry.round.id === selectedRoundId),
    [roundSubmissions, selectedRoundId],
  );

  const selectedRound = selectedEntry?.round;
  const roundSubmission = selectedEntry?.submission ?? null;
  const roundCanSubmit = Boolean(selectedEntry?.canSubmit && teamApproved);
  const lockReason = selectedEntry?.lockReason;
  const submissionType = selectedRound?.submissionType;
  const isGithubRound = submissionType === "github_link";
  const isFileRound = submissionType === "file";
  const timeLeft = useCountdown(selectedRound?.submissionDeadline || null);
  const isDeadlinePassed = selectedRound?.submissionDeadline
    ? new Date() > new Date(selectedRound.submissionDeadline)
    : false;
  const formEditable = roundCanSubmit && isLeader && !isDeadlinePassed;

  useEffect(() => {
    if (!roundSubmissions.length) return;
    setSelectedRoundId((prev) => {
      if (prev && roundSubmissions.some((entry) => entry.round.id === prev)) {
        return prev;
      }
      return (
        workspaceData?.currentActiveRound?.id ??
        roundSubmissions.find((entry) => entry.submission)?.round.id ??
        roundSubmissions[0]?.round.id ??
        null
      );
    });
  }, [roundSubmissions, workspaceData?.currentActiveRound]);

  useEffect(() => {
    if (!selectedEntry) return;
    setFile(null);
    if (selectedEntry.submission) {
      setGithubUrl(
        selectedEntry.submission.githubUrl || assignedRepoUrl || "",
      );
      setDescription(selectedEntry.submission.description || "");
    } else {
      setGithubUrl(assignedRepoUrl || "");
      setDescription("");
    }
  }, [selectedEntry, assignedRepoUrl]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!selectedRound) throw new Error("No round selected");

      const formData = new FormData();
      formData.append("eventId", String(eventId));
      formData.append("roundId", String(selectedRound.id));
      if (description) formData.append("description", description);
      if (isFileRound && file) formData.append("file", file);
      if (isGithubRound && assignedRepoUrl) {
        formData.append("githubUrl", assignedRepoUrl);
      }

      return workspaceApi.submitProject(formData);
    },
    onSuccess: () => {
      enqueueSnackbar("Project submitted successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["workspace", eventId] });
      setFile(null);
    },
    onError: (err: any) => {
      const responseData = err?.response?.data;
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        responseData.errors.forEach((e: string) =>
          enqueueSnackbar(e, { variant: "error" }),
        );
      } else {
        enqueueSnackbar(responseData?.message || "Failed to submit", {
          variant: "error",
        });
      }
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!formEditable) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      const maxSize = selectedRound?.maxFileSizeMb || 20;
      if (droppedFile.size > maxSize * 1024 * 1024) {
        enqueueSnackbar(`File must be smaller than ${maxSize}MB`, {
          variant: "error",
        });
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const maxSize = selectedRound?.maxFileSizeMb || 20;
      if (selectedFile.size > maxSize * 1024 * 1024) {
        enqueueSnackbar(`File must be smaller than ${maxSize}MB`, {
          variant: "error",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const canSubmitPayload = isGithubRound
    ? Boolean(assignedRepoUrl || roundSubmission?.githubUrl)
    : Boolean(file || roundSubmission?.fileUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamApproved) {
      enqueueSnackbar("Your team must be approved before submitting", {
        variant: "warning",
      });
      return;
    }
    if (!roundCanSubmit) {
      enqueueSnackbar(lockReason || "This round is not open for submission", {
        variant: "warning",
      });
      return;
    }
    if (!canSubmitPayload) {
      enqueueSnackbar(
        isGithubRound
          ? "Your team repository is not ready yet. Wait for organizer approval."
          : "Please upload a file for this round",
        { variant: "warning" },
      );
      return;
    }
    submitMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!roundSubmissions.length) {
    return (
      <div className="mx-auto max-w-[1000px] flex items-center justify-center h-[50vh]">
        <GlassCard className="p-12 text-center rounded-[24px]">
          <AlertCircle className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Rounds Configured</h2>
          <p className="text-muted-foreground">
            This event does not have any submission rounds yet.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1000px] space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold">Project Submissions</h1>
          <p className="text-muted-foreground mt-1">
            Mỗi vòng thi có một submission riêng — chọn vòng bên dưới để nộp
            hoặc xem lại bài đã nộp.
          </p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {roundSubmissions.map((entry) => {
            const active = entry.round.id === selectedRoundId;
            const tabStatus = roundTabLabel(entry);
            return (
              <button
                key={entry.round.id}
                type="button"
                onClick={() => setSelectedRoundId(entry.round.id)}
                className={cn(
                  "shrink-0 min-w-[140px] rounded-2xl border px-4 py-3 text-left transition-all",
                  active
                    ? "border-orange-500/50 bg-orange-500/10 shadow-[0_0_20px_rgba(243,112,33,0.12)]"
                    : "border-border bg-card/50 hover:bg-muted/40",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Submission {entry.round.roundNumber}
                  </span>
                  {entry.canSubmit && (
                    <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  )}
                </div>
                <p className="font-semibold mt-1 truncate">{entry.round.name}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "mt-2 text-[10px]",
                    entry.submission &&
                      "border-green-500/30 text-green-500 bg-green-500/10",
                    entry.canSubmit &&
                      !entry.submission &&
                      "border-orange-500/30 text-orange-500 bg-orange-500/10",
                    !entry.canSubmit &&
                      !entry.submission &&
                      "border-border text-muted-foreground",
                  )}
                >
                  {tabStatus}
                </Badge>
              </button>
            );
          })}
        </div>
      </header>

      {selectedRound && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              {selectedRound.name}{" "}
              <span className="text-muted-foreground font-normal">
                (Round {selectedRound.roundNumber})
              </span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {roundCanSubmit
                ? "Vòng đang mở — bạn có thể nộp hoặc cập nhật bài."
                : lockReason || "Chỉ xem — không thể chỉnh sửa submission này."}
            </p>
          </div>

          {selectedRound.submissionDeadline && roundCanSubmit && (
            <div
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${
                isDeadlinePassed
                  ? "bg-red-500/10 border-red-500/30 text-red-500"
                  : "bg-orange-500/10 border-orange-500/30 text-orange-500"
              }`}
            >
              <Clock className="h-5 w-5" />
              {isDeadlinePassed ? (
                <span className="font-bold tracking-wider">DEADLINE PASSED</span>
              ) : (
                <div className="font-mono font-bold text-lg tracking-wider">
                  {timeLeft.days > 0 && <>{timeLeft.days}d : </>}
                  {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                  {String(timeLeft.minutes).padStart(2, "0")}m
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!isLeader && (
        <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-sm">Read-Only View</h4>
            <p className="text-sm mt-1 opacity-90">
              Only the Team Leader can submit or modify the project.
            </p>
          </div>
        </div>
      )}

      {!teamApproved && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-sm">Team chưa được duyệt</h4>
            <p className="text-sm mt-1 opacity-90">
              Organizer cần approve team trước khi bạn nộp bài và nhận link
              GitHub repo của team.
            </p>
          </div>
        </div>
      )}

      {!roundCanSubmit && lockReason && (
        <div className="bg-zinc-500/10 border border-zinc-500/20 text-muted-foreground p-4 rounded-2xl flex items-start gap-3">
          <Lock className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-sm text-foreground">Vòng khóa</h4>
            <p className="text-sm mt-1">{lockReason}</p>
          </div>
        </div>
      )}

      {isGithubRound && teamApproved && !assignedRepoUrl && roundCanSubmit && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-sm">Chưa có GitHub repo</h4>
            <p className="text-sm mt-1 opacity-90">
              Repo sẽ được tạo tự động khi team được approve.
            </p>
          </div>
        </div>
      )}

      {assignedRepoUrl && isGithubRound && (
        <GlassCard className="p-6 rounded-[24px] border border-orange-500/20 bg-orange-500/5">
          <div className="flex items-start gap-3">
            <FaGithub className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <h4 className="font-semibold">Assigned Team Repository</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Push code vào repo này rồi submit — hệ thống tự dùng link để
                chấm.
              </p>
              <a
                href={assignedRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-orange-500 hover:underline break-all mt-2 inline-block"
              >
                {assignedRepoUrl}
              </a>
            </div>
          </div>
        </GlassCard>
      )}

      {selectedRound && (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              {isFileRound && (
                <GlassCard className="p-8 rounded-[24px]">
                  <h2 className="text-xl font-semibold mb-4">Upload File</h2>
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                      isDragging
                        ? "border-orange-500 bg-orange-500/5"
                        : "border-border hover:bg-white/[0.02]"
                    } ${!formEditable ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => {
                      if (!formEditable) return;
                      fileInputRef.current?.click();
                    }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.zip,.rar"
                      disabled={!formEditable}
                    />

                    {file ? (
                      <div className="flex flex-col items-center">
                        <div className="h-16 w-16 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mb-4">
                          <File className="h-8 w-8" />
                        </div>
                        <p className="font-semibold text-foreground">
                          {file.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {formEditable && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-4 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFile(null);
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                    ) : roundSubmission?.fileUrl ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle2 className="h-10 w-10 text-green-500 mb-3" />
                        <p className="font-semibold">File đã nộp</p>
                        <a
                          href={roundSubmission.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-orange-500 hover:underline mt-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Xem file hiện tại
                        </a>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center pointer-events-none">
                        <div className="h-16 w-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-4">
                          <UploadCloud className="h-8 w-8" />
                        </div>
                        <p className="font-semibold text-foreground mb-1">
                          {formEditable
                            ? "Click or drag file to upload"
                            : "No file uploaded"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Max {selectedRound.maxFileSizeMb || 20}MB
                        </p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              )}

              <GlassCard className="p-8 rounded-[24px] space-y-6">
                {isGithubRound && (
                  <div>
                    <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <FaGithub className="h-4 w-4" />
                      Team GitHub Repository
                    </label>
                    <Input
                      className="bg-background border-border h-12"
                      value={assignedRepoUrl || githubUrl || ""}
                      readOnly
                      disabled
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Project Description / Notes
                  </label>
                  <Textarea
                    placeholder={
                      formEditable
                        ? "Notes for judges..."
                        : roundSubmission?.description || "No description"
                    }
                    className="bg-background border-border min-h-[120px] resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!formEditable}
                  />
                </div>
              </GlassCard>
            </div>

            <div className="space-y-6">
              <GlassCard className="p-6 rounded-[24px]">
                <h3 className="font-semibold mb-4 text-lg border-b border-border pb-4">
                  Submission {selectedRound.roundNumber}
                </h3>
                {roundSubmission ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Submitted</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(roundSubmission.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {roundSubmission.fileUrl && (
                      <Button
                        variant="outline"
                        className="w-full justify-start h-12"
                        asChild
                      >
                        <a
                          href={roundSubmission.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <File className="h-5 w-5 mr-2 text-orange-500" />
                          View Uploaded File
                        </a>
                      </Button>
                    )}

                    {roundSubmission.githubUrl && (
                      <Button
                        variant="outline"
                        className="w-full justify-start h-12"
                        asChild
                      >
                        <a
                          href={roundSubmission.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaGithub className="h-5 w-5 mr-2" />
                          View Repository
                        </a>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm">Chưa nộp bài cho vòng này.</p>
                  </div>
                )}
              </GlassCard>

              <GlassCard className="p-6 rounded-[24px]">
                <h3 className="font-semibold mb-4 text-lg border-b border-border pb-4">
                  Audit History
                </h3>
                {roundSubmission?.history &&
                Array.isArray(roundSubmission.history) &&
                roundSubmission.history.length > 0 ? (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    <div className="relative border-l-2 border-border/60 ml-2 pl-5 space-y-6 py-2">
                      {roundSubmission.history
                        .slice()
                        .reverse()
                        .slice(0, 5)
                        .map((log, index) => (
                          <div key={index} className="relative flex gap-4 text-sm">
                            <div
                              className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-background ${
                                index === 0
                                  ? "bg-orange-500"
                                  : "bg-muted-foreground/30"
                              }`}
                            />
                            <div className="flex-1">
                              <p className="font-semibold">
                                {log.action === "created"
                                  ? "Initial Submission"
                                  : "File Overwritten"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {new Date(log.timestamp).toLocaleString()} by{" "}
                                {log.userName || "Leader"}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                    {roundSubmission.history.length > 5 && (
                      <Dialog>
                        <DialogTrigger
                          render={
                            <Button
                              variant="outline"
                              className="w-full mt-4"
                              size="sm"
                            />
                          }
                        >
                          View all {roundSubmission.history.length} records
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Full Audit History</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 mt-4">
                            {roundSubmission.history
                              .slice()
                              .reverse()
                              .map((log, index) => (
                                <div
                                  key={index}
                                  className="text-sm border-b border-border/50 pb-4"
                                >
                                  <p className="font-medium">
                                    {log.action === "created"
                                      ? "Initial Submission"
                                      : "File Overwritten"}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {new Date(log.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <p className="text-sm">No history yet.</p>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>

          {roundCanSubmit && (
            <Button
              type="submit"
              variant="orange"
              className="w-full h-14 text-lg rounded-xl shadow-[0_0_20px_rgba(243,112,33,0.3)]"
              disabled={
                isDeadlinePassed ||
                submitMutation.isPending ||
                !isLeader ||
                !canSubmitPayload
              }
            >
              {submitMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="h-5 w-5 mr-2" />
              )}
              {roundSubmission ? "Resubmit Project" : "Submit Project"}
            </Button>
          )}
        </form>
      )}
    </div>
  );
}
