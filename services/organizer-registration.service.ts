import { axiosClient } from "@/lib/axios";
import type {
  ApproveRegistrationInput, EventCapacityOverview, PaginatedRegistrationResponse,
  RegistrationDetails, RegistrationFilters, RegistrationOverview,
  RegistrationStatus, RegistrationTrendPoint, RejectRegistrationInput, WaitlistRegistrationInput,
} from "@/lib/organizer/registrations/registration-types";

type Row = Record<string, unknown>;
const record = (value: unknown): Row => value && typeof value === "object" && !Array.isArray(value) ? value as Row : {};
const unwrap = (value: unknown): unknown => { const row = record(value); return row.data === undefined ? value : record(row.data).data ?? row.data; };
const array = (value: unknown, ...keys: string[]) => {
  const data = unwrap(value); if (Array.isArray(data)) return data;
  const row = record(data); for (const key of keys) if (Array.isArray(row[key])) return row[key] as unknown[];
  return [];
};
const pick = (row: Row, ...keys: string[]) => keys.map((key) => row[key]).find((value) => value !== undefined && value !== null);
const string = (value: unknown, fallback = "") => typeof value === "string" ? value : fallback;
const numeric = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;
const title = (value: unknown) => string(value).replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function status(value: unknown): RegistrationStatus {
  const normalized = string(value).toLowerCase();
  if (normalized === "approved") return "Approved";
  if (normalized === "rejected") return "Rejected";
  if (normalized === "waitlisted" || normalized === "waitlist") return "Waitlisted";
  if (normalized === "cancelled" || normalized === "canceled") return "Cancelled";
  return "Pending";
}

function relative(value: unknown) {
  const date = new Date(string(value));
  if (Number.isNaN(date.getTime())) return string(value);
  const hours = Math.max(0, Math.round((Date.now() - date.getTime()) / 3_600_000));
  return hours < 24 ? `${hours} hour${hours === 1 ? "" : "s"} ago` : `${Math.round(hours / 24)} days ago`;
}

function mapRegistration(value: unknown, index: number): RegistrationDetails {
  const row = record(value); const user = record(pick(row, "student", "user")); const event = record(row.event); const team = record(row.team);
  const members = array(team.members, "members").map((member) => string(pick(record(member), "name", "fullName", "email"))).filter(Boolean);
  const registeredAt = string(pick(row, "registeredAt", "createdAt", "date"));
  const teamName = string(pick(team, "name", "teamName"));
  const teamStatus = teamName ? (members.length >= numeric(pick(team, "maxMembers", "maxSize")) && numeric(pick(team, "maxMembers", "maxSize")) > 0 ? "Team Full" : "Has Team") : "No Team";
  const registrationStatus = status(row.status);
  return {
    id: String(pick(row, "id", "registrationId") ?? index),
    student: {
      id: String(pick(user, "id", "userId") ?? pick(row, "studentId") ?? index),
      fullName: string(pick(user, "name", "fullName"), string(pick(row, "studentName", "name"), "Unknown student")),
      email: string(pick(user, "email"), string(row.email)),
      studentId: string(pick(user, "studentId", "code"), string(pick(row, "studentCode"))),
      department: string(pick(user, "department", "major")),
      school: string(pick(user, "school", "university")),
      phone: string(user.phone) || undefined,
      profileCompletion: numeric(pick(user, "profileCompletion", "completion")),
    },
    event: {
      id: String(pick(event, "id", "eventId") ?? pick(row, "eventId") ?? ""),
      name: string(pick(event, "name", "title"), string(row.eventName, "—")),
      track: string(pick(record(row.track), "name"), string(pick(row, "trackName"))),
      season: title(pick(event, "season") ?? row.season),
      year: numeric(pick(event, "year") ?? row.year),
    },
    registeredAt,
    registeredRelative: string(pick(row, "registeredRelative", "relativeTime"), relative(registeredAt)),
    eligibility: registrationStatus === "Rejected" ? "Not Eligible" : "Eligible",
    eligibilityReason: string(pick(row, "eligibilityReason", "rejectionReason")) || undefined,
    teamStatus,
    team: teamName ? {
      id: String(pick(team, "id", "teamId") ?? ""), name: teamName, status: teamStatus,
      role: String(pick(team, "leaderId") ?? "") === String(user.id ?? "") ? "Leader" : "Member",
      leader: string(pick(record(team.leader), "name", "fullName", "email")), members,
    } : undefined,
    status: registrationStatus,
    reviewedBy: string(pick(record(row.reviewedBy), "name", "email"), string(row.reviewedBy)) || undefined,
    reviewedAt: string(row.reviewedAt) || undefined,
    rejectionReason: string(row.rejectionReason) || undefined,
    agreedToTerms: Boolean(pick(row, "agreedToTerms", "acceptedTerms")),
    source: string(row.source),
    answers: array(row.answers, "answers").map((answer) => { const item = record(answer); return { label: string(pick(item, "label", "question")), value: string(pick(item, "value", "answer")) }; }),
    history: array(row.history, "history").map((history, historyIndex) => { const item = record(history); return { id: String(item.id ?? historyIndex), action: string(pick(item, "action", "status")), actor: string(pick(record(item.actor), "name", "email"), string(item.actor)), time: string(pick(item, "time", "createdAt")), note: string(item.note) || undefined }; }),
  };
}

async function fetchRegistrations(limit = 100) {
  const response = await axiosClient.get(`/organizer/dashboard/recent-registrations?limit=${limit}`);
  return array(response.data, "registrations", "items", "recentRegistrations").map(mapRegistration);
}

export const organizerRegistrationService = {
  async getOverview(): Promise<RegistrationOverview> {
    const rows = await fetchRegistrations();
    const count = (target: RegistrationStatus) => rows.filter((row) => row.status === target).length;
    const reviewed = rows.filter((row) => row.status !== "Pending").length;
    const approved = count("Approved");
    return { metrics: [
      { id: "total", label: "Total Registrations", value: rows.length, delta: 0, detail: "From dashboard registrations API", icon: "total" },
      { id: "pending", label: "Pending", value: count("Pending"), delta: 0, detail: "Registrations requiring review", icon: "pending" },
      { id: "approved", label: "Approved", value: approved, delta: 0, detail: "Approved registrations", icon: "approved" },
      { id: "rejected", label: "Rejected", value: count("Rejected"), delta: 0, detail: "Rejected registrations", icon: "rejected" },
      { id: "waitlisted", label: "Waitlisted", value: count("Waitlisted"), delta: 0, detail: "Waitlisted registrations", icon: "waitlisted" },
      { id: "rate", label: "Approval Rate", value: reviewed ? Math.round(approved / reviewed * 100) : 0, suffix: "%", delta: 0, detail: "Of reviewed registrations", icon: "rate" },
    ] };
  },
  async getTrend(): Promise<RegistrationTrendPoint[]> {
    const response = await axiosClient.get("/organizer/dashboard/registration-trend?groupBy=day");
    return array(response.data, "trend", "registrationTrend", "items").map((value) => { const row = record(value); return { date: string(pick(row, "date", "day", "label")), Total: numeric(pick(row, "Total", "total", "registrations")), Approved: numeric(pick(row, "Approved", "approved", "participants")) }; });
  },
  async getCapacity(eventId?: string): Promise<EventCapacityOverview> {
    const response = await axiosClient.get("/organizer/dashboard/filter-options");
    const events = array(response.data, "events", "items").map(record);
    const event = events.find((item) => String(pick(item, "id", "eventId", "value")) === eventId) ?? events[0] ?? {};
    return { eventId: String(pick(event, "id", "eventId", "value") ?? ""), eventName: string(pick(event, "name", "title", "label"), "No event"), capacity: numeric(pick(event, "capacity", "maxParticipants")), approved: numeric(pick(event, "approved", "participants")), waitlisted: numeric(event.waitlisted) };
  },
  async getRegistrations(filters: RegistrationFilters): Promise<PaginatedRegistrationResponse> {
    const rows = await fetchRegistrations(Math.max(100, filters.limit)); const query = filters.search.trim().toLowerCase();
    const filtered = rows.filter((row) => (!query || [row.student.fullName, row.student.email, row.student.studentId, row.team?.name ?? ""].some((value) => value.toLowerCase().includes(query)))
      && (filters.eventId === "all" || row.event.id === filters.eventId)
      && (filters.status === "All" || row.status === filters.status)
      && (filters.eligibility === "All" || row.eligibility === filters.eligibility)
      && (filters.teamStatus === "All" || row.teamStatus === filters.teamStatus)
      && (filters.season === "All Seasons" || row.event.season === filters.season)
      && (filters.year === "All Years" || String(row.event.year) === filters.year));
    const sorted = [...filtered].sort((a, b) => filters.sortOrder === "asc" ? a.registeredAt.localeCompare(b.registeredAt) : b.registeredAt.localeCompare(a.registeredAt));
    const start = (filters.page - 1) * filters.limit;
    return { data: sorted.slice(start, start + filters.limit), pagination: { page: filters.page, limit: filters.limit, total: sorted.length, totalPages: Math.max(1, Math.ceil(sorted.length / filters.limit)) } };
  },
  async getRegistration(id: string): Promise<RegistrationDetails | null> { return (await fetchRegistrations()).find((row) => row.id === id) ?? null; },
  async approve(id: string, input: ApproveRegistrationInput) { const response = await axiosClient.post(`/organizer/registrations/${id}/approve`, input); return unwrap(response.data); },
  async reject(id: string, input: RejectRegistrationInput) { const response = await axiosClient.post(`/organizer/registrations/${id}/reject`, input); return unwrap(response.data); },
  async waitlist(id: string, input: WaitlistRegistrationInput) { const response = await axiosClient.post(`/organizer/registrations/${id}/waitlist`, input); return unwrap(response.data); },
};
