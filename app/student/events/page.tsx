"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Crown, Award, Upload, Loader2 } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { EventFilters } from "./components/event-filter";
import { EventsGrid } from "./components/event-grid";
import { FILTERS, type EventItem, type EventStatus } from "./components/constants";
import { workspaceApi } from "@/lib/api/workspace.api";

type FilterType = (typeof FILTERS)[number];

function mapTeamStatus(status: string): EventStatus {
  if (status === "approved") return "Ongoing";
  if (status === "pending") return "Ongoing";
  if (status === "rejected") return "Eliminated";
  return "Completed";
}

function mapApiToEventItem(entry: Awaited<ReturnType<typeof workspaceApi.getMyEvents>>[number]): EventItem {
  const season = entry.event.season;
  const normalizedSeason =
    season === "Spring" || season === "Summer" || season === "Fall"
      ? season
      : "Fall";

  return {
    id: entry.event.id,
    name: entry.event.name,
    season: normalizedSeason,
    year: entry.event.year,
    status: mapTeamStatus(entry.teamStatus),
    category: entry.event.status || "Hackathon",
    rank: entry.teamStatus === "approved" ? "Active" : "Pending",
    team: entry.teamName,
    submission: entry.teamStatus === "approved" ? "Workspace ready" : "Awaiting approval",
    progress: entry.teamStatus === "approved" ? 60 : 25,
  };
}

export default function StudentEventsPage() {
  const [filter, setFilter] = useState<FilterType>("All");

  const { data: myEvents = [], isLoading, isError } = useQuery({
    queryKey: ["student", "my-events"],
    queryFn: workspaceApi.getMyEvents,
  });

  const events = useMemo(() => myEvents.map(mapApiToEventItem), [myEvents]);

  const filteredEvents = useMemo(() => {
    if (filter === "All") return events;
    return events.filter((event) => event.status === filter);
  }, [events, filter]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <GlassCard className="p-10 text-center">
        <p className="font-semibold">Không tải được danh sách event.</p>
        <p className="mt-2 text-sm text-muted-foreground">Thử tải lại trang hoặc đăng nhập lại.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-400">
          My Events
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Hackathon History
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Các event bạn đang tham gia hoặc đã đăng ký team.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Events", value: String(events.length), icon: Calendar, sub: "Registered teams" },
          { label: "Active", value: String(events.filter((e) => e.status === "Ongoing").length), icon: Crown, sub: "Approved teams" },
          { label: "Teams", value: String(myEvents.length), icon: Upload, sub: "Your memberships" },
          { label: "Seasons", value: String(new Set(events.map((e) => e.season)).size), icon: Award, sub: "Participation" },
        ].map((item) => (
          <GlassCard key={item.label} className="min-h-[132px] border border-border p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                <h3 className="mt-3 text-3xl font-bold text-orange-400">{item.value}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{item.sub}</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10">
                <item.icon className="h-5 w-5 text-orange-400" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <EventFilters filters={FILTERS} active={filter} onChange={setFilter} />

      {filteredEvents.length === 0 ? (
        <GlassCard className="p-10 text-center">
          <p className="font-semibold">Chưa có event nào</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Vào trang Events để đăng ký hoặc chấp nhận lời mời vào team.
          </p>
        </GlassCard>
      ) : (
        <EventsGrid events={filteredEvents} />
      )}
    </div>
  );
}
