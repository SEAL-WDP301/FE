"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Textarea } from "@/components/ui/textarea";

interface JudgeCommentsCardProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function JudgeCommentsCard({
  value,
  onChange,
  disabled,
}: JudgeCommentsCardProps) {
  return (
    <GlassCard className="p-6 space-y-4">
      <div>
        <h3 className="text-xl font-semibold">Nhận xét chung</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Ghi chú tổng quan cho team (đính kèm vào bài chấm khi lưu)
        </p>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Nhận xét tổng thể về bài làm, điểm mạnh/yếu, gợi ý cải thiện..."
        className="min-h-[140px] bg-background/60"
      />
    </GlassCard>
  );
}
