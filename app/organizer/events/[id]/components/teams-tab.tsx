"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { enqueueSnackbar } from "notistack";
import { Search, CheckCircle, XCircle, Trash2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TeamsTab({ event }: { event: any }) {
    const queryClient = useQueryClient();
    const [selectedTrackId, setSelectedTrackId] = useState<number | null>(
        event.tracks && event.tracks.length > 0 ? event.tracks[0].id : null
    );

    const [eliminationReason, setEliminationReason] = useState("");
    const [teamToEliminate, setTeamToEliminate] = useState<number | null>(null);

    // Fetch Teams for the selected track
    const { data: teams, isLoading } = useQuery({
        queryKey: ['organizerTeams', event.id, selectedTrackId],
        queryFn: async () => {
            if (!selectedTrackId) return [];
            const res = await axiosClient.get(`/organizer/events/${event.id}/tracks/${selectedTrackId}/teams`);
            return res.data.data;
        },
        enabled: !!selectedTrackId,
    });

    // Update Team Status Mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ teamId, status, reason }: { teamId: number, status: string, reason?: string }) => {
            return axiosClient.patch(`/organizer/events/${event.id}/teams/${teamId}/status`, {
                status,
                eliminationReason: reason
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
        if (status === 'eliminated') {
            setTeamToEliminate(teamId);
            return;
        }
        updateStatusMutation.mutate({ teamId, status });
    };

    const confirmElimination = () => {
        if (!teamToEliminate) return;
        if (!eliminationReason.trim()) {
            enqueueSnackbar('Please provide a reason for elimination', { variant: 'warning' });
            return;
        }
        updateStatusMutation.mutate({ teamId: teamToEliminate, status: 'eliminated', reason: eliminationReason });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded-md text-xs font-semibold">Pending</span>;
            case 'accepted': return <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-xs font-semibold">Accepted</span>;
            case 'eliminated': return <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-md text-xs font-semibold">Eliminated</span>;
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
                                        {team.status === 'pending' && (
                                            <>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="border-green-500/30 text-green-500 hover:bg-green-500/10"
                                                    onClick={() => handleUpdateStatus(team.id, 'accepted')}
                                                    disabled={updateStatusMutation.isPending}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                                                    onClick={() => handleUpdateStatus(team.id, 'eliminated')}
                                                    disabled={updateStatusMutation.isPending}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" /> Reject
                                                </Button>
                                            </>
                                        )}
                                        {team.status === 'accepted' && (
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                                                onClick={() => handleUpdateStatus(team.id, 'eliminated')}
                                                disabled={updateStatusMutation.isPending}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" /> Eliminate
                                            </Button>
                                        )}
                                        {team.status === 'eliminated' && (
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
                        <h3 className="text-xl font-bold text-foreground mb-2">Eliminate Team</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Please provide a reason for eliminating this team. This reason will be recorded and potentially visible to the team.
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
                                {updateStatusMutation.isPending ? 'Processing...' : 'Confirm Elimination'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
