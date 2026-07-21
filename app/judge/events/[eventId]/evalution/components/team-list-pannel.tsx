"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  PanelLeftClose,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type JudgeRoundSubmission,
  formatSubmissionLabel,
  mapScoringStatusLabel,
} from "@/lib/api/judge.api";

interface Props {
  teams: JudgeRoundSubmission[];
  selectedSubmissionId: number | null;
  onSelectSubmission: (submissionId: number) => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  isLoading?: boolean;
}

export function TeamListPanel({
  teams,
  selectedSubmissionId,
  onSelectSubmission,
  collapsed,
  setCollapsed,
  isLoading,
}: Props) {
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [trackId, setTrackId] = useState("all");
  const [sort, setSort] = useState("priority");

  const tracks = useMemo(
    () =>
      Array.from(
        new Map(teams.map((team) => [team.track.id, team.track])).values(),
      ),
    [teams],
  );

  const filteredTeams = useMemo(() => {
    const statusPriority = { in_review: 0, pending: 1, completed: 2 } as const;

    return teams.filter((team) => {
      const matchSearch = formatSubmissionLabel(team)
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      const label = mapScoringStatusLabel(team.scoringStatus);
      const matchStatus = status === "All" ? true : label === status;
      const matchTrack = trackId === "all" || String(team.track.id) === trackId;

      return matchSearch && matchStatus && matchTrack;
    }).sort((left, right) => {
      if (sort === "submission") {
        return (left.anonymousIndex ?? left.id) - (right.anonymousIndex ?? right.id);
      }
      if (sort === "score") {
        return (right.weightedScore ?? -1) - (left.weightedScore ?? -1);
      }
      return statusPriority[left.scoringStatus] - statusPriority[right.scoringStatus];
    });
  }, [search, sort, status, teams, trackId]);

  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? 0 : 340,
        opacity: collapsed ? 0 : 1,
        x: collapsed ? -40 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 28,
      }}
      className="hidden lg:flex shrink-0 overflow-hidden"
    >
      <GlassCard className="flex h-[calc(100vh-180px)] w-[340px] flex-col overflow-hidden">
        <div className="shrink-0 border-b border-white/10 p-5">
          <div className="mb-4 flex items-center justify-between">
          <div className="mb-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              Submissions
            </p>
            <h3 className="text-sm font-semibold text-foreground">
              {teams.length} assigned submissions
            </h3>
          </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => setCollapsed(true)}
            >
              <PanelLeftClose size={16} />
            </Button>
          </div>

          <div className="relative mb-3">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Submission #014..."
              className="pl-10"
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <select
              value={trackId}
              onChange={(event) => setTrackId(event.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-2 text-xs text-foreground"
              aria-label="Filter by track"
            >
              <option value="all">All tracks</option>
              {tracks.map((track) => (
                <option key={track.id} value={String(track.id)}>
                  {track.name}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-2 text-xs text-foreground"
              aria-label="Sort submissions"
            >
              <option value="priority">In progress first</option>
              <option value="submission">Submission number</option>
              <option value="score">Highest score</option>
            </select>
          </div>

          <div className="mt-3 flex rounded-xl bg-muted/20 p-1">
            {["All", "Pending", "In Review", "Completed"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium capitalize transition ${
                  status === item
                    ? "bg-orange-500 text-black"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {item === "In Review"
                  ? "Review"
                  : item === "Completed"
                    ? "Done"
                    : item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-24">
          {isLoading ? (
            <p className="p-4 text-sm text-muted-foreground">Loading teams...</p>
          ) : filteredTeams.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              No submissions are available for this round. Only teams that have submitted work are listed.
            </p>
          ) : (
            filteredTeams.map((team) => {
              const submissionId = team.submissionId ?? team.id;
              const active = selectedSubmissionId === submissionId;
              const statusLabel = mapScoringStatusLabel(team.scoringStatus);

              return (
                <button
                  key={submissionId}
                  type="button"
                  onClick={() => onSelectSubmission(submissionId)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? "border-orange-500 bg-orange-500/10 shadow-[0_0_25px_rgba(249,115,22,.25)]"
                      : "border-white/10 hover:border-orange-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 font-bold text-black">
                      #{String(team.anonymousIndex ?? submissionId).padStart(3, "0")}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 
                            className="font-semibold truncate"
                            title={`Scored ${team.scoredCriteria}/${team.totalCriteria} criteria`}
                          >
                            {formatSubmissionLabel(team)}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {team.track?.name}
                          </p>
                        </div>

                        <span className="text-lg font-bold text-green-600 dark:text-green-400 shrink-0">
                          {team.weightedScore != null
                            ? team.weightedScore.toFixed(1)
                            : "—"}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                          statusLabel === "Pending" ? "bg-amber-500/10 text-amber-500" :
                          statusLabel === "Completed" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                          "bg-blue-500/10 text-blue-500"
                        )}>
                          {statusLabel}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {team.scoredCriteria}/{team.totalCriteria} criteria
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </GlassCard>
    </motion.aside>
  );
}
