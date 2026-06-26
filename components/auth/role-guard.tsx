"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { axiosClient } from "@/lib/axios";
import { getSyncRoleHomePath } from "@/lib/role-navigation";
import { resolveRoleHomePath } from "@/lib/stakeholder-portal";

export type AppRole = "admin" | "organizer" | "student" | "stakeholder" | "judge";

interface RoleGuardProps {
  allowedRoles: AppRole[];
  children: ReactNode;
}

interface UserProfile {
  role?: string;
  [key: string]: unknown;
}

export function getRoleHomePath(role?: string) {
  return getSyncRoleHomePath(role);
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const hasToken = useSyncExternalStore(
    subscribeToAuthChanges,
    getTokenSnapshot,
    getServerTokenSnapshot
  );

  const {
    data: user,
    isLoading,
    isFetching,
    isError,
  } = useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return null;

      const res = await axiosClient.get("/users/profile");
      return res.data?.data ?? null;
    },
    enabled: hasToken === true,
    retry: false,
  });

  useEffect(() => {
    if (hasToken === null) return;

    if (!hasToken) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isError) {
      router.replace("/login");
      return;
    }

    if (!isLoading && !isFetching && user) {
      const role = user.role;
      if (!role || !allowedRoles.includes(role as AppRole)) {
        void resolveRoleHomePath(role).then((path) => router.replace(path));
      }
    }
  }, [allowedRoles, hasToken, isError, isFetching, isLoading, pathname, router, user]);

  if (hasToken === null || !hasToken || isLoading || isFetching || isError) {
    return <RoleGuardFallback />;
  }

  if (!user?.role || !allowedRoles.includes(user.role as AppRole)) {
    return <RoleGuardFallback />;
  }

  return <>{children}</>;
}

function subscribeToAuthChanges(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("token-refreshed", callback);
  window.addEventListener("auth-unauthorized", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("token-refreshed", callback);
    window.removeEventListener("auth-unauthorized", callback);
  };
}

function getTokenSnapshot(): boolean | null {
  return !!localStorage.getItem("access_token");
}

function getServerTokenSnapshot(): boolean | null {
  return null;
}

function RoleGuardFallback() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background text-foreground">
      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
        <Loader2 className="size-5 animate-spin text-primary" />
        Checking permissions...
      </div>
    </div>
  );
}
