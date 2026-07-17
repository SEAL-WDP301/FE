import { ProgressBar } from "@tremor/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { EventCapacityOverview } from "@/lib/organizer/registrations/registration-types";
import { formatRegistrationNumber } from "@/lib/organizer/registrations/registration-formatters";
export function EventCapacityCard({ capacity }: { capacity: EventCapacityOverview }) {
  const usage = (capacity.approved / capacity.capacity) * 100;
  const state = usage >= 100 ? "Full" : usage >= 90 ? "Nearly full" : usage >= 70 ? "Filling up" : "Available";
  return <Card><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>Event Capacity</CardTitle><CardDescription className="mt-1">{capacity.eventName}</CardDescription></div><Badge variant={usage >= 90 ? "warning" : "success"}>{state}</Badge></div></CardHeader><CardContent>
    <p className="text-3xl font-bold">{formatRegistrationNumber(capacity.approved)} <span className="text-base font-medium text-muted-foreground">/ {formatRegistrationNumber(capacity.capacity)}</span></p>
    <p className="mt-1 text-xs text-muted-foreground">approved participants</p>
    <ProgressBar value={usage} color={usage >= 90 ? "amber" : "orange"} className="mt-6" />
    <p className="mt-2 text-xs font-medium">{usage.toFixed(1)}% capacity used</p>
    <div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-xl border border-border p-3"><p className="text-xs text-muted-foreground">Remaining slots</p><p className="mt-1 text-xl font-semibold">{capacity.capacity - capacity.approved}</p></div><div className="rounded-xl border border-border p-3"><p className="text-xs text-muted-foreground">Waitlisted</p><p className="mt-1 text-xl font-semibold">{capacity.waitlisted}</p></div></div>
  </CardContent></Card>;
}
