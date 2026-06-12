"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Plus, GraduationCap } from "lucide-react";

export default function EventStaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentors & Judges</h1>
          <p className="text-muted-foreground mt-1">
            Invite and assign roles to experts for this event.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Invite Mentor
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Invite Judge
          </Button>
        </div>
      </div>

      <GlassCard className="p-12 text-center rounded-[24px]">
        <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Staff Management</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          This section is currently under construction. Soon you will be able to manage all Mentors and Judges, view their assigned teams, and track their activities.
        </p>
        <Button variant="outline" disabled>
          Feature Coming Soon
        </Button>
      </GlassCard>
    </div>
  );
}
