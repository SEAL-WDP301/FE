"use client";

import { Users } from "lucide-react";

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
        <span className="text-sm text-muted-foreground">Đang tải danh sách team...</span>
      </GlassCard>
    );
  }

  if (teams.length === 0) {
    return (
      <GlassCard className="flex items-start gap-3 p-4">
        <Users className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        <div>
          <p className="font-medium">Chưa có team nào nộp bài</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Round này chưa có submission. Team phải nộp bài trước khi bạn chấm được.
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
              Chọn team để chấm
            </p>
            <p className="text-sm text-muted-foreground">
              {teams.length === 1
                ? "Round này có 1 bài nộp — mã Team 1"
                : `${teams.length} bài nộp — chọn Team 1, Team 2... bên dưới hoặc cột trái`}
            </p>
          </div>
        </div>

        <div className="w-full sm:min-w-[320px] sm:max-w-md">
          <Select
            value={selectedValue}
            onValueChange={(value) => onSelectSubmission(Number(value))}
          >
            <SelectTrigger className="h-11 w-full border-orange-500/30 bg-background/60">
              <SelectValue placeholder="Chọn team...">
                {selectedTeam ? (
                  <>
                    <span className="font-medium">{selectedTeam.teamName}</span>
                    {" · "}
                    {selectedTeam.track?.name}
                  </>
                ) : (
                  "Chọn team..."
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => {
                const submissionId = team.submissionId ?? team.id;
                const statusLabel = mapScoringStatusLabel(team.scoringStatus);

                return (
                  <SelectItem key={submissionId} value={String(submissionId)}>
                    <span className="font-medium">{team.teamName}</span>
                    {" · "}
                    {team.track?.name}
                    {" · "}
                    {statusLabel}
                    {team.weightedScore != null
                      ? ` · ${team.weightedScore.toFixed(1)} đ`
                      : ""}
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
