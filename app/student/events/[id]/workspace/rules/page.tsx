"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  Loader2,
  Scale,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { workspaceApi } from "@/lib/api/workspace.api";

const rules = [
  {
    icon: UsersRound,
    title: "Team responsibility",
    description:
      "All members are responsible for the originality, accuracy, and completeness of the team project.",
  },
  {
    icon: ShieldCheck,
    title: "Leader-only submission",
    description:
      "Only the team leader can submit, replace, or update project files and links on behalf of the team.",
  },
  {
    icon: Clock3,
    title: "Respect deadlines",
    description:
      "Submission changes must be completed before the active round deadline. Late updates may not be accepted.",
  },
  {
    icon: FileCheck2,
    title: "Valid deliverables",
    description:
      "Submitted files and URLs must be accessible, relevant to the project, and comply with the active round requirements.",
  },
  {
    icon: Scale,
    title: "Fair participation",
    description:
      "Teams must follow organizer instructions and avoid plagiarism, impersonation, or other unfair practices.",
  },
];

export default function CompetitionRulesPage() {
  const params = useParams();
  const eventId = Number(params.id);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["workspace", eventId],
    queryFn: () => workspaceApi.getWorkspaceOverview(eventId),
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <GlassCard className="rounded-[24px] p-10 text-center">
        <p className="font-semibold">Unable to load competition rules.</p>
      </GlassCard>
    );
  }

  const workspaceData = data?.data;
  const currentRound = workspaceData?.currentActiveRound;

  return (
    <div className="mx-auto max-w-[1000px] space-y-6 animate-in fade-in duration-500">
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Competition Rules
          </p>
          {currentRound ? (
            <Badge variant="outline">Current phase: {currentRound.name}</Badge>
          ) : null}
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Rules and responsibilities
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review these rules before collaborating on the project. Submission access
          is reserved for the team leader.
        </p>
      </header>

      <div className="grid gap-4">
        {rules.map(({ icon: Icon, title, description }, index) => (
          <GlassCard key={title} className="rounded-[22px] p-5">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <h2 className="font-semibold">
                    {index + 1}. {title}
                  </h2>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
