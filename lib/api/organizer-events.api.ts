import { axiosClient } from "@/lib/axios";

export type EventSeason = "Spring" | "Summer" | "Fall";
export type EventStatus = "draft" | "active" | "ongoing" | "closed";
export type SubmissionType = "file" | "github_link";

export interface OrganizerTrackInput {
  id?: number;
  name: string;
  description?: string;
  maxTeams?: number;
  maxMembersPerTeam?: number;
}

export interface OrganizerRoundInput {
  id?: number;
  roundNumber: number;
  name: string;
  submissionType: SubmissionType;
  submissionDeadline?: string;
  maxFileSizeMb?: number;
  isTrackSpecific: boolean;
  trackId?: number | null;
}

export interface OrganizerEventLocation {
  name?: string;
  venueName?: string;
  room?: string;
  address?: string;
  meetingPlatform?: string;
  meetingUrl?: string;
  mapUrl?: string;
  note?: string;
}

export interface OrganizerEventContact {
  label?: string;
  type?: string;
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  detail?: string;
  responseTime?: string;
}

export interface OrganizerEventRuleGroup {
  title?: string;
  name?: string;
  category?: string;
  rules: string[];
}

export interface OrganizerEventFAQItem {
  question?: string;
  q?: string;
  title?: string;
  answer?: string;
  a?: string;
  content?: string;
}

export interface OrganizerEventPayload {
  name: string;
  description?: string;
  imageUrl?: string;
  season: EventSeason;
  year: number;
  status?: EventStatus;
  registrationDeadline?: string;
  startDate?: string;
  endDate?: string;
  githubOrgUrl?: string;
  prize1st?: string;
  prize2nd?: string;
  prize3rd?: string;
  prizeHonorable?: string;
  tracks: OrganizerTrackInput[];
  rounds: OrganizerRoundInput[];
  location?: string;
  contact?: string;
  rules?: string;
  faq?: OrganizerEventFAQItem[];
}

export interface OrganizerTrack extends OrganizerTrackInput {
  id: number;
  _count?: {
    teams?: number;
  };
}

export interface OrganizerRound extends OrganizerRoundInput {
  id: number;
  status?: "not_started" | "open" | "closed" | "results_published" | string;
  startDate?: string;
  track?: OrganizerTrack | null;
  _count?: {
    submissions?: number;
  };
}

export interface OrganizerEvent extends Omit<OrganizerEventPayload, "tracks" | "rounds" | "imageUrl"> {
  id: number;
  imageUrl?: string | null;
  image_url?: string | null;
  endDate?: string | null;
  icons?: Array<{
    id?: number;
    url: string;
  }>;
  tracks?: OrganizerTrack[];
  rounds?: OrganizerRound[];
  _count?: {
    teams?: number;
    submissions?: number;
  };
}

export interface OrganizerRubric {
  id: number;
  name: string;
  description?: string | null;
  maxScore: number;
  weight: number;
  roundId: number;
  trackId?: number | null;
  round?: OrganizerRound;
  track?: OrganizerTrack | null;
}

export interface OrganizerRubricPayload {
  name: string;
  description?: string;
  maxScore: number;
  weight: number;
  roundId: number;
  trackId?: number | null;
}

export interface OrganizerRubricFilters {
  roundId?: string | number;
  trackId?: string | number | null;
}

function unwrapData<T>(response: { data?: { data?: T } }) {
  return response.data?.data as T;
}

export async function getOrganizerEvents() {
  const res = await axiosClient.get("/organizer/events");
  return unwrapData<OrganizerEvent[]>(res);
}

export async function getOrganizerEvent(eventId: string | number) {
  const res = await axiosClient.get(`/public/events/${eventId}`);
  return unwrapData<OrganizerEvent>(res);
}

export async function createOrganizerEvent(payload: OrganizerEventPayload) {
  const res = await axiosClient.post("/organizer/events", payload);
  return unwrapData<OrganizerEvent>(res);
}

export async function updateOrganizerEvent(eventId: string | number, payload: OrganizerEventPayload) {
  const res = await axiosClient.put(`/organizer/events/${eventId}`, payload);
  return unwrapData<OrganizerEvent>(res);
}

export async function updateOrganizerEventStatus(eventId: string | number, status: EventStatus) {
  const res = await axiosClient.patch(`/organizer/events/${eventId}/status`, { status });
  return unwrapData<OrganizerEvent>(res);
}

export async function deleteOrganizerEvent(eventId: string | number) {
  await axiosClient.delete(`/organizer/events/${eventId}`);
}

export async function getOrganizerRubrics(
  eventId: string | number,
  filters: OrganizerRubricFilters = {}
) {
  const params = new URLSearchParams();

  if (filters.roundId) {
    params.set("roundId", String(filters.roundId));
  }

  if (filters.trackId !== undefined && filters.trackId !== null) {
    params.set("trackId", String(filters.trackId));
  }

  const query = params.toString();
  const res = await axiosClient.get(
    `/organizer/events/${eventId}/rubrics${query ? `?${query}` : ""}`
  );
  return unwrapData<OrganizerRubric[]>(res);
}

export async function createOrganizerRubric(
  eventId: string | number,
  payload: OrganizerRubricPayload
) {
  const res = await axiosClient.post(`/organizer/events/${eventId}/rubrics`, payload);
  return unwrapData<OrganizerRubric>(res);
}

export async function bulkCreateOrganizerRubrics(
  eventId: string | number,
  payload: { rubrics: OrganizerRubricPayload[] }
) {
  const res = await axiosClient.post(`/organizer/events/${eventId}/rubrics/bulk`, payload);
  return unwrapData<OrganizerRubric[]>(res);
}

export async function updateOrganizerRubric(
  eventId: string | number,
  rubricId: string | number,
  payload: OrganizerRubricPayload
) {
  const res = await axiosClient.put(
    `/organizer/events/${eventId}/rubrics/${rubricId}`,
    payload
  );
  return unwrapData<OrganizerRubric>(res);
}

export async function deleteOrganizerRubric(
  eventId: string | number,
  rubricId: string | number
) {
  await axiosClient.delete(`/organizer/events/${eventId}/rubrics/${rubricId}`);
}

export async function bulkDeleteOrganizerRubrics(
  eventId: string | number,
  rubricIds: number[]
) {
  await axiosClient.delete(`/organizer/events/${eventId}/rubrics/bulk`, {
    data: { rubricIds },
  });
}

export interface DetailedCriterionAverage {
  criterionId: number;
  name: string;
  maxScore: number;
  weight: number;
  averageScore: number;
}

export interface DetailedJudgeScore {
  judgeId: number;
  judgeName: string;
  totalGivenScore: number;
  deviationFromAverage: number;
  comment?: string;
  criteriaScores: {
    criterionId: number;
    scoreValue: number;
  }[];
}

export interface DetailedRankedTeamEntry {
  rank: number;
  teamId: number;
  teamName: string;
  trackId: number;
  trackName: string;
  submissionId: number | null;
  finalScore: number | null;
  criteriaAverages: DetailedCriterionAverage[];
  judges: DetailedJudgeScore[];
  status: string;
  award?: AwardType | null;
  submittedAt: string;
}

export interface DetailedRankingsResponse {
  round: {
    id: number;
    name: string;
    roundNumber: number;
    status: string;
    isFinalRound: boolean;
  };
  tracks: {
    track: { id: number; name: string };
    entries: DetailedRankedTeamEntry[];
  }[];
}

export async function getDetailedRoundRankings(
  eventId: string | number,
  roundId: string | number,
  trackId?: string | number
) {
  const params = new URLSearchParams();
  if (trackId !== undefined && trackId !== null) {
    params.set("trackId", String(trackId));
  }
  const query = params.toString();
  const res = await axiosClient.get(
    `/organizer/events/${eventId}/rounds/${roundId}/rankings/detailed${query ? `?${query}` : ""}`
  );
  return unwrapData<DetailedRankingsResponse>(res);
}

export async function getRoundRankings(
  eventId: string | number,
  roundId: string | number,
  trackId?: string | number
) {
  const params = new URLSearchParams();
  if (trackId !== undefined && trackId !== null) {
    params.set("trackId", String(trackId));
  }
  const query = params.toString();
  const res = await axiosClient.get(
    `/organizer/events/${eventId}/rounds/${roundId}/rankings${query ? `?${query}` : ""}`
  );
  return unwrapData<unknown>(res);
}

export type AwardType = "first_prize" | "second_prize" | "third_prize" | "honorable_mention";

export interface PublishResultsPayload {
  advancingTeamIds?: number[];
  awards?: { teamId: number; award: AwardType | null }[];
}

export async function publishRoundResults(
  eventId: string | number,
  roundId: string | number,
  payload: PublishResultsPayload
) {
  const res = await axiosClient.post(
    `/organizer/events/${eventId}/rounds/${roundId}/publish-results`,
    payload
  );
  return unwrapData<unknown>(res);
}
