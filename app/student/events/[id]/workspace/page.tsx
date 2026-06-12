"use client";

import { motion } from "framer-motion";
import { 
  Clock, 
  CheckCircle2, 
  Upload, 
  MessageSquare, 
  Award, 
  ChevronRight,
  Target,
  Zap,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { workspaceApi } from "@/lib/api/workspace.api";
import { useEffect, useState } from "react";

// Helper for countdown
function useCountdown(targetDate: string | null) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default function WorkspaceOverviewPage() {
  const params = useParams();
  const eventId = params.id as string;
  const basePath = `/student/events/${eventId}/workspace`;

  const { data, isLoading } = useQuery({
    queryKey: ["workspace", eventId],
    queryFn: () => workspaceApi.getWorkspaceOverview(Number(eventId)),
  });

  const workspaceData = data?.data;
  const currentActiveRound = workspaceData?.currentActiveRound;
  const rounds = workspaceData?.rounds || [];
  const timeLeft = useCountdown(currentActiveRound?.submissionDeadline || null);

  const activeIndex = rounds.findIndex((r: any) => r.status === "open");
  const completedCount = rounds.filter((r: any) => r.status === "closed" || r.status === "results_published").length;
  const currentIndex = activeIndex !== -1 ? activeIndex : completedCount - 1;
  const progressWidth = rounds.length > 0 && currentIndex >= 0 ? ((currentIndex + 0.5) / rounds.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          {currentActiveRound ? (
            <Badge variant="outline" className="mb-3 border-orange-500/30 text-orange-400 bg-orange-500/10">
              Current Phase: {currentActiveRound.name}
            </Badge>
          ) : (
            <Badge variant="outline" className="mb-3 border-zinc-500/30 text-zinc-400 bg-zinc-500/10">
              No Active Phase
            </Badge>
          )}
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Workspace Overview
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track your progress, deadlines, and team performance all in one place.
          </p>
        </div>
      </header>

      {/* Competition Timeline Stepper */}
      <section>
        <GlassCard className="p-6 md:p-8 rounded-[24px] bg-card border-border relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <h2 className="text-lg font-semibold mb-8 flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-500" />
            Competition Journey
          </h2>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-[24px] left-0 w-full h-1 bg-border -translate-y-1/2 rounded-full hidden md:block" />
            <div 
              className="absolute top-[24px] left-0 h-1 bg-orange-500 -translate-y-1/2 rounded-full hidden md:block transition-all duration-1000 ease-out" 
              style={{ width: `${progressWidth}%` }} 
            />
            
            <div className={`grid grid-cols-1 md:grid-cols-${Math.max(1, rounds.length)} gap-6 relative z-10`}>
              {rounds.map((round: any, index: number) => {
                const isCompleted = round.status === "closed" || round.status === "results_published";
                const isActive = round.status === "open";

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={round.id} 
                    className="flex flex-col items-center text-center"
                  >
                    <div 
                      className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 transition-all duration-300 shadow-lg
                        ${isCompleted ? "bg-orange-500 text-white" : 
                          isActive ? "bg-background border-2 border-orange-500 text-orange-500 shadow-[0_0_20px_rgba(243,112,33,0.4)]" : 
                          "bg-muted border border-border text-muted-foreground"}`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <span className="font-bold text-lg">{round.roundNumber}</span>}
                    </div>
                    <h3 className={`font-semibold ${isActive ? "text-orange-400" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                      {round.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      {round.submissionDeadline ? new Date(round.submissionDeadline).toLocaleDateString() : "TBA"}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Action Center - Spans 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {currentActiveRound ? (
            <GlassCard glow className="p-8 rounded-[24px] bg-gradient-to-br from-card to-background border-orange-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-orange-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-orange-500/10 transition-colors duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-sm font-semibold uppercase tracking-wider text-red-400">Action Required</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Submit {currentActiveRound.name} Project</h2>
                  <p className="text-muted-foreground max-w-md">
                    Please submit your files and project links before the deadline.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4 bg-background/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 min-w-[200px]">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Time Remaining</span>
                  </div>
                  <div className="text-3xl font-mono font-bold text-foreground">
                    {timeLeft.days > 0 && <>{timeLeft.days}<span className="text-xl text-muted-foreground">d</span> : </>}
                    {String(timeLeft.hours).padStart(2, '0')}<span className="text-xl text-muted-foreground">h</span> : {String(timeLeft.minutes).padStart(2, '0')}<span className="text-xl text-muted-foreground">m</span>
                  </div>
                  <Link href={`${basePath}/submissions`} className="w-full">
                    <Button variant="orange" className="w-full mt-2 rounded-xl h-11 shadow-[0_0_15px_rgba(243,112,33,0.3)]">
                      <Upload className="h-4 w-4 mr-2" />
                      {workspaceData.latestSubmission ? "Resubmit / Edit" : "Upload Files"}
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-8 rounded-[24px] bg-card border-border flex items-center justify-center">
              <p className="text-muted-foreground">No active round currently.</p>
            </GlassCard>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            <GlassCard className="p-6 rounded-[24px] hover:bg-white/[0.02] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl">
                  <Award className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">
                {workspaceData?.latestSubmission ? "Submitted" : "Pending"}
              </h3>
              <p className="text-sm text-muted-foreground">Current Round Status</p>
            </GlassCard>
            
            <GlassCard className="p-6 rounded-[24px] hover:bg-white/[0.02] transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold text-foreground">Team Activity</span>
                </div>
                <p className="text-sm text-muted-foreground">Check out your team members and roles.</p>
              </div>
              <Link href={`${basePath}/my-team`}>
                <Button variant="ghost" className="w-full justify-between mt-4 hover:bg-white/5">
                  View Team Members
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </GlassCard>
          </div>
        </div>

        {/* Right Sidebar - Recent Feedback */}
        <div className="space-y-6">
          <GlassCard className="p-6 rounded-[24px] h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-500" />
                Recent Feedback
              </h2>
            </div>

            <div className="flex-1 space-y-4 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No feedback yet.</p>
            </div>

            <Link href={`${basePath}/mentor`} className="mt-6 block">
              <Button variant="outline" className="w-full rounded-xl border-border hover:bg-muted">
                Open Mentor Hub
              </Button>
            </Link>
          </GlassCard>
        </div>
        
      </div>
    </div>
  );
}
