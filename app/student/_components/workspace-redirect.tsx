"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { axiosClient } from "@/lib/axios";
import { getStudentLastEventId, setStudentLastEventId } from "@/lib/student-workspace";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export type StudentWorkspaceSection =
  | ""
  | "my-team"
  | "mentor"
  | "submissions"
  | "schedule";

interface StudentEventEntry {
  teamId: number;
  teamName: string;
  event: { id: number; name: string };
}

async function resolveEventId(): Promise<number | null> {
  const cached = getStudentLastEventId();
  if (cached) return cached;

  const res = await axiosClient.get("/student/teams/my-events");
  const events = (res.data?.data ?? []) as StudentEventEntry[];
  if (!events.length) return null;

  const eventId = events[0].event.id;
  setStudentLastEventId(eventId);
  return eventId;
}

export function StudentWorkspaceRedirect({
  section,
}: {
  section: StudentWorkspaceSection;
}) {
  const router = useRouter();

  const { data: eventId, isLoading, isError } = useQuery({
    queryKey: ["student", "resolve-event", section],
    queryFn: resolveEventId,
    retry: false,
  });

  useEffect(() => {
    if (isLoading || isError || !eventId) return;
    const suffix = section ? `/${section}` : "";
    router.replace(`/student/events/${eventId}/workspace${suffix}`);
  }, [eventId, isError, isLoading, router, section]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!eventId || isError) {
    return (
      <GlassCard className="mx-auto max-w-lg p-8 text-center">
        <h2 className="text-xl font-semibold">Chưa có event nào</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Bạn cần tham gia một team trước khi mở workspace. Vào Events để đăng ký hoặc chấp nhận lời mời.
        </p>
        <Button asChild className="mt-6">
          <Link href="/student/events">Xem Events</Link>
        </Button>
      </GlassCard>
    );
  }

  return null;
}
