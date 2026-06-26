import type { AppRole } from "@/components/auth/role-guard";

export interface RoleAccountLinks {
  home: string;
  profile: string | null;
  settings: string | null;
}

const syncHomePaths: Record<AppRole, string> = {
  admin: "/organizer/events",
  organizer: "/organizer/events",
  student: "/student/events",
  stakeholder: "/mentor",
  judge: "/judge/dashboard",
};

export function getSyncRoleHomePath(role?: string): string {
  return role && role in syncHomePaths
    ? syncHomePaths[role as AppRole]
    : "/home";
}

/** Account menu + logo targets based on role and current portal section. */
export function getRoleAccountLinks(
  role?: string,
  pathname?: string | null,
): RoleAccountLinks {
  const home = getSyncRoleHomePath(role);

  switch (role) {
    case "student":
      return {
        home: "/student/events",
        profile: "/student/profile",
        settings: "/student/settings",
      };
    case "judge":
      return {
        home: "/judge/dashboard",
        profile: "/judge/profile",
        settings: null,
      };
    case "stakeholder":
      if (pathname?.startsWith("/judge")) {
        return {
          home: "/judge/dashboard",
          profile: "/judge/profile",
          settings: null,
        };
      }
      return {
        home: "/mentor",
        profile: "/mentor/settings",
        settings: "/mentor/settings",
      };
    case "organizer":
    case "admin":
      return {
        home: "/organizer/events",
        profile: null,
        settings: null,
      };
    default:
      return { home, profile: null, settings: null };
  }
}

export function isNavPathActive(
  pathname: string | null,
  href: string,
  options?: { exact?: boolean },
): boolean {
  if (!pathname) return false;
  if (pathname === href) return true;
  if (options?.exact) return false;
  return pathname.startsWith(`${href}/`) || pathname.startsWith(`${href}?`);
}
