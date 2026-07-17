"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BarChart } from "@tremor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardSection } from "./dashboard-section";
import type { EventMonthlyMetric } from "@/lib/admin-dashboard/dashboard-types";
import { formatNumber } from "@/lib/admin-dashboard/dashboard-formatters";

export function EventsByMonthChart({ data }: { data: EventMonthlyMetric[] }) {
  const [metric, setMetric] = useState<"Created" | "Starting" | "Completed">("Created");
  const total = useMemo(() => data.reduce((sum, item) => sum + item[metric], 0), [data, metric]);
  return (
    <DashboardSection title="Events by Month" description={`${formatNumber(total)} ${metric.toLowerCase()} events in the selected year`} action={
      <Select value={metric} onValueChange={(value) => value && setMetric(value as typeof metric)}>
        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
        <SelectContent>{["Created", "Starting", "Completed"].map((item) => <SelectItem key={item} value={item}>{item} Events</SelectItem>)}</SelectContent>
      </Select>
    }>
      <BarChart data={data} index="month" categories={[metric]} colors={["orange"]} valueFormatter={formatNumber} yAxisWidth={32} className="h-72" showAnimation={false} />
      <Link href="/organizer/events" className="mt-3 inline-block text-xs font-semibold text-orange-400 hover:text-orange-300">View Events →</Link>
    </DashboardSection>
  );
}
