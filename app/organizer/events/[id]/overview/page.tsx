"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Settings, Calendar, GitMerge, Trophy, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

import {
  deleteOrganizerEvent,
  getOrganizerEvent,
  updateOrganizerEventStatus,
  type EventStatus,
} from "@/lib/api/organizer-events.api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EventOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const queryClient = useQueryClient();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ["organizerEvent", eventId],
    queryFn: () => getOrganizerEvent(eventId),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: EventStatus) => updateOrganizerEventStatus(eventId, newStatus),
    onSuccess: () => {
      enqueueSnackbar('Event status updated successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ["organizerEvent", eventId] });
      queryClient.invalidateQueries({ queryKey: ["organizerEvents"] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update status', { variant: 'error' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteOrganizerEvent(eventId),
    onSuccess: () => {
      enqueueSnackbar("Event deleted successfully", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["organizerEvents"] });
      router.push("/organizer/events");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to delete event", { variant: "error" });
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
          <div className="text-muted-foreground mt-1 flex items-center gap-2">
            Season {event.season} {event.year} • 
            <select
              value={event.status}
              onChange={(e) => updateStatusMutation.mutate(e.target.value as EventStatus)}
              disabled={updateStatusMutation.isPending}
              className="bg-transparent border border-border rounded-md text-sm uppercase text-blue-500 font-semibold focus:ring-blue-500 focus:border-blue-500 p-1 cursor-pointer"
            >
              <option value="draft">DRAFT</option>
              <option value="active">ACTIVE</option>
              <option value="ongoing">ONGOING</option>
              <option value="closed">CLOSED</option>
            </select>
            {updateStatusMutation.isPending && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/organizer/events/${eventId}/edit`}>
            <Button variant="outline" className="gap-2 border-blue-500/20 text-blue-600 hover:bg-blue-50">
              <Settings className="h-4 w-4" />
              Edit Event
            </Button>
          </Link>
          <Button variant="destructive" className="gap-2" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Teams", value: String(event._count?.teams ?? 0), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Submissions", value: String(event._count?.submissions ?? 0), icon: FileText, color: "text-green-500", bg: "bg-green-500/10" },
          { title: "Tracks", value: String(event.tracks?.length ?? 0), icon: GitMerge, color: "text-purple-500", bg: "bg-purple-500/10" },
          { title: "Prize Pool", value: "🏆", icon: Trophy, color: "text-orange-500", bg: "bg-orange-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="p-6 rounded-[24px] hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Main Content Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* About Event */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-8 rounded-[24px]">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Event Information
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="font-medium text-foreground leading-relaxed">
                  {event.description || "No description provided for this event."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-muted/50 p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Start Date
                  </p>
                  <p className="font-semibold">{event.startDate ? new Date(event.startDate).toLocaleDateString() : "TBA"}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-red-400" /> Registration Deadline
                  </p>
                  <p className="font-semibold">{event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleDateString() : "TBA"}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Prizes */}
        <div className="space-y-6">
          <GlassCard className="p-8 rounded-[24px]">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-500" />
              Prize Structure
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20">
                <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider mb-1">1st Place</p>
                <p className="font-bold text-lg">{event.prize1st || "TBA"}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-400/10 to-transparent border border-slate-400/20">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">2nd Place</p>
                <p className="font-bold text-lg">{event.prize2nd || "TBA"}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-700/10 to-transparent border border-orange-700/20">
                <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">3rd Place</p>
                <p className="font-bold text-lg">{event.prize3rd || "TBA"}</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete event</DialogTitle>
            <DialogDescription>
              This will permanently delete {event.name}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={deleteMutation.isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
