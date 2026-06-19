import { Building2, Tag, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import type { JudgeSubmissionDetail } from "@/lib/api/judge.api";

interface TeamHeaderProps {
  detail?: JudgeSubmissionDetail | null;
  roundName?: string;
}

export function TeamHeader({ detail, roundName }: TeamHeaderProps) {
  if (!detail) {
    return (
      <GlassCard className="p-6">
        <p className="text-muted-foreground">Chọn team bên trái để xem bài nộp.</p>
      </GlassCard>
    );
  }

  const team = detail.team;
  const memberCount = team.members?.length ?? 0;

  return (
    <GlassCard className="p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-xl font-bold text-black">
          {team.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold">{team.name}</h2>
            <Badge className="capitalize">{detail.status}</Badge>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Building2 size={16} />
              {team.leader?.email || "—"}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Tag size={16} />
              {team.track?.name}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users size={16} />
              {memberCount} Members
            </div>
          </div>
        </div>

        <Badge variant="success">{roundName || detail.round.name}</Badge>
      </div>
    </GlassCard>
  );
}
