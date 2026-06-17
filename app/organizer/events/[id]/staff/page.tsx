"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { useParams } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Plus, GraduationCap, Trash2, Loader2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { enqueueSnackbar } from "notistack";

export default function EventStaffPage() {
  const params = useParams();
  const eventId = params.id as string;
  const queryClient = useQueryClient();
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<number | "">("");
  const [selectedRound, setSelectedRound] = useState<number | "">("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Event to get tracks and rounds
  const { data: event } = useQuery({
    queryKey: ["organizerEvent", eventId],
    queryFn: async () => {
      const res = await axiosClient.get(`/public/events/${eventId}`);
      return res.data.data;
    },
  });

  // Fetch Staff assignments
  const { data: staffData, isLoading: isLoadingStaff } = useQuery({
    queryKey: ["organizerStaff", eventId],
    queryFn: async () => {
      const res = await axiosClient.get(`/organizer/events/${eventId}/staff`);
      return res.data.data;
    },
  });

  const allJudgeAssignments = staffData?.judges || [];
  const allMentorAssignments = staffData?.mentors || [];

  // Fetch Users
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosClient.get(`/users`);
      return res.data.data;
    },
  });

  // Assign Judge Mutation
  const assignJudgeMutation = useMutation({
    mutationFn: async (data: { stakeholderId: number, roundId: number, trackId?: number }) => {
      const res = await axiosClient.post(`/organizer/events/${eventId}/judges`, data);
      return res.data;
    },
    onSuccess: () => {
      enqueueSnackbar('Judge assigned successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ["organizerStaff", eventId] });
      setIsJudgeModalOpen(false);
      setSelectedUser(null);
      setSelectedTrack("");
      setSelectedRound("");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to assign judge', { variant: 'error' });
    }
  });

  // Unassign Judge Mutation
  const unassignJudgeMutation = useMutation({
    mutationFn: async (assignmentId: number) => {
      const res = await axiosClient.delete(`/organizer/events/${eventId}/judges/${assignmentId}`);
      return res.data;
    },
    onSuccess: () => {
      enqueueSnackbar('Judge unassigned successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ["organizerStaff", eventId] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to unassign judge', { variant: 'error' });
    }
  });

  const handleAssignJudge = () => {
    if (!selectedUser || !selectedRound) {
      enqueueSnackbar('Please select a user and a round', { variant: 'warning' });
      return;
    }
    assignJudgeMutation.mutate({
      stakeholderId: selectedUser,
      roundId: Number(selectedRound),
      trackId: selectedTrack ? Number(selectedTrack) : undefined,
    });
  };

  // Filter stakeholders and judges that can be assigned to judge rounds
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const staffUsers = users?.filter((u: any) => u.role === 'stakeholder' || u.role === 'judge') || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const judgeCandidates = staffUsers.filter((u: any) => u.role === 'stakeholder' || u.role === 'judge');
  
  // Filter for search inside modal
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredModalUsers = judgeCandidates.filter((u: any) => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentors & Judges</h1>
          <p className="text-muted-foreground mt-1">
            Manage judges for rounds and view mentor assignments.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsJudgeModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Assign Judge
          </Button>
        </div>
      </div>

      <GlassCard className="p-6 rounded-[24px]">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-blue-500" />
          Staff Pool
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Judge Assignments</th>
                <th className="px-6 py-4 font-semibold">Mentor Assignments</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingUsers || isLoadingStaff ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : staffUsers.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                staffUsers.map((user: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const judgeAssignments = allJudgeAssignments.filter((ja: any) => ja.judgeId === user.id);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const mentorAssignments = allMentorAssignments.filter((ma: any) => ma.mentorId === user.id);

                    return (
                        <tr key={user.id} className="border-b border-border hover:bg-muted/10">
                            <td className="px-6 py-4">
                                <div className="font-medium text-foreground">{user.name}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 text-xs">
                                {judgeAssignments.length > 0 ? (
                                    <div className="space-y-2">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {judgeAssignments.map((ja: any) => (
                                            <div key={ja.id} className="flex items-center gap-2 bg-purple-500/5 p-1.5 rounded-md border border-purple-500/20">
                                                <span>
                                                    Round: <span className="font-semibold">{ja.round?.name || 'N/A'}</span>
                                                    {ja.track && ` (Track: ${ja.track.name})`}
                                                </span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-6 w-6 p-0 ml-auto text-red-500 hover:text-red-600"
                                                    onClick={() => unassignJudgeMutation.mutate(ja.id)}
                                                    disabled={unassignJudgeMutation.isPending}
                                                    title="Remove Judge"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground italic">None</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-xs">
                                {mentorAssignments.length > 0 ? (
                                    <div className="space-y-2">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {mentorAssignments.map((ma: any) => (
                                            <div key={ma.id} className="bg-amber-500/5 p-1.5 rounded-md border border-amber-500/20">
                                                Team: <span className="font-semibold">{ma.team?.name || 'N/A'}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground italic">None</span>
                                )}
                            </td>
                        </tr>
                    );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                    No stakeholder or judge accounts found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Assign Judge Modal */}
      <Dialog open={isJudgeModalOpen} onOpenChange={setIsJudgeModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Assign Judge</DialogTitle>
            <DialogDescription>
              Select a stakeholder or judge account to act as a judge for a specific round.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Search Staff</label>
              <div className="relative mb-2">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <input 
                    type="text" 
                    placeholder="Search by name or email..."
                    className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
              <select
                value={selectedUser || ""}
                onChange={(e) => setSelectedUser(Number(e.target.value))}
                className="w-full bg-background border border-border text-foreground text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 h-32"
                size={5}
              >
                {isLoadingUsers ? (
                   <option disabled>Loading users...</option>
                ) : filteredModalUsers?.map((u: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>

            <div>
               <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Track (Optional)</label>
               <select
                value={selectedTrack}
                onChange={(e) => {
                  setSelectedTrack(e.target.value ? Number(e.target.value) : "");
                  setSelectedRound("");
                }}
                className="w-full bg-background border border-border text-foreground text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
               >
                 <option value="">All Tracks (Cross-track Judge)</option>
                 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                 {event?.tracks?.map((track: any) => (
                   <option key={track.id} value={track.id}>{track.name}</option>
                 ))}
               </select>
            </div>

            <div>
               <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Round (Required)</label>
               <select
                value={selectedRound}
                onChange={(e) => setSelectedRound(Number(e.target.value))}
                className="w-full bg-background border border-border text-foreground text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
               >
                 <option value="">Select a Round...</option>
                 {selectedTrack ? (
                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                   event?.tracks?.find((t: any) => t.id === selectedTrack)?.rounds?.map((round: any) => (
                     <option key={round.id} value={round.id}>{round.name}</option>
                   ))
                 ) : (
                    // Show all rounds if no track selected
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    event?.tracks?.flatMap((t: any) => t.rounds || []).map((round: any) => (
                       <option key={round.id} value={round.id}>{round.name} ({event.tracks.find((tr: { id: number; name?: string }) => tr.id === round.trackId)?.name})</option>
                    ))
                 )}
               </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsJudgeModalOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAssignJudge} 
                disabled={!selectedUser || !selectedRound || assignJudgeMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {assignJudgeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign Judge"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
