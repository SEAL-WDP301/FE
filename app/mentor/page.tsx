"use client";

import Link from "next/link";
import { Bell, Search, UsersRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  getAssignedMentorTeams,
  getMentorNotifications,
  getMentorProfile,
} from "@/lib/api/mentor.api";

import { MentorPageHeader } from "./_components/mentor-page-header";
import {
  MentorEmptyState,
  MentorErrorState,
  MentorLoadingState,
} from "./_components/mentor-query-state";

export default function MentorDashboardPage() {
  const profileQuery = useQuery({
    queryKey: ["mentorProfile"],
    queryFn: getMentorProfile,
  });
  const notificationsQuery = useQuery({
    queryKey: ["userNotifications"],
    queryFn: getMentorNotifications,
  });

  if (profileQuery.isLoading) return <MentorLoadingState />;
  if (profileQuery.isError) return <MentorErrorState />;

  const teams = getAssignedMentorTeams(profileQuery.data);
  const notifications = notificationsQuery.data || [];
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <MentorPageHeader
        title={`Welcome${profileQuery.data?.name ? `, ${profileQuery.data.name}` : ""}`}
        subtitle="Monitor teams assigned to you by the organizer."
        actions={
          <Button asChild variant="outline" className="rounded-2xl border-border bg-muted/40">
            <Link href="/mentor/teams">
              <Search className="h-4 w-4" />
              View teams
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Assigned teams", String(teams.length), UsersRound],
          ["Notifications", String(notifications.length), Bell],
          ["Unread updates", String(unreadCount), Bell],
        ].map(([label, value, Icon]) => (
          <GlassCard key={String(label)} className="rounded-[22px] bg-card p-5">
            <Icon className="h-5 w-5 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">{String(label)}</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{String(value)}</p>
          </GlassCard>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <GlassCard className="rounded-[24px] bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Assigned teams</h2>
          <div className="mt-5 space-y-3">
            {teams.length === 0 ? (
              <MentorEmptyState
                title="No teams assigned"
                description="An organizer must assign this stakeholder account to a team before it appears here."
              />
            ) : (
              teams.map((team) => (
                <Link
                  key={team.id}
                  href={`/mentor/team-detail?teamId=${team.id}`}
                  className="block rounded-2xl border border-border bg-muted/40 p-4 transition-colors hover:border-orange-500/40"
                >
                  <p className="font-semibold text-foreground">{team.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {team.event?.name || "Event unavailable"} · {team.track?.name || "Track unavailable"}
                  </p>
                </Link>
              ))
            )}
          </div>
        </GlassCard>

        <GlassCard className="rounded-[24px] bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Recent notifications</h2>
          <div className="mt-5 space-y-3">
            {notifications.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.content}</p>
              </div>
            ))}
            {!notificationsQuery.isLoading && notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notifications.</p>
            ) : null}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
