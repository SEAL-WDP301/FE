import { axiosClient } from "@/lib/axios";
import { getMentorTeams } from "@/lib/api/mentor.api";

export type StakeholderPortal = "judge" | "mentor" | "none";

export async function resolveStakeholderPortal(): Promise<StakeholderPortal> {
  const [judgeRes, mentorTeams] = await Promise.all([
    axiosClient
      .get("/judge/events")
      .then((res) => res.data?.data ?? [])
      .catch(() => []),
    getMentorTeams().catch(() => []),
  ]);

  const hasJudge = Array.isArray(judgeRes) && judgeRes.length > 0;
  const hasMentor = Array.isArray(mentorTeams) && mentorTeams.length > 0;

  if (hasJudge && !hasMentor) return "judge";
  if (hasMentor && !hasJudge) return "mentor";
  if (hasJudge) return "judge";
  if (hasMentor) return "mentor";
  return "none";
}

export function getStakeholderPortalPath(portal: StakeholderPortal): string {
  if (portal === "judge") return "/judge/dashboard";
  if (portal === "mentor") return "/mentor";
  return "/home";
}

export async function resolveRoleHomePath(role?: string): Promise<string> {
  if (role === "stakeholder") {
    const portal = await resolveStakeholderPortal();
    return getStakeholderPortalPath(portal);
  }

  const roleHomePath: Record<string, string> = {
    admin: "/organizer/events",
    organizer: "/organizer/events",
    student: "/student/events",
    judge: "/judge/dashboard",
  };

  return role && role in roleHomePath ? roleHomePath[role] : "/home";
}
