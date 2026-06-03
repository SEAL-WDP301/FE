"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowRight,
  Clock,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

const todayTeams = [
  {
    id: 1,
    name: "Nebula Forge",
    category: "AI/ML",
    round: "Semi Final",
    status: "Submitted",
  },

  {
    id: 2,
    name: "Code Titans",
    category: "Cloud",
    round: "Final",
    status: "Late",
  },

  {
    id: 3,
    name: "Pixel Pioneers",
    category: "Web App",
    round: "Round 2",
    status: "Submitted",
  },

  {
    id: 4,
    name: "Quantum Crew",
    category: "Cyber Security",
    round: "Round 1",
    status: "Submitted",
  },
];

export function TodayEvaluations() {
  return (
    <GlassCard className="p-6">
      <div className="mb-5 flex items-center justify-between space-y-4">
        <div>
          <h2 className="flex items-center gap-5 text-lg font-semibold">
            <span className="glow-orange-sm h-2 w-2 rounded-full bg-primary" />
            Today Evaluations
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Teams awaiting your review
          </p>
        </div>

        <Link
          href="/judge/evaluation"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View all

          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {todayTeams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="group flex flex-col gap-3 rounded-xl border border-border bg-background/40 p-4 transition hover:border-primary/40 hover:bg-card/70 sm:flex-row sm:items-center"
          >
            <div className="flex gradient-orange grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-white">
              {team.name
                .split(" ")
                .map((x) => x[0])
                .join("")
                .slice(0, 2)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">
                  {team.name}
                </span>

                <Badge
                  variant="outline"
                  className="h-5 border-border bg-background/40 text-[10px]"
                >
                  {team.category}
                </Badge>

                <Badge
                  variant="outline"
                  className="h-5 border-border bg-background/40 text-[10px]"
                >
                  {team.round}
                </Badge>
              </div>

              <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span
                  className={
                    team.status === "Late"
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }
                >
                  ● {team.status}
                </span>

                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />

                  Due in 18h
                </span>
              </div>
            </div>

            <Link href="/judge/evaluation">
              <Button className="gradient-orange shrink-0 border-0 text-white hover:opacity-90">
                Review Submission

                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}