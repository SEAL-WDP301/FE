"use client";

import { AlarmClock, Loader2 } from "lucide-react";

import { useJudgeWorkspace } from "@/lib/hooks/use-judge-workspace";

export default function UpcomingDeadlines() {
  const { events, isLoading } = useJudgeWorkspace();

  const rounds = events.flatMap((event) =>
    event.rounds.map((round) => ({
      eventName: event.name,
      roundName: round.roundName,
      roundStatus: round.roundStatus,
      key: `${event.id}-${round.roundId}`,
    })),
  );

  return (
    <div className="rounded-xl border p-5">
      <div className="mb-5 flex items-center gap-2">
        <AlarmClock size={18} />
        <h2 className="font-semibold">Assigned Rounds</h2>
      </div>

      {isLoading ? (
        <div className="flex h-24 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
        </div>
      ) : rounds.length === 0 ? (
        <p className="text-sm text-muted-foreground">No assigned rounds yet.</p>
      ) : (
        <div className="space-y-4">
          {rounds.map((item) => (
            <div key={item.key} className="rounded-lg border p-3">
              <div className="flex justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{item.roundName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.eventName}
                  </p>
                </div>

                <span className="shrink-0 text-sm font-medium capitalize text-orange-400">
                  {item.roundStatus.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
