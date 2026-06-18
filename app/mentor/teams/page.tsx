"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { getAssignedMentorTeams, getMentorProfile } from "@/lib/api/mentor.api";

import { MentorPageHeader } from "../_components/mentor-page-header";
import { MentorEmptyState, MentorErrorState, MentorLoadingState } from "../_components/mentor-query-state";

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export default function MentorTeamsPage() {
  const [search, setSearch] = useState("");
  const query = useQuery({ queryKey: ["mentorProfile"], queryFn: getMentorProfile });
  const teams = getAssignedMentorTeams(query.data);
  const filteredTeams = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return teams;
    return teams.filter((team) =>
      [team.name, team.event?.name, team.track?.name, team.leader?.name, team.leader?.email]
        .some((field) => field?.toLowerCase().includes(value))
    );
  }, [search, teams]);

  if (query.isLoading) return <MentorLoadingState />;
  if (query.isError) return <MentorErrorState />;

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <MentorPageHeader title="My Teams" subtitle="Teams currently assigned to your stakeholder account." />
      <GlassCard className="rounded-[22px] bg-card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search team, event, track, leader..." className="h-11 rounded-2xl pl-11" />
        </div>
      </GlassCard>
      {filteredTeams.length === 0 ? (
        <MentorEmptyState title="No assigned teams" description="No team assignment returned by the current user profile." />
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTeams.map((team) => (
            <GlassCard key={team.id} className="rounded-[24px] bg-card p-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14"><AvatarFallback>{initials(team.name)}</AvatarFallback></Avatar>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{team.name}</h2>
                  <p className="text-sm text-muted-foreground">{team.track?.name || "No track"}</p>
                </div>
              </div>
              <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                <p>Event: <span className="text-foreground">{team.event?.name || "N/A"}</span></p>
                <p>Leader: <span className="text-foreground">{team.leader?.name || team.leader?.email || "N/A"}</span></p>
                <p>Members: <span className="text-foreground">{team.members?.length || 0}</span></p>
                <p>Status: <span className="capitalize text-foreground">{team.status || "N/A"}</span></p>
              </div>
              <Button asChild variant="orange" size="sm" className="mt-5 rounded-xl">
                <Link href={`/mentor/team-detail?teamId=${team.id}`}>View Team</Link>
              </Button>
            </GlassCard>
          ))}
        </section>
      )}
    </div>
  );
}
