"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import {
  getStakeholderPortalPath,
  resolveStakeholderPortal,
  type StakeholderPortal,
} from "@/lib/stakeholder-portal";

interface StakeholderPortalGuardProps {
  role?: string;
  required: Extract<StakeholderPortal, "judge" | "mentor">;
  children: ReactNode;
}

export function StakeholderPortalGuard({
  role,
  required,
  children,
}: StakeholderPortalGuardProps) {
  const router = useRouter();

  const { data: portal, isLoading, isFetching } = useQuery({
    queryKey: ["stakeholder-portal"],
    queryFn: resolveStakeholderPortal,
    enabled: role === "stakeholder",
    retry: false,
  });

  useEffect(() => {
    if (role !== "stakeholder" || isLoading || isFetching || !portal) return;
    if (portal !== required) {
      router.replace(getStakeholderPortalPath(portal));
    }
  }, [isFetching, isLoading, portal, required, role, router]);

  if (role === "stakeholder" && (isLoading || isFetching)) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-primary" />
          Checking your role...
        </div>
      </div>
    );
  }

  if (role === "stakeholder" && portal && portal !== required) {
    return null;
  }

  return <>{children}</>;
}
