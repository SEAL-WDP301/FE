"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ExternalLink, Send, BellRing, ChevronLeft, ChevronRight, CheckCircle2, Clock, Users } from "lucide-react";
import Link from "next/link";
import { useAdminSocket } from "@/hooks/use-admin-socket";
// removed duplicate React imports
import { enqueueSnackbar } from "notistack";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaGithub, FaSnowflake } from "react-icons/fa";

export default function EventSubmissionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const eventId = params.id as string;
  const roundId = params.roundId as string;
  
  const defaultTab = searchParams.get("tab") === "activitylog" ? "activity" : "submissions";
  const [selectedTrackId, setSelectedTrackId] = useState<number | "">("");
  const [submissionFilter, setSubmissionFilter] = useState<"all" | "submitted" | "unsubmitted">("all");
  const [page, setPage] = useState(1);
  const [isBulkReminderOpen, setIsBulkReminderOpen] = useState(false);
  const [selectedTeamForStatus, setSelectedTeamForStatus] = useState<number | null>(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedTeamFilterForLogs, setSelectedTeamFilterForLogs] = useState<string>("all");
  const PAGE_SIZE = 10;
  const queryClient = useQueryClient();

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

  const currentRound = event?.rounds?.find((r: any) => r.id === Number(roundId));
  const isGithubRound = currentRound?.submissionType === "github_link";

  const { data: eventCommits } = useQuery({
    queryKey: ["eventCommits", eventId],
    queryFn: async () => {
      const res = await axiosClient.get(`/github/commits/event/${eventId}`);
      return res.data;
    },
    enabled: isGithubRound,
  });

  const { data: collabStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["collabStatus", selectedTeamForStatus],
    queryFn: async () => {
      const res = await axiosClient.get(`/github/repos/${selectedTeamForStatus}/collaborator-status`);
      return res.data.data;
    },
    enabled: !!selectedTeamForStatus && isStatusOpen,
  });

  const freezeAllMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosClient.post(`/github/repos/freeze-event/${eventId}`);
      return res.data;
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message || "Repositories frozen successfully", { variant: "success" });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to freeze repositories", { variant: "error" });
    }
  });

  const syncCommitsMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosClient.post(`/github/repos/sync-event/${eventId}`);
      return res.data;
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message || "Commits synced successfully", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["eventCommits", eventId] });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to sync commits", { variant: "error" });
    }
  });

  const { socket, isConnected } = useAdminSocket({ eventId, roundId });

  useEffect(() => {
    if (!socket) return;

    const handleSubmissionCreated = (data: any) => {
      enqueueSnackbar(`📁 New submission from team: ${data.teamName}`, { variant: "info" });
      queryClient.invalidateQueries({ queryKey: ["organizerSubmissions", eventId] });
    };

    socket.on("submission.created", handleSubmissionCreated);

    const handleNewCommit = (data: any) => {
      enqueueSnackbar(
        `🚀 [${data.teamName}] ${data.pusher} vừa commit: "${data.message}"`, 
        { variant: 'info' }
      );
      
      // Update cache instantly
      const updateFn = (oldData: any) => {
        if (!oldData) return oldData;
        const newCommit = {
          id: data.commitHash || Date.now(),
          teamId: data.teamId,
          team: { name: data.teamName },
          commitHash: data.commitHash || data.commitUrl?.split('/').pop(),
          message: data.message,
          pusher: data.pusher,
          url: data.commitUrl,
          timestamp: data.timestamp || new Date().toISOString(),
        };
        
        if (Array.isArray(oldData)) {
          return [newCommit, ...oldData];
        } else if (oldData.data && Array.isArray(oldData.data)) {
          return { ...oldData, data: [newCommit, ...oldData.data] };
        }
        return oldData;
      };

      // Try both string and number just in case
      queryClient.setQueryData(["eventCommits", eventId], updateFn);
      queryClient.setQueryData(["eventCommits", Number(eventId)], updateFn);
      
      // Also invalidate fuzzy match (any query starting with eventCommits)
      queryClient.invalidateQueries({ queryKey: ["eventCommits"] });
    };

    socket.on('github.commit.new', handleNewCommit);

    return () => {
      socket.off("submission.created", handleSubmissionCreated);
      socket.off('github.commit.new', handleNewCommit);
    };
  }, [socket, queryClient, eventId]);

  // Bulk Reminder Mutation
  const bulkRemindMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosClient.post(`/organizer/submissions/events/${eventId}/rounds/${roundId}/bulk-remind`);
      return res.data;
    },
    onSuccess: (data) => {
      enqueueSnackbar(`Successfully sent reminders to ${data.data?.unsubmittedCount + data.data?.submittedCount} teams!`, { variant: "success" });
      setIsBulkReminderOpen(false);
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to send bulk reminders", { variant: "error" });
      setIsBulkReminderOpen(false);
    },
  });

  const filteredSubmissions = submissions?.filter((sub: any) => {
    if (submissionFilter === "submitted") return sub.isSubmittedStatus === true;
    if (submissionFilter === "unsubmitted") return sub.isSubmittedStatus === false;
    return true;
  }) || [];

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedTrackId, submissionFilter]);

  const totalRows = filteredSubmissions.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
  const paginatedSubmissions = filteredSubmissions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const [timeRemaining, setTimeRemaining] = useState<{text: string, color: string} | null>(null);

  useEffect(() => {
    if (!currentRound?.submissionDeadline) {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const diff = new Date(currentRound.submissionDeadline).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeRemaining({ text: "Time's up", color: "text-red-500 font-bold" });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      if (days > 3) {
        setTimeRemaining({ text: `${days}d ${hours}h ${minutes}m ${seconds}s left`, color: "text-green-600 dark:text-green-400 font-medium" });
      } else if (days > 0) {
        setTimeRemaining({ text: `${days}d ${hours}h ${minutes}m ${seconds}s left`, color: "text-orange-500 font-medium" });
      } else if (hours > 0) {
        setTimeRemaining({ text: `${hours}h ${minutes}m ${seconds}s left`, color: "text-red-500 font-bold" });
      } else {
        setTimeRemaining({ text: `${minutes}m ${seconds}s left`, color: "text-red-600 font-bold animate-pulse" });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentRound?.submissionDeadline]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
            {isConnected && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Live
              </span>
            )}
          </div>
          <div className="text-muted-foreground mt-2 space-y-1">
            <p>Review team submissions across all active rounds.</p>
            {currentRound?.submissionDeadline && (
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Deadline: {new Date(currentRound.submissionDeadline).toLocaleString()}
              </p>
            )}
            {!currentRound?.submissionDeadline && currentRound && (
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Deadline: Not set
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
          <Button variant="outline" className="gap-2 border-blue-500/20 text-blue-600 hover:bg-blue-50 w-full md:w-auto">
            <Download className="h-4 w-4" />
            Export All
          </Button>
          {timeRemaining && (
            <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-border">
              <Clock className="h-5 w-5 text-muted-foreground" />
              {/* tăng kích thước text timeRemaining */}
              <span className={`${timeRemaining.color} text-lg`}>{timeRemaining.text}</span>
            </div>
          )}
        </div>
      </div>
      <Tabs 
        value={defaultTab}
        onValueChange={(val) => {
          const newParams = new URLSearchParams(searchParams.toString());
          if (val === "activity") {
            newParams.set("tab", "activitylog");
          } else {
            newParams.delete("tab");
          }
          router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
        }}
      >
        {isGithubRound && (
          <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="submissions" className="rounded-lg px-6">Submissions</TabsTrigger>
            <TabsTrigger value="activity" className="rounded-lg px-6">Global Activity Log</TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="submissions" className="mt-0">
          <GlassCard className="p-6 rounded-[24px]">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selectedTrackId}
              onChange={(e) => {
                setSelectedTrackId(e.target.value ? Number(e.target.value) : "");
              }}
              className="bg-background border border-border text-foreground text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 min-w-[150px]"
            >
              <option value="">All Tracks</option>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {event?.tracks?.map((track: any) => (
                <option key={track.id} value={track.id}>{track.name}</option>
              ))}
            </select>
            <select
              value={submissionFilter}
              onChange={(e) => {
                setSubmissionFilter(e.target.value as "all" | "submitted" | "unsubmitted");
              }}
              className="bg-background border border-border text-foreground text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 min-w-[150px]"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="unsubmitted">Unsubmitted</option>
            </select>
            <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border">
              Total: <span className="font-bold text-foreground">{totalRows}</span> rows
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isGithubRound && (
              <Button 
                variant="outline" 
                className="gap-2 border-cyan-500/30 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950"
                onClick={() => {
                  if (confirm("Are you sure you want to FREEZE ALL team repositories in this round? They will no longer be able to push code.")) {
                    freezeAllMutation.mutate();
                  }
                }}
                disabled={freezeAllMutation.isPending}
              >
                <FaSnowflake className="h-4 w-4" />
                Freeze Repositories
              </Button>
            )}
            <Button 
              variant="orange" 
              className="gap-2 shadow-[0_0_15px_rgba(243,112,33,0.2)]"
              onClick={() => setIsBulkReminderOpen(true)}
            >
              <BellRing className="h-4 w-4" />
              Bulk Reminder
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold w-16">#</th>
                <th className="px-6 py-4 font-semibold">Team Name</th>
                <th className="px-6 py-4 font-semibold">Track & Round</th>
                <th className="px-6 py-4 font-semibold">Submitted By</th>
                <th className="px-6 py-4 font-semibold">Links</th>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : paginatedSubmissions.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                paginatedSubmissions.map((sub: any, idx: number) => (
                  <tr key={sub.id} className="border-b border-border hover:bg-muted/10">
                    <td className="px-6 py-4 font-medium text-muted-foreground">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-6 py-4 font-medium">{sub.team?.name}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <div className="font-semibold">{sub.team?.track?.name}</div>
                        <div className="text-muted-foreground">{sub.round?.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {sub.isSubmittedStatus ? (
                        sub.submittedBy?.name || sub.submittedBy?.email || "Team Leader"
                      ) : (
                        <span className="text-xs font-semibold text-red-500 bg-red-500/10 px-2 py-1 rounded-md">
                          Unsubmitted
                        </span>
                      )}
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
                      {sub.isSubmittedStatus ? (
                        new Date(sub.updatedAt || sub.createdAt).toLocaleString()
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isGithubRound && sub.githubUrl && (
                        <Button 
                          variant="ghost" 
                          size="icon-sm" 
                          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 mr-2" 
                          title="Collaborator Status" 
                          onClick={() => { 
                            setSelectedTeamForStatus(sub.team.id); 
                            setIsStatusOpen(true); 
                          }}
                        >
                          <Users className="h-4 w-4" />
                          <span className="sr-only">Status</span>
                        </Button>
                      )}
                      <Link href={`/organizer/events/${eventId}/messages?teamId=${sub.team?.id}`}>
                        <Button variant="ghost" size="icon-sm" className="text-orange-500 hover:text-orange-600 hover:bg-orange-50" title="Message team">
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Message</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No submissions found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border mt-4 pt-4">
            <span className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{(page - 1) * PAGE_SIZE + 1}</span> to <span className="font-semibold text-foreground">{Math.min(page * PAGE_SIZE, totalRows)}</span> of <span className="font-semibold text-foreground">{totalRows}</span>
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>
              <div className="text-sm font-medium px-2">
                Page {page} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </GlassCard>
      </TabsContent>

      {isGithubRound && (
      <TabsContent value="activity" className="mt-0">
        <GlassCard className="p-6 rounded-[24px]">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FaGithub className="h-5 w-5 text-orange-500" />
              Global Activity Log (All Teams)
            </h3>
            {eventCommits?.data && (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-blue-500/20 text-blue-600 hover:bg-blue-50"
                  onClick={() => syncCommitsMutation.mutate()}
                  disabled={syncCommitsMutation.isPending}
                >
                  {syncCommitsMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
                  Sync Missed Commits
                </Button>
                <select
                  value={selectedTeamFilterForLogs}
                  onChange={(e) => setSelectedTeamFilterForLogs(e.target.value)}
                  className="bg-background border border-border text-foreground text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 min-w-[150px]"
                >
                  <option value="all">All Teams</option>
                  {Array.from(new Map(eventCommits.data.map((commit: any) => [commit.teamId, commit.team?.name])).entries()).map(([teamId, teamName]) => (
                    <option key={teamId} value={teamId as number}>{(teamName as string) || `Team ${teamId}`}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 mt-4">
            {eventCommits?.data && eventCommits.data.filter((c: any) => selectedTeamFilterForLogs === "all" || c.teamId.toString() === selectedTeamFilterForLogs).length > 0 ? (
              <div className="relative border-l-2 border-border/60 ml-2 pl-5 space-y-6 py-2">
                {eventCommits.data
                  .filter((c: any) => selectedTeamFilterForLogs === "all" || c.teamId.toString() === selectedTeamFilterForLogs)
                  .map((commit: any, index: number) => {
                  const isLatest = index === 0;
                  return (
                    <div key={commit.id} className="relative flex gap-4 text-sm">
                      <div className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-background ${isLatest ? 'bg-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.15)]' : 'bg-muted-foreground/30'}`} />
                      <div className="flex-1 opacity-100 transition-opacity duration-300 bg-muted/20 p-4 rounded-xl border border-border/50 hover:bg-muted/40">
                        <p className="font-semibold text-foreground/90">
                          <span className="text-blue-500 mr-2">[{commit.team?.name}]</span>
                          <a href={commit.url} target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors">
                            {commit.message}
                          </a>
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {new Date(commit.timestamp).toLocaleString()} 
                          <span className="mx-1">•</span>
                          <span className="font-medium text-orange-500">{commit.pusher}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-muted-foreground justify-center p-8 border border-dashed rounded-xl border-border/50">
                <Clock className="h-5 w-5" />
                <p className="text-sm">No commits pushed yet for this round.</p>
              </div>
            )}
          </div>
        </GlassCard>
      </TabsContent>
      )}
      </Tabs>

      {/* Bulk Reminder Modal */}
      <Dialog open={isBulkReminderOpen} onOpenChange={setIsBulkReminderOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-orange-500" />
              Send Bulk Reminders
            </DialogTitle>
            <DialogDescription>
              This will send automated notifications (In-app & Email) to all teams competing in this round.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="bg-muted/50 p-4 rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground text-sm">For unsubmitted teams:</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    "Urgent Reminder: Submission Deadline for [Round Name]... Deadline: [Date] | Time Remaining: [X days, Y hours]... Please submit your files or code repositories before the deadline."
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 pt-2 border-t border-border">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground text-sm">For submitted teams:</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    "Reminder: Review your submission for [Round Name]... The system will close at: [Date] | Time Remaining: [X days, Y hours]... We recommend that you double-check your uploaded files."
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-foreground">
              Are you sure you want to proceed?
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkReminderOpen(false)} disabled={bulkRemindMutation.isPending}>
              Cancel
            </Button>
            <Button 
              variant="orange" 
              onClick={() => bulkRemindMutation.mutate()}
              disabled={bulkRemindMutation.isPending}
            >
              {bulkRemindMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reminders"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Team GitHub Status
            </DialogTitle>
            <DialogDescription>
              Check if members have accepted their repository invitation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-2">
            {isLoadingStatus ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : collabStatus && collabStatus.length > 0 ? (
              <div className="space-y-3">
                {collabStatus.map((user: any) => (
                  <div key={user.userId} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm flex items-center gap-2">
                        {user.name} {user.isLeader && <span className="text-[10px] bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded">LEADER</span>}
                      </span>
                      <span className="text-xs text-muted-foreground">{user.githubUsername || "No GitHub ID"}</span>
                    </div>
                    <div>
                      {user.status === 'Accepted' && <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded font-semibold">Accepted</span>}
                      {user.status === 'Pending' && <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded font-semibold">Pending</span>}
                      {user.status === 'Missing' && <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded font-semibold">Missing</span>}
                      {user.status === 'Not Invited' && <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded font-semibold">Missing</span>}
                      {user.status === 'No GitHub Account Linked' && <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded font-semibold whitespace-nowrap">No GitHub ID</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center text-muted-foreground">No data available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
