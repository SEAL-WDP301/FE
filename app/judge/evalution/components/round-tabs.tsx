"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import type { JudgeAssignedRound } from "@/lib/api/judge.api";

interface RoundTabsProps {
  rounds: JudgeAssignedRound[];
  selectedRoundId: number | null;
  onSelectRound: (roundId: number) => void;
}

export function RoundTabs({
  rounds,
  selectedRoundId,
  onSelectRound,
}: RoundTabsProps) {
  if (!rounds.length) {
    return (
      <GlassCard className="p-4 text-sm text-muted-foreground">
        No rounds assigned for this event.
      </GlassCard>
    );
  }

  const sorted = [...rounds].sort((a, b) => a.roundNumber - b.roundNumber);

  return (
    <div className="flex flex-wrap gap-3">
      {sorted.map((round) => {
        const active = round.roundId === selectedRoundId;
        return (
          <button
            key={round.roundId}
            type="button"
            onClick={() => onSelectRound(round.roundId)}
            className={`rounded-2xl border px-5 py-3 text-left transition-all ${
              active
                ? "border-orange-500 bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,.2)]"
                : "border-white/10 bg-card/40 hover:border-orange-500/30"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">{round.roundName}</span>
              <Badge variant="outline" className="text-xs capitalize">
                {round.roundStatus.replace("_", " ")}
              </Badge>
            </div>
            {round.trackName && (
              <p className="mt-1 text-xs text-muted-foreground">
                Track: {round.trackName}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
