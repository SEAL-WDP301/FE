"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { enqueueSnackbar } from "notistack";
import { Search, CheckCircle, XCircle, Trash2, Eye, Loader2, ShieldX } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TeamDetailsDialog } from "./team-details-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { OrganizerEvent } from "@/lib/api/organizer-events.api";

import { useParams } from "next/navigation";

interface OrganizerTeam {
    id: number;
    name: string;
    status: string;
    createdAt?: string;
    eliminationReason?: string;
    leader?: {
        name?: string;
        email?: string;
        avatarUrl?: string;
        avatar_url?: string;
    };
    members?: unknown[];
    track?: {
        id?: number;
        name?: string;
        maxMembersPerTeam?: number;
    };
    mentorAssignments?: Array<{
        mentorId: number;
        mentor?: { name?: string };
    }>;
}

export default function TeamsTab({ event }: { event: OrganizerEvent }) {
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
    const [selectedTeamForDetails, setSelectedTeamForDetails] = useState<OrganizerTeam | null>(null);


    // Fetch Teams for the selected track and round
    const { data: teams, isLoading } = useQuery<OrganizerTeam[]>({
        queryKey: ['organizerTeams', event.id, selectedTrackId, roundId],
        queryFn: async () => {
            let url = `/organizer/teams/events/${event.id}?`;
            if (selectedTrackId !== "all") url += `trackId=${selectedTrackId}&`;
            if (roundId) url += `roundId=${roundId}&`;
            
            const finalUrl = url.endsWith('?') ? url.slice(0, -1) : url;
            const res = await axiosClient.get(finalUrl);
            return res.data.data as OrganizerTeam[];
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
            queryClient.invalidateQueries({ queryKey: ['organizerTeams', event.id, selectedTrackId, roundId] });
            setTeamToEliminate(null);
            setEliminationReason("");
            // Update selected team details if open
            if (selectedTeamForDetails) {
                queryClient.invalidateQueries({ queryKey: ['organizerTeams', event.id, selectedTrackId, roundId] });
            }
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
            case 'pending': return <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400"><span className="size-1.5 rounded-full bg-amber-400" />Pending</span>;
            case 'approved': return <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400"><span className="size-1.5 rounded-full bg-green-400" />Approved</span>;
            case 'rejected': return <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400"><span className="size-1.5 rounded-full bg-red-400" />Rejected</span>;
            case 'disqualified': return <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400"><span className="size-1.5 rounded-full bg-red-400" />Disqualified</span>;
            default: return <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{status}</span>;
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
    const filteredTeams = teams?.filter((team) => {
        const matchesStatus = selectedStatus === "all" || team.status === selectedStatus;
        const matchesSearch = !searchTerm || team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (team.leader?.email ?? "").toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    }) || [];

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedTeamIds(filteredTeams.map((team) => team.id));
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
    const currentTeamDetails = teams?.find((team) => team.id === selectedTeamForDetails?.id) || selectedTeamForDetails;

    return (
        <div className="flex min-h-[560px] flex-col overflow-hidden rounded-[26px] border border-border bg-card/80 shadow-[0_24px_70px_rgba(80,45,15,.1)] backdrop-blur-2xl transition-colors duration-300 dark:shadow-[0_28px_80px_rgba(0,0,0,.32)]">
            {/* Header & Controls */}
            <div className="flex flex-col gap-5 border-b border-border p-5 sm:p-7 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">Team Management</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Review and approve teams registered for the tracks.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Bulk Delete Button */}
                    {selectedTeamIds.length > 0 && (
                        <Button 
                            variant="destructive" 
                            size="sm"
                            className="flex items-center gap-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
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
                        className="h-10 rounded-xl border border-input bg-background/70 px-3 text-sm text-foreground outline-none transition focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/10"
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
                        className="h-10 rounded-xl border border-input bg-background/70 px-3 text-sm text-foreground outline-none transition focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/10"
                    >
                        <option value="all">All Tracks</option>
                        {event.tracks?.map((track) => (
                            <option key={track.id} value={track.id}>{track.name}</option>
                        ))}
                    </select>

                    <div className="relative min-w-[220px] flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Search teams..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 w-full rounded-xl border border-input bg-background/70 pl-9 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/10"
                        />
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-x-auto">
                <table className="w-full min-w-[1080px] text-left text-sm text-muted-foreground">
                    <thead className="bg-muted/55 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        <tr>
                            <th className="w-12 px-6 py-4 text-center font-semibold">
                                <input 
                                    type="checkbox" 
                                    className="size-4 rounded border-border accent-[#F37021]"
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
                                <td colSpan={8} className="px-6 py-16 text-center">
                                    <Loader2 className="mx-auto size-6 animate-spin text-orange-500" />
                                </td>
                            </tr>
                        ) : filteredTeams && filteredTeams.length > 0 ? (
                            filteredTeams.map((team) => (
                                <tr key={team.id} className="border-b border-border transition-colors duration-200 hover:bg-orange-500/[0.055]">
                                    <td className="px-6 py-4 text-center">
                                        <input 
                                            type="checkbox" 
                                            className="size-4 rounded border-border accent-[#F37021]"
                                            checked={selectedTeamIds.includes(team.id)}
                                            onChange={(e) => handleSelectTeam(team.id, e.target.checked)}
                                        />
                                    </td>
                                    <td className="px-6 py-5 font-medium text-foreground">
                                        <div>{team.name}</div>
                                        {team.track && (
                                            <span className="mt-1.5 inline-flex rounded-md border border-orange-500/15 bg-orange-500/[0.07] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-orange-400/80">
                                                {team.track.name}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2.5">
                                            <Avatar className="size-8 border border-border">
                                                {(team.leader?.avatarUrl || team.leader?.avatar_url) && (
                                                    <AvatarImage src={team.leader.avatarUrl || team.leader.avatar_url} alt="" />
                                                )}
                                                <AvatarFallback className="bg-muted text-[11px] text-foreground">
                                                    {(team.leader?.name || team.leader?.email || "?").charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="max-w-[150px] truncate text-foreground/80">
                                                {team.leader?.name || team.leader?.email}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-foreground/80">{team.members?.length || 0}</span>
                                        <span className="text-muted-foreground"> / {team.track?.maxMembersPerTeam || '∞'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {team.mentorAssignments && team.mentorAssignments.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {team.mentorAssignments.map((ma) => (
                                                    <span key={ma.mentorId} className="whitespace-nowrap rounded-full border border-orange-500/15 bg-orange-500/[0.07] px-2.5 py-1 text-xs font-medium text-orange-300">
                                                        {ma.mentor?.name || 'Unknown'}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="whitespace-nowrap rounded-full border border-border bg-muted/70 px-2.5 py-1 text-xs text-muted-foreground">
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
                                            className="rounded-xl px-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                            onClick={() => setSelectedTeamForDetails(team)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        {team.status === 'pending' && (
                                            <>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="rounded-xl border-green-500/20 text-green-400 hover:bg-green-500/10 hover:text-green-300"
                                                    onClick={() => handleUpdateStatus(team.id, 'approved')}
                                                    disabled={updateStatusMutation.isPending}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="rounded-xl border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
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
                                                className="rounded-xl border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                                onClick={() => handleUpdateStatus(team.id, 'disqualified')}
                                                disabled={updateStatusMutation.isPending}
                                            >
                                                <ShieldX className="mr-1 h-4 w-4" /> Disqualify
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
                                <td colSpan={8} className="px-6 py-16 text-center text-muted-foreground">
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
                            {teams?.filter((team) => selectedTeamIds.includes(team.id)).map((team) => (
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
