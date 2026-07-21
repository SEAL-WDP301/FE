"use client";

import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import {
  type JudgeRoundSubmission,
  formatSubmissionLabel,
  mapScoringStatusLabel,
} from "@/lib/api/judge.api";

interface Props {
  teams: JudgeRoundSubmission[];
  selectedSubmissionId: number | null;
  onSelectSubmission: (submissionId: number) => void;
  isLoading?: boolean;
}

export function TeamSelectorBar({
  teams,
  selectedSubmissionId,
  onSelectSubmission,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <GlassCard className="flex items-center gap-3 p-4">
        <Users className="h-5 w-5 text-orange-500" />
        <span className="text-sm text-muted-foreground">Loading submissions...</span>
      </GlassCard>
    );
  }

  if (teams.length === 0) {
    return (
      <GlassCard className="flex items-start gap-3 p-4">
        <Users className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        <div>
          <p className="font-medium">No submissions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No team has submitted work for this round yet. A submission is required before evaluation can begin.
          </p>
        </div>
      </GlassCard>
    );
  }

  const selectedValue = selectedSubmissionId
    ? String(selectedSubmissionId)
    : String(teams[0].submissionId ?? teams[0].id);

  const selectedTeam = teams.find(t => String(t.submissionId ?? t.id) === selectedValue);

  return (
    <GlassCard className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              Select a submission to evaluate
            </p>
            <p className="text-sm text-muted-foreground">
              {teams.length === 1
                ? "This round has 1 submission"
                : `${teams.length} submissions — select a submission ID below or from the left panel`}
            </p>
          </div>
        </div>

        <div className="w-full sm:min-w-[320px] sm:max-w-md">
          <Select
            value={selectedValue}
            onValueChange={(value) => onSelectSubmission(Number(value))}
          >
            <SelectTrigger className="h-11 w-full border-orange-500/30 bg-background/60">
              <SelectValue placeholder="Select a submission...">
                {selectedTeam ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatSubmissionLabel(selectedTeam)}</span>
                    <span className="text-muted-foreground text-xs">·</span>
                    <span className="text-muted-foreground text-xs">{selectedTeam.track?.name}</span>
                    <span className="text-muted-foreground text-xs">·</span>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                      selectedTeam.scoringStatus === "pending" ? "bg-amber-500/10 text-amber-500" :
                      selectedTeam.scoringStatus === "completed" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                      "bg-blue-500/10 text-blue-500"
                    )}>
                      {mapScoringStatusLabel(selectedTeam.scoringStatus)}
                    </span>
                    {selectedTeam.weightedScore != null && (
                      <>
                        <span className="text-muted-foreground text-xs">·</span>
                        <span className="font-bold text-green-600 dark:text-green-400 text-sm">{selectedTeam.weightedScore.toFixed(1)} pts</span>
                      </>
                    )}
                  </div>
                ) : (
                  "Select a submission..."
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => {
                const submissionId = team.submissionId ?? team.id;
                const statusLabel = mapScoringStatusLabel(team.scoringStatus);
                const isPending = team.scoringStatus === "pending";
                const isCompleted = team.scoringStatus === "completed";

                return (
                  <SelectItem key={submissionId} value={String(submissionId)}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatSubmissionLabel(team)}</span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className="text-muted-foreground text-xs">{team.track?.name}</span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        isPending ? "bg-amber-500/10 text-amber-500" :
                        isCompleted ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                        "bg-blue-500/10 text-blue-500"
                      )}>
                        {statusLabel}
                      </span>
                      {team.weightedScore != null && (
                        <>
                          <span className="text-muted-foreground text-xs">·</span>
                          <span className="font-bold text-green-600 dark:text-green-400 text-sm">{team.weightedScore.toFixed(1)} pts</span>
                        </>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </GlassCard>
  );
}
