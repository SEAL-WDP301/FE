"use client";

import {
  CheckCircle2,
  ClipboardCheck,
  Users,
  Trophy,
  Loader2,
} from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { useJudgeWorkspace } from "@/lib/hooks/use-judge-workspace";
import { useParams } from "next/navigation";

export function JudgeStats() {
  const params = useParams();
  const { stats, isLoading } = useJudgeWorkspace(params.eventId as string);

  const items = [
    {
      icon: ClipboardCheck,
      label: "Pending Reviews",
      value: stats.pendingReviews,
    },
    {
      icon: CheckCircle2,
      label: "Completed Reviews",
      value: stats.completedReviews,
    },
    {
      icon: Users,
      label: "Teams with Submissions",
      value: stats.assignedTeams,
    },
    {
      icon: Trophy,
      label: "Avg. Score Given",
      value: stats.averageScore ?? "—",
      suffix: stats.averageScore ? "/10" : undefined,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <GlassCard key={item.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>

                <div className="mt-2 flex items-end gap-1">
                  <h3 className="text-3xl font-bold">{item.value}</h3>

                  {item.suffix && (
                    <span className="mb-1 text-sm text-muted-foreground">
                      {item.suffix}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
