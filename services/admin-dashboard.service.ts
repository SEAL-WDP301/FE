import { axiosClient } from "@/lib/axios";
import { getOrganizerEvents } from "@/lib/api/organizer-events.api";
import { QUICK_ACTIONS } from "@/lib/admin-dashboard/dashboard-constants";
import type {
  AdminDashboardData,
  DashboardFilters,
  EventMonthlyMetric,
  EventStatusMetric,
  RecentRegistrationItem,
  RegistrationStatus,
  SubmissionStatusMetric,
  UpcomingDeadlineItem,
} from "@/lib/admin-dashboard/dashboard-types";

type JsonRecord = Record<string, unknown>;

const asRecord = (value: unknown): JsonRecord =>
  value && typeof value === "object" && !Array.isArray(value) ? value as JsonRecord : {};
const number = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;
const text = (value: unknown, fallback = "") => typeof value === "string" ? value : fallback;
const unwrap = (value: unknown): unknown => {
  const root = asRecord(value);
  return root.data === undefined ? value : asRecord(root.data).data ?? root.data;
};
const listFrom = (value: unknown, ...keys: string[]) => {
  const unwrapped = unwrap(value);
  if (Array.isArray(unwrapped)) return unwrapped;
  const record = asRecord(unwrapped);
  for (const key of keys) if (Array.isArray(record[key])) return record[key] as unknown[];
  return [];
};
const get = (record: JsonRecord, ...keys: string[]) => {
  for (const key of keys) if (record[key] !== undefined && record[key] !== null) return record[key];
  return undefined;
};

function formatRelative(value: unknown) {
  if (typeof value !== "string" || !value) return "";
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return value;
  const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60_000));
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function normalizeStatus(value: unknown): RegistrationStatus {
  const status = text(value).toLowerCase();
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  if (status === "waitlisted" || status === "waitlist") return "Waitlisted";
  return "Pending";
}

function normalizeRecent(payload: unknown): RecentRegistrationItem[] {
  return listFrom(payload, "registrations", "items", "recentRegistrations").map((item, index) => {
    const row = asRecord(item);
    const student = asRecord(get(row, "student", "user"));
    const event = asRecord(row.event);
    const team = asRecord(row.team);
    const name = text(get(student, "name", "fullName"), text(get(row, "studentName", "name"), "Unknown student"));
    return {
      id: String(get(row, "id", "registrationId") ?? index),
      student: name,
      initials: name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      event: text(get(event, "name", "title"), text(get(row, "eventName"), "—")),
      time: text(get(row, "registeredRelative", "relativeTime"), formatRelative(get(row, "registeredAt", "createdAt"))),
      status: normalizeStatus(row.status),
      teamStatus: text(get(row, "teamStatus"), text(team.name, "No team")),
    };
  });
}

function normalizeMonthly(payload: unknown): EventMonthlyMetric[] {
  return listFrom(payload, "eventsByMonth", "months", "items").map((item) => {
    const row = asRecord(item);
    return {
      month: text(get(row, "month", "label", "date")),
      Created: number(get(row, "Created", "created", "total")),
      Starting: number(get(row, "Starting", "starting", "started")),
      Completed: number(get(row, "Completed", "completed", "closed")),
    };
  });
}

const STATUS_COLORS: Record<string, string> = {
  draft: "slate", active: "orange", ongoing: "orange", completed: "emerald",
  closed: "emerald", cancelled: "red", upcoming: "blue", "registration open": "amber",
};
function normalizeEventStatus(payload: unknown): EventStatusMetric[] {
  return listFrom(payload, "eventStatus", "statuses", "items").map((item) => {
    const row = asRecord(item);
    const status = text(get(row, "status", "name", "label"), "Unknown");
    return { status, value: number(get(row, "value", "count", "total")), color: text(row.color, STATUS_COLORS[status.toLowerCase()] ?? "slate") };
  });
}

function normalizeSubmissionStatus(payload: unknown): SubmissionStatusMetric[] {
  const source = unwrap(payload);
  const rows = listFrom(source, "statuses", "submissionStatus", "statusBreakdown");
  if (rows.length) return rows.map((item) => {
    const row = asRecord(item); const status = text(get(row, "status", "label", "name"), "Unknown");
    return { status, value: number(get(row, "value", "count", "total")), color: text(row.color, status.toLowerCase().includes("late") ? "amber" : "emerald") };
  });
  const summary = asRecord(source);
  return [
    { status: "On time", value: number(get(summary, "onTime", "onTimeSubmissions", "submittedOnTime")), color: "emerald" },
    { status: "Late", value: number(get(summary, "late", "lateSubmissions")), color: "amber" },
    { status: "Pending evaluation", value: number(get(summary, "pendingEvaluation", "pending")), color: "blue" },
    { status: "Evaluated", value: number(get(summary, "evaluated", "evaluatedSubmissions")), color: "orange" },
  ].filter((item) => item.value > 0);
}

function normalizeDeadlines(payload: unknown): UpcomingDeadlineItem[] {
  return listFrom(payload, "deadlines", "items", "upcomingDeadlines").map((item, index) => {
    const row = asRecord(item); const event = asRecord(row.event);
    const status = text(row.status, "Upcoming");
    return {
      id: String(get(row, "id", "deadlineId") ?? index),
      eventId: String(get(row, "eventId") ?? event.id ?? ""),
      event: text(get(event, "name", "title"), text(row.eventName, "—")),
      type: text(get(row, "type", "deadlineType", "title"), "Deadline"),
      date: text(get(row, "date", "deadline", "dueAt")),
      remaining: text(get(row, "remaining", "timeRemaining")),
      status: status === "Urgent" || status === "Overdue" || status === "Completed" ? status : "Upcoming",
      submissionRate: row.submissionRate === undefined ? undefined : number(row.submissionRate),
    };
  });
}

export interface DashboardFilterOptions {
  events: { value: string; label: string; participants?: number; registrations?: number; teams?: number; submissions?: number; capacity?: number }[];
  seasons: string[];
  years: number[];
}

export async function getDashboardFilterOptions(): Promise<DashboardFilterOptions> {
  const organizerEvents = await getOrganizerEvents();
  const events = organizerEvents.map((item) => {
    const event = asRecord(item);
    const counts = asRecord(event._count);
    return { value: String(event.id ?? ""), label: text(get(event, "name", "title")), participants: number(get(event, "participants", "approved")), registrations: number(get(event, "registrations", "registrationCount")), teams: number(get(counts, "teams") ?? get(event, "teams", "teamCount")), submissions: number(get(counts, "submissions") ?? get(event, "submissions", "submissionCount")), capacity: number(get(event, "capacity", "maxParticipants")) };
  }).filter((event) => event.value && event.label);
  const seasons = [...new Set(organizerEvents.map((event) => event.season).filter((season): season is NonNullable<typeof season> => Boolean(season)))];
  const years = [...new Set(organizerEvents.map((event) => Number(event.year)).filter(Number.isFinite))].sort((a, b) => b - a);
  return {
    events,
    seasons,
    years,
  };
}

export const adminDashboardService = {
  getFilterOptions: getDashboardFilterOptions,
  async getDashboard(filters: DashboardFilters, cachedFilterOptions?: DashboardFilterOptions): Promise<AdminDashboardData> {
    const eventQuery = filters.eventId !== "all" ? `&eventId=${encodeURIComponent(filters.eventId)}` : "";
    const filterOptions = cachedFilterOptions ?? await getDashboardFilterOptions();
    const [monthResponse, statusResponse, registrationsResponse, trendResponse, submissionResponses, deadlinesResponse] = await Promise.all([
      axiosClient.get(`/organizer/dashboard/events-by-month?year=${filters.year}`),
      axiosClient.get(`/organizer/dashboard/event-status?year=${filters.year}${eventQuery}`),
      axiosClient.get(`/organizer/dashboard/recent-registrations?limit=10${eventQuery}`),
      axiosClient.get(`/organizer/dashboard/registration-trend?groupBy=day${eventQuery}`),
      Promise.all([axiosClient.get(`/organizer/dashboard/submissions?groupBy=day${eventQuery}`)]),
      axiosClient.get(`/organizer/dashboard/upcoming-deadlines?withinDays=30${eventQuery}`),
    ]);

    const recentRegistrations = normalizeRecent(registrationsResponse.data);
    const eventStatus = normalizeEventStatus(statusResponse.data);
    const submissionStatusMap = new Map<string, SubmissionStatusMetric>();
    submissionResponses.flatMap((response) => normalizeSubmissionStatus(response.data)).forEach((item) => submissionStatusMap.set(item.status, { ...item, value: (submissionStatusMap.get(item.status)?.value ?? 0) + item.value }));
    const submissionStatus = [...submissionStatusMap.values()];
    const trend = listFrom(trendResponse.data, "trend", "registrationTrend", "items").map((item) => {
      const row = asRecord(item);
      return { date: text(get(row, "date", "day", "label")), Registrations: number(get(row, "Registrations", "registrations", "total")), Participants: number(get(row, "Participants", "participants", "approved")) };
    });
    const submissionActivityMap = new Map<string, number>();
    submissionResponses.forEach((response) => { const payload = asRecord(unwrap(response.data)); listFrom(payload, "activity", "trend", "submissionActivity").forEach((item) => { const row = asRecord(item); const date = text(get(row, "date", "day", "label")); submissionActivityMap.set(date, (submissionActivityMap.get(date) ?? 0) + number(get(row, "Submissions", "submissions", "count"))); }); });
    const submissionActivity = [...submissionActivityMap].map(([date, Submissions]) => ({ date, Submissions }));
    const totalRegistrations = trend.reduce((sum, item) => sum + item.Registrations, 0) || recentRegistrations.length;
    const participants = trend.reduce((sum, item) => sum + item.Participants, 0) || recentRegistrations.filter((item) => item.status === "Approved").length;
    const totalSubmissions = submissionStatus.reduce((sum, item) => sum + (item.status.toLowerCase().includes("evaluat") ? 0 : item.value), 0);
    const activeEvents = eventStatus.filter((item) => ["active", "ongoing", "registration open"].includes(item.status.toLowerCase())).reduce((sum, item) => sum + item.value, 0);
    const totalEvents = eventStatus.reduce((sum, item) => sum + item.value, 0) || filterOptions.events.length;
    const metric = (id: string, label: string, value: number, icon: "events" | "active" | "registrations" | "participants" | "submissions" | "users", href: string, detail: string) => ({ id, label, value, delta: 0, detail, comparison: "Live API data", href, sparkline: [], icon });

    return {
      overview: { metrics: [
        metric("events", "Total Events", totalEvents, "events", "/organizer/events", `${filterOptions.events.length} available in filters`),
        metric("active", "Active Events", activeEvents, "active", "/organizer/events", "Currently active or ongoing"),
        metric("registrations", "Total Registrations", totalRegistrations, "registrations", "/organizer/registrations", `${recentRegistrations.length} recent registrations loaded`),
        metric("participants", "Total Participants", participants, "participants", "/organizer/registrations?status=approved", "Approved participants"),
        metric("submissions", "Total Submissions", totalSubmissions, "submissions", "/organizer/submissions", "Across selected events"),
      ] },
      eventsByMonth: normalizeMonthly(monthResponse.data),
      eventStatus,
      registrationTrend: trend,
      conversion: [
        { stage: "Registrations", value: totalRegistrations, rate: 100, previousRate: 100 },
        { stage: "Approved", value: participants, rate: totalRegistrations ? participants / totalRegistrations * 100 : 0, previousRate: 0 },
        { stage: "Submitted", value: totalSubmissions, rate: totalRegistrations ? totalSubmissions / totalRegistrations * 100 : 0, previousRate: 0 },
      ],
      participantsByEvent: filterOptions.events.map((event) => ({ id: event.value, event: event.label, Participants: event.participants ?? 0, registrations: event.registrations ?? 0, teams: event.teams ?? 0, submissions: event.submissions ?? 0, capacity: event.capacity ?? 0 })),
      submissionStatus,
      submissionActivity,
      deadlines: normalizeDeadlines(deadlinesResponse.data),
      recentRegistrations,
      quickActions: QUICK_ACTIONS,
    };
  },
};
