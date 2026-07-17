"use client";
import Link from "next/link";
import { BarList } from "@tremor/react";
import { DashboardSection } from "./dashboard-section";
import type { SubmissionStatusMetric } from "@/lib/admin-dashboard/dashboard-types";
import { formatNumber, formatPercent } from "@/lib/admin-dashboard/dashboard-formatters";

export function SubmissionStatusChart({ data }: { data: SubmissionStatusMetric[] }) {
  const submitted = data.find((item) => item.status === "On time")?.value ?? 0;
  const late = data.find((item) => item.status === "Late")?.value ?? 0;
  const failed = data.find((item) => item.status === "Failed upload")?.value ?? 0;
  const total = submitted + late + failed;
  return <DashboardSection title="Submission Status" description={`${formatNumber(total)} submissions · ${formatPercent(((submitted + late) / total) * 100)} upload success`}>
    <BarList data={data.map((item) => ({ name: item.status, value: item.value, color: item.color }))} valueFormatter={formatNumber} className="mt-2" />
    <Link href="/organizer/submissions" className="mt-6 inline-block text-xs font-semibold text-orange-400">View Submissions →</Link>
  </DashboardSection>;
}
