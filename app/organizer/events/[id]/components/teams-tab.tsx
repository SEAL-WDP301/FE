"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { enqueueSnackbar } from "notistack";
import { Search, CheckCircle, XCircle, Trash2, Eye, Crown, Users, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TeamDetailsDialog } from "./team-details-dialog";

import { useParams } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TeamsTab({ event }: { event: any }) {
    const queryClient = useQueryClient();
    const params = useParams();
    const roundId = params?.roundId as string | undefined;
    
    const [selectedTrackId, setSelectedTrackId] = useState<number | "all">("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

    const [eliminationReason, setEliminationReason] = useState("");
    const [teamToEliminate, setTeamToEliminate] = useState<number | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedTeamForDetails, setSelectedTeamForDetails] = useState<any | null>(null);


    // Fetch Teams for the selected track and round
    const { data: teams, isLoading } = useQuery({
        queryKey: ['organizerTeams', event.id, selectedTrackId, roundId],
        queryFn: async () => {
            let url = `/organizer/teams/events/${event.id}?`;
            if (selectedTrackId !== "all") url += `trackId=${selectedTrackId}&`;
            if (roundId) url += `roundId=${roundId}&`;
            
            const finalUrl = url.endsWith('?') ? url.slice(0, -1) : url;
            const res = await axiosClient.get(finalUrl);
            return res.data.data;
        },
        enabled: true,
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
            queryClient.invalidateQueries({ queryKey: ['organizerTeams', event.id] });
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

    // Bulk Delete Mutation
    const bulkDeleteMutation = useMutation({
        mutationFn: async (teamIds: number[]) => {
            return axiosClient.post(`/organizer/teams/bulk-delete`, { teamIds });
        },
        onSuccess: () => {
            enqueueSnackbar('Teams deleted successfully', { variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['organizerTeams', event.id, selectedTrackId] });
            setSelectedTeamIds([]);
            setIsBulkDeleteOpen(false);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Failed to delete teams', { variant: 'error' });
        }
    });

    // Filter teams locally based on status and search term
    const filteredTeams = teams?.filter((team: any) => {
        const matchesStatus = selectedStatus === "all" || team.status === selectedStatus;
        const matchesSearch = !searchTerm || team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              team.leader?.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    }) || [];

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedTeamIds(filteredTeams.map((t: any) => t.id));
        } else {
            setSelectedTeamIds([]);
        }
    };

    const handleSelectTeam = (teamId: number, checked: boolean) => {
        if (checked) {
            setSelectedTeamIds(prev => [...prev, teamId]);
        } else {
            setSelectedTeamIds(prev => prev.filter(id => id !== teamId));
        }
    };

    // Update selected team from updated cache
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentTeamDetails = teams?.find((t: any) => t.id === selectedTeamForDetails?.id) || selectedTeamForDetails;

    return (
        <div className="bg-card border border-border rounded-xl flex flex-col min-h-[500px]">
            {/* Header & Controls */}
            <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Team Management</h3>
                    <p className="text-muted-foreground text-sm">Review and approve teams registered for the tracks.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    {/* Bulk Delete Button */}
                    {selectedTeamIds.length > 0 && (
                        <Button 
                            variant="destructive" 
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                            onClick={() => setIsBulkDeleteOpen(true)}
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete ({selectedTeamIds.length})
                        </Button>
                    )}

                    {/* Status Selector */}
                    <select 
                        value={selectedStatus} 
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-background border border-border text-foreground text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="disqualified">Disqualified</option>
                    </select>

                    {/* Track Selector */}
                    <select 
                        value={selectedTrackId} 
                        onChange={(e) => setSelectedTrackId(e.target.value === "all" ? "all" : Number(e.target.value))}
                        className="bg-background border border-border text-foreground text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                        <option value="all">All Tracks</option>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {event.tracks?.map((track: any) => (
                            <option key={track.id} value={track.id}>{track.name}</option>
                        ))}
                    </select>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Search teams..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                            <th className="px-6 py-4 font-semibold w-12 text-center">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-border"
                                    checked={filteredTeams.length > 0 && selectedTeamIds.length === filteredTeams.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-4 font-semibold">Team Name</th>
                            <th className="px-6 py-4 font-semibold">Leader</th>
                            <th className="px-6 py-4 font-semibold">Members</th>
                            <th className="px-6 py-4 font-semibold">Mentor</th>
                            <th className="px-6 py-4 font-semibold">Registered At</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center">
                                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                </td>
                            </tr>
                        ) : filteredTeams && filteredTeams.length > 0 ? (
                            filteredTeams.map((team: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                <tr key={team.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 text-center">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-border"
                                            checked={selectedTeamIds.includes(team.id)}
                                            onChange={(e) => handleSelectTeam(team.id, e.target.checked)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-foreground">
                                        {team.name}
                                        {selectedTrackId === "all" && team.track && (
                                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{team.track.name}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {team.leader?.name || team.leader?.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {team.members?.length || 0} / {team.track?.maxMembersPerTeam || '∞'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {team.mentorAssignments && team.mentorAssignments.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {team.mentorAssignments.map((ma: any) => (
                                                    <span key={ma.mentorId} className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded text-xs font-semibold whitespace-nowrap">
                                                        {ma.mentor?.name || 'Unknown'}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="px-2 py-1 bg-muted border border-border text-muted-foreground rounded text-xs font-medium whitespace-nowrap">
                                                Unassigned
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {team.createdAt ? new Date(team.createdAt).toLocaleDateString() : 'N/A'}
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
                                <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                                    No teams found matching your filters.
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

            {/* Team Details Dialog Extracted */}
            <TeamDetailsDialog
                isOpen={!!selectedTeamForDetails}
                onClose={() => setSelectedTeamForDetails(null)}
                team={currentTeamDetails}
                eventId={event.id}
            />

            {/* Bulk Delete Confirmation Dialog */}
            <Dialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Bulk Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedTeamIds.length} team(s)? This action will permanently remove these teams, their members, and all submissions.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-muted/50 p-3 rounded-md max-h-[150px] overflow-y-auto text-foreground text-sm mt-4">
                        <ul className="list-disc pl-4 space-y-1">
                            {teams?.filter((t: any) => selectedTeamIds.includes(t.id)).map((team: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                <li key={team.id}>
                                    <span className="font-semibold">{team.name}</span>
                                    {team.track && <span className="text-muted-foreground ml-1">({team.track.name})</span>}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="ghost" onClick={() => setIsBulkDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={() => bulkDeleteMutation.mutate(selectedTeamIds)}
                            disabled={bulkDeleteMutation.isPending}
                        >
                            {bulkDeleteMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
