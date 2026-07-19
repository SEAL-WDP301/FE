import { Building2, Tag, Shield } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { JudgeSubmissionDetail } from "@/lib/api/judge.api";

interface TeamHeaderProps {
  detail?: JudgeSubmissionDetail | null;
  roundName?: string;
}

function teamInitials(name: string, anonymousIndex?: number) {
  if (anonymousIndex != null) {
    return `T${anonymousIndex}`;
  }
  const match = name.match(/^Team\s+(\d+)$/i);
  if (match) return `T${match[1]}`;
  return name.slice(0, 2).toUpperCase();
}

export function TeamHeader({ detail, roundName }: TeamHeaderProps) {
  if (!detail) {
    return (
      <GlassCard className="p-6">
        <p className="text-muted-foreground">Chọn team để xem bài nộp.</p>
      </GlassCard>
    );
  }

  const team = detail.team;

  return (
    <GlassCard className="p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-xl font-bold text-black">
          {teamInitials(team.name, team.anonymousIndex)}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold">{team.name}</h2>
            <Badge 
              variant={detail.status.toLowerCase() === 'submitted' ? "outline" : "default"}
              className={cn(
                "capitalize",
                detail.status.toLowerCase() === 'submitted' ? "border-green-500 text-green-600 dark:border-green-400 dark:text-green-400" : ""
              )}
            >
              {detail.status}
            </Badge>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag size={16} />
              Track: {team.track?.name}
            </div>
          </div>
        </div>

        <Badge variant="success">{roundName || detail.round.name}</Badge>
      </div>
    </GlassCard>
  );
}
