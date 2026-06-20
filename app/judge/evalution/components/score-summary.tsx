"use client";

import { Loader2, Save, Send } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  computeLocalWeightedScore,
  type JudgeRubric,
  type JudgeScoringStatus,
} from "@/lib/api/judge.api";

interface Props {
  rubrics: JudgeRubric[];
  scores: Record<number, number>;
  scoringStatus?: JudgeScoringStatus;
  weightedScore?: number | null;
  isSaving?: boolean;
  onSaveDraft?: () => void;
  onSubmit?: () => void;
  disabled?: boolean;
}

export function ScoreSummary({
  rubrics,
  scores,
  scoringStatus,
  weightedScore,
  isSaving,
  onSaveDraft,
  onSubmit,
  disabled,
}: Props) {
  const previewScore =
    weightedScore ?? computeLocalWeightedScore(rubrics, scores) ?? 0;

  return (
    <GlassCard className="h-fit w-full p-8 sticky top-4">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        Final Score
      </div>

      <div className="mt-2 text-5xl font-bold text-primary">
        <span className="text-7xl font-black text-orange-500">
          {previewScore.toFixed(2)}
        </span>
        <span className="pb-3 text-xl text-muted-foreground">/10</span>
      </div>

      <div className="mt-2 text-sm text-muted-foreground capitalize">
        Status: {scoringStatus?.replace("_", " ") ?? "pending"}
      </div>

      <div className="mt-6 space-y-4">
        {rubrics.map((item) => {
          const score = scores[item.id] ?? 0;
          const weight = Number(item.weight);
          const normalized = (score / item.maxScore) * 10;
          const contribution =
            rubrics.length > 0
              ? ((normalized * weight) /
                  rubrics.reduce((sum, r) => sum + Number(r.weight), 0)) *
                10
              : 0;

          return (
            <div key={item.id}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{item.name}</span>
                <span>{contribution.toFixed(2)}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full bg-orange-500"
                  style={{
                    width: `${Math.min(100, (score / item.maxScore) * 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          disabled={disabled || isSaving}
          onClick={onSaveDraft}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Draft
        </Button>

        <Button
          className="flex-1"
          disabled={disabled || isSaving}
          onClick={onSubmit}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send size={16} />
          )}
          Submit
        </Button>
      </div>
    </GlassCard>
  );
}
