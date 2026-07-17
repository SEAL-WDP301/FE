"use client";
import { AreaChart } from "@tremor/react";
import { DashboardSection } from "./dashboard-section";
import type { SubmissionActivityMetric } from "@/lib/admin-dashboard/dashboard-types";
import { formatNumber } from "@/lib/admin-dashboard/dashboard-formatters";

export function SubmissionActivityChart({ data }: { data: SubmissionActivityMetric[] }) {
  return <DashboardSection title="Submission Activity" description="Peak: 20:00 · 42 submissions in 24h · next deadline in 5h">
    <AreaChart data={data} index="date" categories={["Submissions"]} colors={["orange"]} valueFormatter={formatNumber} className="h-64" showAnimation={false} />
    <p className="mt-3 text-xs text-muted-foreground">64 teams have not submitted yet.</p>
  </DashboardSection>;
}
