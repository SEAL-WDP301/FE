"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { useParams } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ExternalLink } from "lucide-react";

export default function EventSubmissionsPage() {
  const params = useParams();
  const eventId = params.id as string;
  const roundId = params.roundId as string;
  const [selectedTrackId, setSelectedTrackId] = useState<number | "">("");

  // Fetch event to get tracks and rounds for filters
  const { data: event } = useQuery({
    queryKey: ["organizerEvent", eventId],
    queryFn: async () => {
      const res = await axiosClient.get(`/public/events/${eventId}`);
      return res.data.data;
    },
  });

  // Fetch Submissions
  const { data: submissions, isLoading } = useQuery({
    queryKey: ["organizerSubmissions", eventId, selectedTrackId, roundId],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (selectedTrackId) queryParams.append("trackId", selectedTrackId.toString());
      if (roundId) queryParams.append("roundId", roundId);
      const res = await axiosClient.get(`/organizer/events/${eventId}/submissions?${queryParams.toString()}`);
      return res.data.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
          <p className="text-muted-foreground mt-1">
            Review team submissions across all active rounds.
          </p>
        </div>
        <Button variant="outline" className="gap-2 border-blue-500/20 text-blue-600 hover:bg-blue-50">
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </div>

      <GlassCard className="p-6 rounded-[24px]">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedTrackId}
            onChange={(e) => {
              setSelectedTrackId(e.target.value ? Number(e.target.value) : "");
            }}
            className="bg-background border border-border text-foreground text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
          >
            <option value="">All Tracks</option>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {event?.tracks?.map((track: any) => (
              <option key={track.id} value={track.id}>{track.name}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Team Name</th>
                <th className="px-6 py-4 font-semibold">Track & Round</th>
                <th className="px-6 py-4 font-semibold">Submitted By</th>
                <th className="px-6 py-4 font-semibold">Links</th>
                <th className="px-6 py-4 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : submissions && submissions.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                submissions.map((sub: any) => (
                  <tr key={sub.id} className="border-b border-border hover:bg-muted/10">
                    <td className="px-6 py-4 font-medium">{sub.team?.name}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <div className="font-semibold">{sub.team?.track?.name}</div>
                        <div className="text-muted-foreground">{sub.round?.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {sub.submittedBy?.name || sub.submittedBy?.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {sub.githubUrl && (
                          <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 text-xs">
                            GitHub <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {sub.fileUrl && (
                          <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-green-500 hover:underline flex items-center gap-1 text-xs">
                            File/Doc <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {!sub.githubUrl && !sub.fileUrl && (
                           <span className="text-xs text-muted-foreground italic">No links provided</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(sub.updatedAt || sub.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No submissions found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
