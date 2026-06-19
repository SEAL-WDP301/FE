"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, FileText } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { getMentorTeam, getMentorTeamSubmissions } from "@/lib/api/mentor.api";
import { MentorPageHeader } from "../../_components/mentor-page-header";
import {
  MentorEmptyState,
  MentorErrorState,
  MentorLoadingState,
} from "../../_components/mentor-query-state";

function initials(value?: string | null) {
  return (value || "?")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MentorTeamDetailPage() {
  const params = useParams();
  const teamId = params.teamId as string;

  const teamQuery = useQuery({
    queryKey: ["mentorTeam", teamId],
    queryFn: () => getMentorTeam(teamId),
  });
  const submissionsQuery = useQuery({
    queryKey: ["mentorTeamSubmissions", teamId],
    queryFn: () => getMentorTeamSubmissions(teamId),
  });

  if (teamQuery.isLoading) return <MentorLoadingState />;
  if (teamQuery.isError || !teamQuery.data) return <MentorErrorState />;

  const team = teamQuery.data;
  const submissions = submissionsQuery.data || [];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <MentorPageHeader
        title={team.name}
        subtitle="View the assigned team and its submissions."
        actions={
          <Button asChild variant="outline">
            <Link href="/mentor/teams">Back to teams</Link>
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <GlassCard className="rounded-[24px] bg-card p-5">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">{initials(team.name)}</AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-2xl font-semibold">{team.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {team.event?.name || "Event unavailable"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline">{team.track?.name || "No track"}</Badge>
              <Badge className="capitalize">{team.status || "Unknown"}</Badge>
            </div>
          </GlassCard>

          <GlassCard className="rounded-[24px] bg-card p-5">
            <h2 className="font-semibold">Team leader</h2>
            <p className="mt-3 text-sm">{team.leader?.name || "Name unavailable"}</p>
            <p className="text-sm text-muted-foreground">
              {team.leader?.email || "Email unavailable"}
            </p>
          </GlassCard>
        </aside>

        <main className="space-y-5">
          <GlassCard className="rounded-[24px] bg-card p-6">
            <h2 className="text-lg font-semibold">Submissions</h2>
            {submissionsQuery.isLoading ? (
              <MentorLoadingState />
            ) : submissionsQuery.isError ? (
              <MentorErrorState />
            ) : submissions.length === 0 ? (
              <div className="mt-5">
                <MentorEmptyState
                  title="No submissions"
                  description="This assigned team has not submitted work yet."
                />
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/30 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <p className="font-semibold">
                          {submission.round?.name || `Round ${submission.roundId}`}
                        </p>
                      </div>
                      <p className="mt-1 text-sm capitalize text-muted-foreground">
                        {submission.status || "submitted"} ·{" "}
                        {submission.updatedAt
                          ? new Date(submission.updatedAt).toLocaleString()
                          : "Time unavailable"}
                      </p>
                    </div>
                    <Button asChild variant="orange">
                      <Link
                        href={`/mentor/teams/${team.id}/submissions/${submission.id}`}
                      >
                        View submission
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard className="rounded-[24px] bg-card p-6">
            <h2 className="text-lg font-semibold">Members</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {(team.members || []).map((member, index) => (
                <div
                  key={member.id || member.user?.id || index}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-3"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{initials(member.user?.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {member.user?.name || "Unknown member"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {member.user?.email || "No email"} · {member.role || "member"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
