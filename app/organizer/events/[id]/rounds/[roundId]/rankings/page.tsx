"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { motion, AnimatePresence } from "framer-motion";
import { axiosClient } from "@/lib/axios";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy, Medal, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, TrendingUp, TrendingDown, Minus,
  BarChart3, Users, Loader2, Gavel, Send
} from "lucide-react";
import {
  getDetailedRoundRankings,
  publishRoundResults,
  DetailedRankedTeamEntry,
} from "@/lib/api/organizer-events.api";
import { format } from "date-fns";

const ANOMALY_THRESHOLD = 1.5;

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 ring-2 ring-yellow-500/40">
      <Trophy className="w-4 h-4 text-yellow-500" />
    </span>
  );
  if (rank === 2) return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-400/20 ring-2 ring-slate-400/40">
      <Medal className="w-4 h-4 text-slate-400" />
    </span>
  );
  if (rank === 3) return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-700/20 ring-2 ring-orange-700/40">
      <Medal className="w-4 h-4 text-orange-700" />
    </span>
  );
  return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted ring-1 ring-border text-sm font-bold text-muted-foreground">
      {rank}
    </span>
  );
}

function DeviationBadge({ deviation }: { deviation: number }) {
  const isAnomaly = Math.abs(deviation) >= ANOMALY_THRESHOLD;
  const isPositive = deviation > 0;
  const isZero = Math.abs(deviation) < 0.01;

  if (isZero) return (
    <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
      <Minus className="w-3 h-3" /> 0.00
    </span>
  );
  return (
    <span className={`flex items-center gap-1 text-xs font-bold ${isAnomaly ? "text-red-500" : isPositive ? "text-emerald-500" : "text-blue-400"}`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? "+" : ""}{deviation.toFixed(2)}
      {isAnomaly && <AlertTriangle className="w-3 h-3 text-red-500 ml-0.5" />}
    </span>
  );
}

function TeamRow({ entry, topN, rank }: { entry: DetailedRankedTeamEntry; topN: number; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const willAdvance = rank <= topN;
  const hasAnomalous = entry.judges.some(j => Math.abs(j.deviationFromAverage) >= ANOMALY_THRESHOLD);

  return (
    <div className="border border-border rounded-xl overflow-hidden mb-3 transition-all">
      {/* Team Header Row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/20 ${
          willAdvance ? "bg-emerald-500/5 border-b border-emerald-500/10" : "bg-card"
        }`}
      >
        <RankBadge rank={rank} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-base truncate">{entry.teamName}</span>
            {willAdvance && (
              <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/10 text-[10px] px-1.5 py-0">
                <CheckCircle2 className="w-3 h-3 mr-1" />Advances
              </Badge>
            )}
            {hasAnomalous && (
              <Badge variant="outline" className="text-red-500 border-red-500/30 bg-red-500/10 text-[10px] px-1.5 py-0">
                <AlertTriangle className="w-3 h-3 mr-1" />Anomalous Grading
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Track: {entry.trackName} · Submitted: {format(new Date(entry.submittedAt), "MMM dd, HH:mm")}
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-2xl font-bold tabular-nums text-foreground">
            {entry.finalScore !== null ? entry.finalScore.toFixed(2) : "—"}
          </div>
          <div className="text-[10px] text-muted-foreground">/ 10.00</div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground text-sm shrink-0">
          <Gavel className="w-4 h-4" />
          <span>{entry.judges.length} judge{entry.judges.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="text-muted-foreground ml-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Analytics */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-5 grid md:grid-cols-2 gap-6 bg-muted/5 border-t border-border">
              {/* Criteria Breakdown */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> Criteria Averages
                </h4>
                <div className="space-y-3">
                  {entry.criteriaAverages.map(ca => (
                    <div key={ca.criterionId}>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="font-medium truncate max-w-[180px]">{ca.name}</span>
                        <span className="tabular-nums font-bold text-foreground ml-2 shrink-0">
                          {ca.averageScore.toFixed(2)} <span className="text-muted-foreground font-normal text-xs">/ {ca.maxScore}</span>
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((ca.averageScore / ca.maxScore) * 100, 100)}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        />
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">Weight: {ca.weight}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Judge Matrix */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4" /> Judge Scores & Deviation
                </h4>
                {entry.judges.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No completed scores yet.</p>
                ) : (
                  <div className="space-y-3">
                    {entry.judges.map(j => {
                      const isAnomaly = Math.abs(j.deviationFromAverage) >= ANOMALY_THRESHOLD;
                      return (
                        <div key={j.judgeId} className={`rounded-lg p-3 border ${isAnomaly ? "border-red-500/30 bg-red-500/5" : "border-border bg-muted/20"}`}>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-sm font-semibold truncate max-w-[150px]">{j.judgeName}</span>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-sm font-bold tabular-nums">{j.totalGivenScore.toFixed(2)}</span>
                              <DeviationBadge deviation={j.deviationFromAverage} />
                            </div>
                          </div>
                          {j.comment && (
                            <p className="text-[11px] text-muted-foreground italic border-t border-border/50 pt-2 mt-1 line-clamp-2">
                              "{j.comment}"
                            </p>
                          )}
                          {/* Per-criteria breakdown */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {j.criteriaScores.map(cs => (
                              <span key={cs.criterionId} className="text-[10px] bg-background border border-border rounded px-1.5 py-0.5 tabular-nums">
                                C{cs.criterionId}: {Number(cs.scoreValue).toFixed(1)}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RankingsPage() {
  const params = useParams();
  const eventId = params.id as string;
  const roundId = params.roundId as string;
  const queryClient = useQueryClient();

  const [selectedTrackIdx, setSelectedTrackIdx] = useState(0);
  const [topN, setTopN] = useState(3);
  const [publishTopN, setPublishTopN] = useState(3);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["detailedRankings", eventId, roundId],
    queryFn: () => getDetailedRoundRankings(eventId, roundId),
    refetchOnWindowFocus: false,
  });

  const { mutate: publish, isPending: isPublishing } = useMutation({
    mutationFn: () => publishRoundResults(eventId, roundId, publishTopN),
    onSuccess: () => {
      enqueueSnackbar("Round results published successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["detailedRankings", eventId, roundId] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to publish results";
      enqueueSnackbar(msg, { variant: "error" });
    },
  });

  const round = data?.round;
  const tracks = data?.tracks ?? [];
  const selectedTrack = tracks[selectedTrackIdx];
  const entries = selectedTrack?.entries ?? [];

  const roundStatusColor: Record<string, string> = {
    not_started: "text-muted-foreground",
    open: "text-blue-500",
    closed: "text-orange-500",
    results_published: "text-emerald-500",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-500" />
            Rankings & Analytics
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Chi tiết điểm chấm, độ lệch giám khảo, và xếp hạng đội thi.
          </p>
          {round && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium">{round.name}</span>
              <Badge variant="outline" className={`text-xs ${roundStatusColor[round.status] ?? ""}`}>
                {round.status?.replace(/_/g, " ")}
              </Badge>
            </div>
          )}
        </div>

        {/* Publish Panel */}
        {round?.status === "closed" && (
          <GlassCard className="p-4 flex items-center gap-3 shrink-0">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Top N lọt vòng / Track</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPublishTopN(Math.max(1, publishTopN - 1))}
                  className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted text-sm font-bold"
                >−</button>
                <span className="text-lg font-bold w-6 text-center tabular-nums">{publishTopN}</span>
                <button
                  onClick={() => setPublishTopN(publishTopN + 1)}
                  className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted text-sm font-bold"
                >+</button>
              </div>
            </div>
            <Button
              onClick={() => publish()}
              disabled={isPublishing}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
            >
              {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Publish Results
            </Button>
          </GlassCard>
        )}
        {round?.status === "results_published" && (
          <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5" />
            Results have been published
          </div>
        )}
      </div>

      {/* Track Tabs */}
      {tracks.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {tracks.map((t, idx) => (
            <button
              key={t.track.id}
              onClick={() => setSelectedTrackIdx(idx)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                idx === selectedTrackIdx
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {t.track.name}
              <span className="ml-2 text-xs opacity-60">({t.entries.length})</span>
            </button>
          ))}
        </div>
      )}

      {/* Top-N Highlight Control */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Preview Top</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setTopN(Math.max(1, topN - 1))} className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-muted font-bold">−</button>
          <span className="font-bold text-foreground w-5 text-center">{topN}</span>
          <button onClick={() => setTopN(topN + 1)} className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-muted font-bold">+</button>
        </div>
        <span>teams as advancing</span>
        <span className="text-[10px] text-muted-foreground/60">(for display only, doesn't affect publish)</span>
      </div>

      {/* Rankings List */}
      <GlassCard className="p-6 rounded-[24px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading rankings...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500 text-sm">
            Failed to load rankings data.
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            No teams with completed submissions found for this track.
          </div>
        ) : (
          <div>
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mb-5 pb-4 border-b border-border text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Advance to next round</span>
              <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Anomalous grading (deviation ≥ {ANOMALY_THRESHOLD})</span>
              <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Above average</span>
              <span className="flex items-center gap-1"><TrendingDown className="w-3.5 h-3.5 text-blue-400" /> Below average</span>
            </div>

            {entries.map((entry, idx) => (
              <TeamRow key={entry.teamId} entry={entry} topN={topN} rank={idx + 1} />
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
