"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import TeamsTab from "../../../components/teams-tab";

export default function EventTeamsPage() {
  const params = useParams();
  const eventId = params.id as string;

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ["organizerEvent", eventId],
    queryFn: async () => {
      const res = await axiosClient.get(`/public/events/${eventId}`);
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="mx-auto mt-20 max-w-lg rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
        Failed to load event details.
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400">
            <span className="size-1.5 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(243,112,33,.8)]" />
            Organizer workspace
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">Teams</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Manage registrations and approve teams for {event.name}.
          </p>
        </div>
      </div>

      <div className="animate-in fade-in duration-500">
        <TeamsTab event={event} />
      </div>
    </div>
  );
}
