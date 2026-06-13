"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { useParams } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Settings2, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function EventSettingsPage() {
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
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="text-center text-red-500 bg-red-500/10 p-6 rounded-xl border border-red-500/20 max-w-lg mx-auto mt-20">
        Failed to load event details.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure global settings for {event.name}.
          </p>
        </div>
      </div>

      <GlassCard className="p-12 text-center rounded-[24px]">
        <Settings2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Configuration</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          To edit event descriptions, dates, or basic information, please use the main Edit page. We are currently working on moving those settings into this unified dashboard.
        </p>
        {event.status === 'draft' ? (
          <Link href={`/organizer/events/${eventId}/edit`}>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              Go to Edit Form
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Button className="gap-2 bg-muted text-muted-foreground" disabled>
              Go to Edit Form
              <ArrowRight className="h-4 w-4" />
            </Button>
            <span className="text-sm text-amber-500 font-medium bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Only events in "Draft" status can be edited.
            </span>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
