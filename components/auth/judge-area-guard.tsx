"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { judgeApi } from "@/lib/api/judge.api";

interface JudgeAreaGuardProps {
  role?: string;
  children: ReactNode;
}

export function JudgeAreaGuard({ role, children }: JudgeAreaGuardProps) {
  const router = useRouter();

  const { data: assignedEvents, isLoading, isFetching } = useQuery({
    queryKey: ["judge", "events"],
    queryFn: judgeApi.getAssignedEvents,
    enabled: role === "stakeholder",
    retry: false,
  });

  useEffect(() => {
    if (role !== "stakeholder" || isLoading || isFetching) return;
    if (!assignedEvents?.length) {
      router.replace("/mentor");
    }
  }, [assignedEvents, isFetching, isLoading, role, router]);

  if (role === "stakeholder" && (isLoading || isFetching)) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading judge workspace...
        </div>
      </div>
    );
  }

  if (role === "stakeholder" && !assignedEvents?.length) {
    return null;
  }

  return <>{children}</>;
}
