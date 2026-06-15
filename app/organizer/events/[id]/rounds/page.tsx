"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { useParams } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { enqueueSnackbar } from "notistack";

export default function EventRoundsPage() {
  const params = useParams();
  const eventId = params.id as string;
  const queryClient = useQueryClient();

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ["organizerEvent", eventId],
    queryFn: async () => {
      const res = await axiosClient.get(`/public/events/${eventId}`);
      return res.data.data;
    },
  });

  const updateRoundStatusMutation = useMutation({
    mutationFn: async ({ roundId, status }: { roundId: number, status: string }) => {
      const res = await axiosClient.patch(`/organizer/events/${eventId}/rounds/${roundId}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      enqueueSnackbar('Round status updated successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ["organizerEvent", eventId] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update round status', { variant: 'error' });
    }
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

  const canModifyStructure = event?.status === "draft" && (!event?.registrationDeadline || new Date(event.registrationDeadline) > new Date());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tracks & Rounds</h1>
          <p className="text-muted-foreground mt-1">
            Manage the competition tracks, rounds, and deadlines.
          </p>
        </div>
      </div>

      {/* Rounds Section */}
      <GlassCard className="p-6 rounded-[24px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-500">Event Rounds</h2>
          {canModifyStructure && (
            <Button disabled className="gap-2 bg-blue-600 hover:bg-blue-700 opacity-50 cursor-not-allowed" title="Round creation is not yet available" size="sm">
              <Plus className="h-4 w-4" />
              Add Round
            </Button>
          )}
        </div>
        
        {event.rounds && event.rounds.length > 0 ? (
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                 <tr>
                   <th className="px-6 py-4 font-semibold rounded-tl-lg">Round Name</th>
                   <th className="px-6 py-4 font-semibold">Timeline</th>
                   <th className="px-6 py-4 font-semibold">Requirements</th>
                   <th className="px-6 py-4 font-semibold">Status</th>
                   <th className="px-6 py-4 font-semibold rounded-tr-lg text-right">Action</th>
                 </tr>
               </thead>
               <tbody>
                 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                 {event.rounds.map((round: any) => (
                   <tr key={round.id} className="border-b border-border hover:bg-muted/10">
                     <td className="px-6 py-4 font-medium">
                        {round.name}
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Round {round.roundNumber}</div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="text-xs">
                          {round.startDate && <div>Start: {new Date(round.startDate).toLocaleDateString()}</div>}
                          {round.submissionDeadline && <div className="text-red-400">Deadline: {new Date(round.submissionDeadline).toLocaleDateString()}</div>}
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="text-xs">
                           {round.submissionType} <br/>
                           Max Size: {round.maxFileSizeMb}MB
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <select
                            value={round.status}
                            onChange={(e) => updateRoundStatusMutation.mutate({ roundId: round.id, status: e.target.value })}
                            disabled={updateRoundStatusMutation.isPending}
                            className="bg-background border border-border rounded-md text-sm text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 cursor-pointer shadow-sm"
                          >
                            <option value="not_started">Not Started</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="results_published">Results Published</option>
                        </select>
                     </td>
                     <td className="px-6 py-4 text-right">
                         <Button size="sm" variant="outline" disabled title="Edit round coming soon">Edit</Button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        ) : (
           <div className="text-muted-foreground text-center py-6 border border-dashed border-border rounded-xl">No rounds created for this event yet.</div>
        )}
      </GlassCard>

      {/* Tracks Section */}
      <GlassCard className="p-6 rounded-[24px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-orange-500">Event Tracks</h2>
          {canModifyStructure && (
            <Button disabled className="gap-2 bg-orange-600 hover:bg-orange-700 opacity-50 cursor-not-allowed" title="Track creation is not yet available" size="sm">
              <Plus className="h-4 w-4" />
              Add Track
            </Button>
          )}
        </div>
        
        {event.tracks && event.tracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {event.tracks.map((track: any) => (
              <div key={track.id} className="p-4 border border-border rounded-xl bg-background flex flex-col gap-2">
                 <h3 className="font-bold text-lg">{track.name}</h3>
                 <p className="text-sm text-muted-foreground line-clamp-2">{track.description || "No description provided."}</p>
                 <div className="mt-auto pt-4 flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <span>Max Teams: {track.maxTeams || 'Unlimited'}</span>
                    <span>Max Members: {track.maxMembersPerTeam || 'Unlimited'}</span>
                 </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="text-muted-foreground text-center py-6 border border-dashed border-border rounded-xl">No tracks configured for this event.</div>
        )}
      </GlassCard>
    </div>
  );
}
