"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

export default function EventSubmissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
          <p className="text-muted-foreground mt-1">
            Review team submissions across all active rounds.
          </p>
        </div>
        <Button variant="outline" className="gap-2 border-blue-500/20 text-blue-600 hover:bg-blue-50">
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </div>

      <GlassCard className="p-12 text-center rounded-[24px]">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Submission Review</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          This section is currently under construction. Soon you will be able to view, download, and assign grades to team submissions.
        </p>
        <Button variant="outline" disabled>
          Feature Coming Soon
        </Button>
      </GlassCard>
    </div>
  );
}
