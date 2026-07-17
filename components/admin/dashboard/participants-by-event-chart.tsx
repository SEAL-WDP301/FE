"use client";
import Link from "next/link";
import { useState } from "react";
import { BarChart } from "@tremor/react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardSection } from "./dashboard-section";
import type { ParticipantsByEventMetric } from "@/lib/admin-dashboard/dashboard-types";
import { formatNumber, formatPercent } from "@/lib/admin-dashboard/dashboard-formatters";

export function ParticipantsByEventChart({ data }: { data: ParticipantsByEventMetric[] }) {
  const [limit, setLimit] = useState("5");
  const visible = data.slice(0, Number(limit));
  return <DashboardSection title="Participants by Event" description="Top events ranked by approved unique participants" action={
    <Select value={limit} onValueChange={(value) => value && setLimit(value)}><SelectTrigger className="w-24"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="5">Top 5</SelectItem><SelectItem value="10">Top 10</SelectItem></SelectContent></Select>
  }>
    <BarChart data={visible} index="event" categories={["Participants"]} colors={["orange"]} valueFormatter={formatNumber} layout="vertical" className="h-80" showAnimation={false} />
    <div className="mt-4 grid gap-2 lg:grid-cols-2 xl:grid-cols-5">
      {visible.map((item) => {
        const capacityRate = (item.Participants / item.capacity) * 100;
        return <Link href="/organizer/events" key={item.id} className="rounded-xl border border-border p-3 hover:border-orange-500/30">
          <div className="flex items-start justify-between gap-2"><p className="line-clamp-2 text-xs font-semibold">{item.event}</p>{capacityRate >= 90 && <Badge variant="warning">Near capacity</Badge>}</div>
          <p className="mt-2 text-[11px] text-muted-foreground">{item.registrations} registered · {item.teams} teams · {item.submissions} submitted</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Capacity {formatPercent(capacityRate)}</p>
        </Link>;
      })}
    </div>
  </DashboardSection>;
}
