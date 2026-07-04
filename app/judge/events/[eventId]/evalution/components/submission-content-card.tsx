"use client";

import { ExternalLink, FileText, Paperclip } from "lucide-react";
import { FaGithub as FaGithubIcon } from "react-icons/fa";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import type { JudgeSubmissionDetail } from "@/lib/api/judge.api";

interface SubmissionContentCardProps {
  detail?: JudgeSubmissionDetail | null;
  githubUrl?: string | null;
  fileUrl?: string | null;
  description?: string | null;
}

export function SubmissionContentCard({
  detail,
  githubUrl,
  fileUrl,
  description,
}: SubmissionContentCardProps) {
  const resolvedGithub =
    detail?.githubUrl ?? detail?.assignedRepoUrl ?? detail?.team?.githubRepoUrl ?? githubUrl;
  const resolvedFile = detail?.fileUrl ?? fileUrl;
  const resolvedDescription = detail?.description ?? description;

  return (
    <GlassCard className="p-6 space-y-5">
      <div>
        <h3 className="text-xl font-semibold">Bài nộp</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Nội dung team đã gửi cho vòng thi này
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-primary/15 p-3">
              <FaGithubIcon size={18} />
            </div>
            <div>
              <h4 className="font-medium">GitHub Repository</h4>
              <p className="text-xs text-muted-foreground">Source code / repo được cấp</p>
            </div>
          </div>
          {resolvedGithub ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground font-mono break-all line-clamp-2">
                {resolvedGithub}
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href={resolvedGithub} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Xem mã nguồn
                </a>
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có link GitHub</p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-primary/15 p-3">
              <Paperclip size={18} />
            </div>
            <div>
              <h4 className="font-medium">Tài liệu / File</h4>
              <p className="text-xs text-muted-foreground">Slide, PDF, document</p>
            </div>
          </div>
          {resolvedFile ? (
            <Button variant="outline" size="sm" asChild>
              <a href={resolvedFile} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Mở tài liệu
              </a>
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có file đính kèm</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-xl bg-primary/15 p-3">
            <FileText size={18} />
          </div>
          <div>
            <h4 className="font-medium">Mô tả dự án</h4>
            <p className="text-xs text-muted-foreground">Ghi chú từ team</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {resolvedDescription || "Team chưa ghi mô tả."}
        </p>
      </div>
    </GlassCard>
  );
}
