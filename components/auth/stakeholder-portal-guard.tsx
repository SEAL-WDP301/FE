"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { axiosClient } from "@/lib/axios";
import {
  getStakeholderPortalPath,
  resolveStakeholderPortal,
  type StakeholderPortal,
} from "@/lib/stakeholder-portal";

interface StakeholderPortalGuardProps {
  required: Extract<StakeholderPortal, "judge" | "mentor">;
  children: ReactNode;
}

export function StakeholderPortalGuard({
  required,
  children,
}: StakeholderPortalGuardProps) {
  const router = useRouter();

  const {
    data: user,
    isLoading: profileLoading,
    isFetching: profileFetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await axiosClient.get("/users/profile");
      return res.data?.data ?? null;
    },
  });

  const role = user?.role;
  const isStakeholder = role === "stakeholder";

  const {
    data: portal,
    isLoading: portalLoading,
    isFetching: portalFetching,
  } = useQuery({
    queryKey: ["stakeholder-portal"],
    queryFn: resolveStakeholderPortal,
    enabled: isStakeholder,
    retry: false,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!isStakeholder || portalLoading || portalFetching || !portal) return;
    if (portal !== required) {
      router.replace(getStakeholderPortalPath(portal));
    }
  }, [
    isStakeholder,
    portal,
    portalFetching,
    portalLoading,
    required,
    router,
  ]);

  if (!isStakeholder) {
    return <>{children}</>;
  }

  if (
    profileLoading ||
    profileFetching ||
    portalLoading ||
    portalFetching ||
    !portal
  ) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-primary" />
          Checking your role...
        </div>
      </div>
    );
  }

  if (portal === "none") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-6 text-foreground">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold">Chưa được phân công</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tài khoản stakeholder của bạn chưa được assign làm giám khảo hoặc mentor
            cho event nào. Liên hệ organizer để được phân công.
          </p>
        </div>
      </div>
    );
  }

  if (portal !== required) {
    return null;
  }

  return <>{children}</>;
}
