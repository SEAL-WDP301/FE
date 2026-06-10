"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { enqueueSnackbar } from "notistack";
import { Search, CheckCircle, XCircle, Trash2, Eye, Crown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TeamsTab({ event }: { event: any }) {
    const queryClient = useQueryClient();
    const [selectedTrackId, setSelectedTrackId] = useState<number | null>(
        event.tracks && event.tracks.length > 0 ? event.tracks[0].id : null
    );

    const [eliminationReason, setEliminationReason] = useState("");
    const [teamToEliminate, setTeamToEliminate] = useState<number | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedTeamForDetails, setSelectedTeamForDetails] = useState<any | null>(null);

    // Fetch Teams for the selected track
    const { data: teams, isLoading } = useQuery({
        queryKey: ['organizerTeams', event.id, selectedTrackId],
        queryFn: async () => {
            if (!selectedTrackId) return [];
            const res = await axiosClient.get(`/organizer/teams/events/${event.id}/tracks/${selectedTrackId}`);
            return res.data.data;
        },
        enabled: !!selectedTrackId,
    });

    // Update Team Status Mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ teamId, status, reason }: { teamId: number, status: string, reason?: string }) => {
            return axiosClient.put(`/organizer/teams/${teamId}/status`, {
                status,
                reason
            });
        },
        onSuccess: () => {
            enqueueSnackbar('Team status updated successfully', { variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['organizerTeams', event.id, selectedTrackId] });
            setTeamToEliminate(null);
            setEliminationReason("");
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Failed to update status', { variant: 'error' });
        }
    });

    const handleUpdateStatus = (teamId: number, status: string) => {
        if (status === 'rejected' || status === 'disqualified') {
            setTeamToEliminate(teamId);
            return;
        }
        updateStatusMutation.mutate({ teamId, status });
    };

    const confirmElimination = () => {
        if (!teamToEliminate) return;
        if (!eliminationReason.trim()) {
            enqueueSnackbar('Please provide a reason', { variant: 'warning' });
            return;
        }
        updateStatusMutation.mutate({ teamId: teamToEliminate, status: 'rejected', reason: eliminationReason });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded-md text-xs font-semibold">Pending</span>;
            case 'approved': return <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-xs font-semibold">Approved</span>;
            case 'rejected': return <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-md text-xs font-semibold">Rejected</span>;
            case 'disqualified': return <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-md text-xs font-semibold">Disqualified</span>;
            default: return <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs font-semibold">{status}</span>;
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl flex flex-col min-h-[500px]">
            {/* Header & Controls */}
            <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Team Management</h3>
                    <p className="text-muted-foreground text-sm">Review and approve teams registered for the tracks.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Track Selector */}
                    <select 
                        value={selectedTrackId || ''} 
                        onChange={(e) => setSelectedTrackId(Number(e.target.value))}
                        className="bg-background border border-border text-foreground text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {event.tracks?.map((track: any) => (
                            <option key={track.id} value={track.id}>{track.name}</option>
                        ))}
                        {(!event.tracks || event.tracks.length === 0) && (
                            <option value="">No tracks available</option>
                        )}
                    </select>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Search teams..." 
                            className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 p-0 overflow-x-auto">
                <table className="w-full text-sm text-left text-muted-foreground">
                    <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Team Name</th>
                            <th className="px-6 py-4 font-semibold">Leader</th>
                            <th className="px-6 py-4 font-semibold">Members</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                </td>
                            </tr>
                        ) : teams && teams.length > 0 ? (
                            teams.map((team: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                <tr key={team.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-foreground">
                                        {team.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {team.leader?.name || team.leader?.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {team.members?.length || 0} / {team.track?.maxMembersPerTeam || '∞'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(team.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="text-blue-500 hover:bg-blue-500/10 hover:text-blue-600 px-2"
                                            onClick={() => setSelectedTeamForDetails(team)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        {team.status === 'pending' && (
                                            <>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="border-green-500/30 text-green-500 hover:bg-green-500/10"
                                                    onClick={() => handleUpdateStatus(team.id, 'approved')}
                                                    disabled={updateStatusMutation.isPending}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                                                    onClick={() => handleUpdateStatus(team.id, 'rejected')}
                                                    disabled={updateStatusMutation.isPending}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" /> Reject
                                                </Button>
                                            </>
                                        )}
                                        {team.status === 'approved' && (
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                                                onClick={() => handleUpdateStatus(team.id, 'disqualified')}
                                                disabled={updateStatusMutation.isPending}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" /> Disqualify
                                            </Button>
                                        )}
                                        {(team.status === 'rejected' || team.status === 'disqualified') && (
                                            <span className="text-xs text-muted-foreground italic max-w-[150px] inline-block truncate" title={team.eliminationReason}>
                                                {team.eliminationReason || 'No reason provided'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                    No teams registered for this track yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Elimination Modal */}
            {teamToEliminate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-card border border-border p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-foreground mb-2">Reject / Disqualify Team</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Please provide a reason for rejecting or disqualifying this team. This reason will be recorded and potentially visible to the team.
                        </p>
                        <textarea
                            className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none mb-4 min-h-[100px]"
                            placeholder="Enter elimination reason..."
                            value={eliminationReason}
                            onChange={(e) => setEliminationReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setTeamToEliminate(null);
                                    setEliminationReason("");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={confirmElimination}
                                disabled={updateStatusMutation.isPending || !eliminationReason.trim()}
                            >
                                {updateStatusMutation.isPending ? 'Processing...' : 'Confirm Action'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Team Details Dialog */}
            <Dialog open={!!selectedTeamForDetails} onOpenChange={(open) => !open && setSelectedTeamForDetails(null)}>
                <DialogContent className="sm:max-w-[600px] bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            Team: <span className="text-blue-500">{selectedTeamForDetails?.name}</span>
                            {selectedTeamForDetails?.status && (
                                <span className="ml-2">
                                    {getStatusBadge(selectedTeamForDetails.status)}
                                </span>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            Review the members of this team and their registration details.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="mt-4 space-y-4">
                        {/* Leader */}
                        <div className="p-4 border border-amber-500/30 rounded-lg bg-amber-500/5 relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 p-2 opacity-10">
                                <Crown className="w-24 h-24 text-amber-500" />
                            </div>
                            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <Crown className="w-4 h-4" />
                                Team Leader
                            </h4>
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <p className="font-semibold text-foreground text-base">{selectedTeamForDetails?.leader?.name || 'Unknown'}</p>
                                    <p className="text-sm text-muted-foreground">{selectedTeamForDetails?.leader?.email}</p>
                                    {selectedTeamForDetails?.leader?.studentProfile && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Code: {selectedTeamForDetails.leader.studentProfile.studentCode} • 
                                            {selectedTeamForDetails.leader.studentProfile.universityName && ` ${selectedTeamForDetails.leader.studentProfile.universityName}`}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right mt-1">
                                    <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-xs font-semibold shadow-sm">Accepted</span>
                                </div>
                            </div>
                        </div>

                        {/* Members */}
                        <div className="p-4 border border-border rounded-lg bg-muted/20">
                            {(() => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const otherMembers = selectedTeamForDetails?.members?.filter((m: any) => m.role !== 'leader') || [];
                                return (
                                    <>
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center justify-between">
                                            Members 
                                            <span className="bg-muted px-2 py-0.5 rounded-full text-foreground">
                                                {otherMembers.length}
                                            </span>
                                        </h4>
                                        
                                        {otherMembers.length === 0 ? (
                                            <p className="text-sm text-muted-foreground italic">No other members yet.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                {otherMembers.map((member: any) => (
                                                    <div key={member.id} className="flex justify-between items-start pt-3 border-t border-border/50 first:border-0 first:pt-0">
                                                        <div>
                                                            <p className="font-semibold text-foreground">{member.user?.name || 'Pending User'}</p>
                                                            <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                                                            {member.user?.studentProfile && (
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    Code: {member.user.studentProfile.studentCode} • 
                                                                    {member.user.studentProfile.universityName && ` ${member.user.studentProfile.universityName}`}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            {member.status === 'pending' ? (
                                                                <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded-md text-xs font-semibold whitespace-nowrap">
                                                                    Invitation Pending
                                                                </span>
                                                            ) : member.status === 'accepted' ? (
                                                                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-xs font-semibold">
                                                                    Accepted
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-md text-xs font-semibold">
                                                                    Rejected
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
