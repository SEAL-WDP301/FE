"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Plus, GitMerge, Settings2, Trash2 } from "lucide-react";

export default function EventRoundsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tracks & Rounds</h1>
          <p className="text-muted-foreground mt-1">
            Manage the competition structure and deadlines.
          </p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Track
        </Button>
      </div>

      <GlassCard className="p-12 text-center rounded-[24px]">
        <GitMerge className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Competition Structure</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          This section is currently under construction. Soon you will be able to manage tracks, define multiple rounds, and set specific deadlines for each.
        </p>
        <Button variant="outline" disabled>
          Feature Coming Soon
        </Button>
      </GlassCard>
    </div>
  );
}
