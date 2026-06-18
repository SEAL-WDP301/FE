import { axiosClient } from "@/lib/axios";

export interface MentorTeamMember {
  id?: number;
  role?: string;
  status?: string;
  user?: {
    id?: number;
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
    avatar_url?: string | null;
  };
}

export interface MentorTeam {
  id: number;
  name: string;
  status?: string;
  createdAt?: string;
  event?: { id?: number; name?: string };
  track?: { id?: number; name?: string; maxMembersPerTeam?: number };
  leader?: { id?: number; name?: string | null; email?: string | null };
  members?: MentorTeamMember[];
}

export interface MentorAssignment {
  id?: number;
  teamId: number;
  team?: MentorTeam;
}

export interface MentorProfile {
  id: number;
  name?: string | null;
  email: string;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  role?: string;
  stakeholderProfile?: {
    jobTitle?: string | null;
    organization?: string | null;
    organizationName?: string | null;
    experience?: string | null;
    achievements?: string | null;
    bio?: string | null;
    isPublic?: boolean;
  } | null;
  mentorAssignments?: MentorAssignment[];
}

export interface UserNotification {
  id: number;
  title: string;
  content: string;
  type?: string;
  isRead?: boolean;
  createdAt: string;
}

function unwrapData<T>(response: { data?: { data?: T } }) {
  return response.data?.data as T;
}

export async function getMentorProfile() {
  const response = await axiosClient.get("/users/profile");
  return unwrapData<MentorProfile>(response);
}

export async function getMentorNotifications() {
  const response = await axiosClient.get("/users/notifications");
  return unwrapData<UserNotification[]>(response) || [];
}

export async function updateMentorProfile(
  payload: NonNullable<MentorProfile["stakeholderProfile"]>
) {
  const response = await axiosClient.put("/users/profile/stakeholder", payload);
  return unwrapData<MentorProfile>(response);
}

export function getAssignedMentorTeams(profile?: MentorProfile | null) {
  return (profile?.mentorAssignments || [])
    .map((assignment) => assignment.team)
    .filter((team): team is MentorTeam => Boolean(team));
}
