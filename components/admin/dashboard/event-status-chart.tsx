"use client";
import Link from "next/link";
import { DonutChart } from "@tremor/react";
import { DashboardSection } from "./dashboard-section";
import type { EventStatusMetric } from "@/lib/admin-dashboard/dashboard-types";
import { formatNumber, formatPercent } from "@/lib/admin-dashboard/dashboard-formatters";

export function EventStatusChart({ data }: { data: EventStatusMetric[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <DashboardSection title="Event Status Distribution" description="Current lifecycle mix across all events">
      <div className="relative">
        <DonutChart data={data} category="value" index="status" colors={data.map((item) => item.color)} valueFormatter={formatNumber} className="h-52" showAnimation={false} />
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><div><p className="text-2xl font-bold">{total}</p><p className="text-[10px] text-muted-foreground">EVENTS</p></div></div>
      </div>
      <div className="mt-3 grid gap-2">
        {data.map((item) => <Link key={item.status} href="/organizer/events" className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs hover:bg-muted"><span>{item.status}</span><span className="text-muted-foreground">{item.value} · {formatPercent((item.value / total) * 100)}</span></Link>)}
      </div>
    </DashboardSection>
  );
}
