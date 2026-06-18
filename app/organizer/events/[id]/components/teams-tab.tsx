"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { enqueueSnackbar } from "notistack";
import { Search, CheckCircle, XCircle, Trash2, Eye, Crown, Users, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TeamsTab({ event }: { event: any }) {
    const queryClient = useQueryClient();
    const [selectedTrackId, setSelectedTrackId] = useState<number | "all">("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

    const [eliminationReason, setEliminationReason] = useState("");
    const [teamToEliminate, setTeamToEliminate] = useState<number | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedTeamForDetails, setSelectedTeamForDetails] = useState<any | null>(null);

    const [isAssignMentorOpen, setIsAssignMentorOpen] = useState(false);
    const [selectedMentorUser, setSelectedMentorUser] = useState<number | "">("");

    // Fetch Teams for the selected track
    const { data: teams, isLoading } = useQuery({
        queryKey: ['organizerTeams', event.id, selectedTrackId],
        queryFn: async () => {
            const url = selectedTrackId === "all" 
                ? `/organizer/teams/events/${event.id}` 
                : `/organizer/teams/events/${event.id}?trackId=${selectedTrackId}`;
            const res = await axiosClient.get(url);
            return res.data.data;
        },
        enabled: true,
    });

    // Fetch Users for mentor assignment
    const { data: users, isLoading: isLoadingUsers } = useQuery({
        queryKey: ["allUsers"],
        queryFn: async () => {
            const res = await axiosClient.get(`/users`);
            return res.data.data;
        },
        enabled: isAssignMentorOpen,
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
            // Update selected team details if open
            if (selectedTeamForDetails) {
                queryClient.invalidateQueries({ queryKey: ['organizerTeams', event.id, selectedTrackId] });
            }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Failed to update status', { variant: 'error' });
        }
    });

    // Assign Mentor Mutation
    const assignMentorMutation = useMutation({
        mutationFn: async ({ teamId, stakeholderId }: { teamId: number, stakeholderId: number }) => {
            const res = await axiosClient.post(`/organizer/stakeholders/teams/${teamId}/mentors`, { stakeholderId });
            return res.data;
        },
        onSuccess: () => {
            enqueueSnackbar('Mentor assigned successfully', { variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['organizerTeams', event.id, selectedTrackId] });
            setIsAssignMentorOpen(false);
            setSelectedMentorUser("");
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Failed to assign mentor', { variant: 'error' });
        }
    });

    // Unassign Mentor Mutation
    const unassignMentorMutation = useMutation({
        mutationFn: async ({ teamId, stakeholderId }: { teamId: number, stakeholderId: number }) => {
            const res = await axiosClient.delete(`/organizer/stakeholders/teams/${teamId}/mentors/${stakeholderId}`);
            return res.data;
        },
        onSuccess: () => {
            enqueueSnackbar('Mentor unassigned successfully', { variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['organizerTeams', event.id, selectedTrackId] });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Failed to unassign mentor', { variant: 'error' });
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

            {/* Team Details Dialog */}
            <Dialog open={!!selectedTeamForDetails} onOpenChange={(open) => {
                if(!open) {
                    setSelectedTeamForDetails(null);
                    setIsAssignMentorOpen(false);
                }
            }}>
                <DialogContent className="sm:max-w-[700px] bg-card border-border max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            Team: <span className="text-blue-500">{currentTeamDetails?.name}</span>
                            {currentTeamDetails?.status && (
                                <span className="ml-2">
                                    {getStatusBadge(currentTeamDetails.status)}
                                </span>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            Review team members, registration details, and assign mentors.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="mt-4 space-y-6">
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
                                    <p className="font-semibold text-foreground text-base">{currentTeamDetails?.leader?.name || 'Unknown'}</p>
                                    <p className="text-sm text-muted-foreground">{currentTeamDetails?.leader?.email}</p>
                                    {currentTeamDetails?.leader?.studentProfile && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Code: {currentTeamDetails.leader.studentProfile.studentCode} • 
                                            {currentTeamDetails.leader.studentProfile.universityName && ` ${currentTeamDetails.leader.studentProfile.universityName}`}
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
                                const otherMembers = currentTeamDetails?.members?.filter((m: any) => m.role !== 'leader') || [];
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

                        {/* Mentors */}
                        <div className="p-4 border border-blue-500/20 rounded-lg bg-blue-500/5">
                             <div className="flex justify-between items-center mb-3">
                                <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <Users className="w-4 h-4" />
                                    Mentors
                                </h4>
                                {!isAssignMentorOpen && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-7 text-xs gap-1 border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                                      onClick={() => setIsAssignMentorOpen(true)}
                                    >
                                        <UserPlus className="w-3 h-3" /> Assign Mentor
                                    </Button>
                                )}
                             </div>

                             {isAssignMentorOpen && (
                                 <div className="mb-4 p-3 border border-border rounded bg-background flex flex-col gap-2">
                                     <div className="text-xs font-medium text-foreground">Select a Stakeholder to Assign as Mentor</div>
                                     <select
                                        value={selectedMentorUser}
                                        onChange={(e) => setSelectedMentorUser(e.target.value ? Number(e.target.value) : "")}
                                        className="w-full bg-muted border border-border text-foreground text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                                     >
                                        <option value="">-- Choose Stakeholder --</option>
                                        {isLoadingUsers ? (
                                            <option disabled>Loading...</option>
                                        ) : users?.filter((u: any) => u.role === 'stakeholder').map((u: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                        ))}
                                     </select>
                                     <div className="flex justify-end gap-2 mt-1">
                                         <Button size="sm" variant="ghost" onClick={() => setIsAssignMentorOpen(false)}>Cancel</Button>
                                         <Button 
                                            size="sm" 
                                            disabled={!selectedMentorUser || assignMentorMutation.isPending}
                                            onClick={() => assignMentorMutation.mutate({ teamId: currentTeamDetails.id, stakeholderId: Number(selectedMentorUser) })}
                                         >
                                            {assignMentorMutation.isPending ? "Assigning..." : "Assign"}
                                         </Button>
                                     </div>
                                 </div>
                             )}

                             {currentTeamDetails?.mentorAssignments?.length === 0 ? (
                                 <p className="text-sm text-muted-foreground italic">No mentors assigned.</p>
                             ) : (
                                 <div className="space-y-2">
                                     {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                     {currentTeamDetails?.mentorAssignments?.map((assignment: any) => (
                                         <div key={assignment.mentorId} className="flex justify-between items-center py-2 border-t border-border/50 first:border-0 first:pt-0">
                                            <div>
                                                <p className="font-semibold text-foreground text-sm">{assignment.mentor?.name || 'Unknown User'}</p>
                                                <p className="text-xs text-muted-foreground">{assignment.mentor?.email}</p>
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className="h-8 text-xs text-red-500 hover:bg-red-500/10 hover:text-red-600 px-2"
                                                onClick={() => unassignMentorMutation.mutate({ teamId: currentTeamDetails.id, stakeholderId: assignment.mentorId })}
                                                disabled={unassignMentorMutation.isPending}
                                            >
                                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                                            </Button>
                                         </div>
                                     ))}
                                 </div>
                             )}
                        </div>

                    </div>
                </DialogContent>
            </Dialog>

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
