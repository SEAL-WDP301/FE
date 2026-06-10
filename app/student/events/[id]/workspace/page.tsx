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
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useParams } from "next/navigation";

// Hardcoded data for visual demonstration
const timelineSteps = [
  { id: 1, title: "Registration", date: "Oct 15", status: "completed" },
  { id: 2, title: "Round 1: Idea Pitch", date: "Oct 25", status: "completed" },
  { id: 3, title: "Round 2: MVP", date: "Nov 10", status: "active" },
  { id: 4, title: "Finals", date: "Nov 20", status: "upcoming" },
];

const mentorFeedback = [
  {
    id: 1,
    mentorName: "Dr. Alex Chen",
    role: "Technical Advisor",
    comment: "Great progress on the architecture. Make sure to optimize the database queries before the final submission.",
    time: "2 hours ago"
  }
];

export default function WorkspaceOverviewPage() {
  const params = useParams();
  const eventId = params.id as string;
  const basePath = `/student/events/${eventId}/workspace`;

  return (
    <div className="mx-auto max-w-[1500px] space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="outline" className="mb-3 border-orange-500/30 text-orange-400 bg-orange-500/10">
            Current Phase: Round 2
          </Badge>
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
            <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 rounded-full hidden md:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {timelineSteps.map((step, index) => {
                const isCompleted = step.status === "completed";
                const isActive = step.status === "active";
                const isUpcoming = step.status === "upcoming";

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={step.id} 
                    className="flex flex-col items-center text-center"
                  >
                    <div 
                      className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 transition-all duration-300 shadow-lg
                        ${isCompleted ? "bg-orange-500 text-white" : 
                          isActive ? "bg-background border-2 border-orange-500 text-orange-500 shadow-[0_0_20px_rgba(243,112,33,0.4)]" : 
                          "bg-muted border border-border text-muted-foreground"}`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <span className="font-bold text-lg">{step.id}</span>}
                    </div>
                    <h3 className={`font-semibold ${isActive ? "text-orange-400" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{step.date}</p>
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
                <h2 className="text-3xl font-bold mb-2">Submit Round 2 Project</h2>
                <p className="text-muted-foreground max-w-md">
                  Your Minimum Viable Product (MVP) source code and demonstration video must be submitted before the deadline.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 bg-background/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 min-w-[200px]">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Time Remaining</span>
                </div>
                <div className="text-3xl font-mono font-bold text-foreground">
                  48<span className="text-xl text-muted-foreground">h</span> : 12<span className="text-xl text-muted-foreground">m</span>
                </div>
                <Link href={`${basePath}/submissions`} className="w-full">
                  <Button variant="orange" className="w-full mt-2 rounded-xl h-11 shadow-[0_0_15px_rgba(243,112,33,0.3)]">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            <GlassCard className="p-6 rounded-[24px] hover:bg-white/[0.02] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl">
                  <Award className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="text-green-400 border-green-500/30">Top 15%</Badge>
              </div>
              <h3 className="text-3xl font-bold mb-1">85.5<span className="text-lg text-muted-foreground font-normal">/100</span></h3>
              <p className="text-sm text-muted-foreground">Round 1 Score</p>
            </GlassCard>
            
            <GlassCard className="p-6 rounded-[24px] hover:bg-white/[0.02] transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold text-foreground">Team Activity</span>
                </div>
                <p className="text-sm text-muted-foreground">Your team has been highly active this week. Keep up the momentum!</p>
              </div>
              <Link href={`${basePath}/my-team`}>
                <Button variant="ghost" className="w-full justify-between mt-4 hover:bg-white/5">
                  View Team Activity
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
              <Badge className="rounded-full">1 New</Badge>
            </div>

            <div className="flex-1 space-y-4">
              {mentorFeedback.map((feedback) => (
                <div key={feedback.id} className="p-4 rounded-2xl bg-muted/50 border border-white/5 relative group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold shadow-md">
                      {feedback.mentorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{feedback.mentorName}</p>
                      <p className="text-xs text-muted-foreground">{feedback.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-orange-500/50 pl-3">
                    "{feedback.comment}"
                  </p>
                  <div className="mt-3 text-[10px] text-muted-foreground text-right uppercase tracking-wider font-semibold">
                    {feedback.time}
                  </div>
                </div>
              ))}
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
