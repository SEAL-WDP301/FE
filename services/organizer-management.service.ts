import { axiosClient } from "@/lib/axios";
import type { NotificationTemplate, OrganizerNotification, OrganizerPerson, OrganizerSettings, OrganizerSubmission, Paginated, PeopleFilters, SubmissionFilters } from "@/lib/organizer/management-types";
import { getDashboardFilterOptions } from "@/services/admin-dashboard.service";

type Row = Record<string, unknown>;
const record = (value: unknown): Row => value && typeof value === "object" && !Array.isArray(value) ? value as Row : {};
const unwrap = (value: unknown): unknown => { const row = record(value); return row.data === undefined ? value : record(row.data).data ?? row.data; };
const list = (value: unknown, ...keys: string[]) => { const data = unwrap(value); if (Array.isArray(data)) return data; const row = record(data); for (const key of keys) if (Array.isArray(row[key])) return row[key] as unknown[]; return []; };
const pick = (row: Row, ...keys: string[]) => keys.map((key) => row[key]).find((value) => value !== undefined && value !== null);
const text = (value: unknown, fallback = "") => typeof value === "string" ? value : fallback;
const numeric = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;
const paginate = <T,>(data: T[], page: number, limit: number): Paginated<T> => { const start = (page - 1) * limit; return { data: data.slice(start, start + limit), pagination: { page, limit, total: data.length, totalPages: Math.max(1, Math.ceil(data.length / limit)) } }; };
const formattedDate = (value: unknown) => { const raw = text(value); if (!raw) return "—"; const date = new Date(raw); return Number.isNaN(date.getTime()) ? raw : new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date); };

async function getEvents() { return (await getDashboardFilterOptions()).events; }

async function fetchPeople(): Promise<OrganizerPerson[]> {
  const events = await getEvents();
  const [registrationsResponse, profileResponse, assignmentResponses] = await Promise.all([
    axiosClient.get("/organizer/dashboard/recent-registrations?limit=100"),
    axiosClient.get("/users/profile"),
    Promise.all(events.map(async (event) => ({ event, response: await axiosClient.get(`/organizer/assignments/events/${event.value}`) }))),
  ]);
  const students = list(registrationsResponse.data, "registrations", "items", "recentRegistrations").map((value, index): OrganizerPerson => {
    const row = record(value); const user = record(pick(row, "student", "user")); const event = record(row.event); const team = record(row.team);
    return {
      id: String(pick(user, "id", "userId") ?? pick(row, "studentId", "id") ?? `student-${index}`),
      name: text(pick(user, "name", "fullName"), text(pick(row, "studentName", "name"), "Unknown student")),
      email: text(pick(user, "email"), text(row.email)), code: text(pick(user, "studentId", "code")), role: "Student",
      event: text(pick(event, "name", "title"), text(row.eventName, "—")), assignment: text(pick(team, "name", "teamName"), "No team"),
      participationStatus: text(row.status).toLowerCase() === "rejected" ? "Inactive" : "Active", lastActive: formattedDate(pick(row, "updatedAt", "registeredAt", "createdAt")),
      department: text(pick(user, "department", "major")), skills: list(user.skills, "skills").map(String), bio: text(user.bio),
    };
  });
  const stakeholders = assignmentResponses.flatMap(({ event, response }) => list(response.data, "assignments", "stakeholders", "judges", "items").map((value, index): OrganizerPerson => {
    const assignment = record(value); const user = record(pick(assignment, "user", "stakeholder", "judge", "mentor"));
    const roleValue = text(pick(user, "role", "type"), text(pick(assignment, "role", "type"), "Judge")).toLowerCase();
    const role = roleValue.includes("mentor") ? "Mentor" as const : roleValue.includes("organizer") ? "Organizer" as const : "Judge" as const;
    return { id: String(pick(user, "id", "userId") ?? pick(assignment, "id") ?? `${event.value}-${index}`), name: text(pick(user, "name", "fullName"), text(assignment.name, "Unknown stakeholder")), email: text(pick(user, "email"), text(assignment.email)), code: text(pick(user, "code", "stakeholderCode")), role, event: event.label, assignment: text(pick(record(assignment.round), "name"), text(pick(assignment, "roundName", "trackName"), "Event assignment")), participationStatus: text(assignment.status).toLowerCase() === "inactive" ? "Inactive" : "Active", lastActive: formattedDate(pick(user, "lastActive", "updatedAt")), department: text(pick(user, "department", "organization")), skills: list(user.skills, "skills").map(String), bio: text(user.bio) };
  }));
  const profile = record(unwrap(profileResponse.data)); const profileDetails = record(pick(profile, "stakeholderProfile", "profile"));
  const organizer: OrganizerPerson = { id: String(profile.id ?? "current-organizer"), name: text(pick(profile, "name", "fullName"), "Current organizer"), email: text(profile.email), code: text(profile.code), role: "Organizer", event: events.map((event) => event.label).join(", "), assignment: "Current organizer", participationStatus: "Active", lastActive: "Current session", department: text(pick(profileDetails, "organization", "department")), skills: list(profileDetails.skills, "skills").map(String), bio: text(profileDetails.bio) };
  const unique = new Map<string, OrganizerPerson>();
  [...students, ...stakeholders, organizer].forEach((person) => unique.set(`${person.role}:${person.id}`, person));
  return [...unique.values()];
}

function mapSubmission(value: unknown, eventName: string, index: number): OrganizerSubmission {
  const row = record(value); const team = record(row.team); const round = record(row.round); const track = record(pick(row, "track") ?? team.track);
  const submittedAt = pick(row, "submittedAt", "updatedAt", "createdAt"); const deadline = pick(round, "submissionDeadline", "deadline");
  const late = Boolean(deadline && submittedAt && new Date(String(submittedAt)).getTime() > new Date(String(deadline)).getTime());
  const isSubmitted = row.isSubmittedStatus === undefined ? Boolean(row.id) : Boolean(row.isSubmittedStatus);
  const score = pick(row, "finalScore", "score", "averageScore");
  return { id: String(row.id ?? `${eventName}-${index}`), team: text(pick(team, "name", "teamName"), "Unknown team"), project: text(pick(row, "projectName", "title", "name"), text(pick(team, "projectName", "name"), "Submission")), event: eventName, round: text(pick(round, "name", "title")), track: text(pick(track, "name", "title")), submittedAt: formattedDate(submittedAt), status: !isSubmitted ? "Invalid" : late ? "Late" : row.reopenedAt ? "Reopened" : "On Time", evaluationStatus: score !== undefined && score !== null ? "Evaluated" : text(row.evaluationStatus).toLowerCase().includes("progress") ? "In Progress" : row.judgeAssignments ? "Pending" : "Not Assigned", repository: text(pick(row, "githubUrl", "repository", "repositoryUrl")), demo: text(pick(row, "demoUrl", "fileUrl")), description: text(pick(row, "description", "notes")), score: score === undefined || score === null ? undefined : numeric(score) };
}

async function fetchSubmissions() {
  const events = await getEvents();
  const responses = await Promise.all(events.map(async (event) => ({ event, response: await axiosClient.get(`/organizer/events/${event.value}/submissions`) })));
  return responses.flatMap(({ event, response }) => list(response.data, "submissions", "items").map((submission, index) => mapSubmission(submission, event.label, index)));
}

async function fetchSubmissionDashboard() {
  const events = await getEvents();
  return Promise.all(events.map((event) => axiosClient.get(`/organizer/dashboard/submissions?eventId=${encodeURIComponent(event.value)}`)));
}

const emptySettings = (): OrganizerSettings => ({
  profile: { fullName: "", email: "", phone: "", department: "", position: "", bio: "" },
  eventDefaults: { season: "", minTeamSize: 0, maxTeamSize: 0, registrationMode: "", fileLimit: 0, timezone: "", visibility: "", dateFormat: "" },
  preferences: { theme: "", language: "", timezone: "", dateFormat: "", defaultEvent: "", pageSize: 10, reducedMotion: false },
  notifications: {}, sessions: [],
});

export const organizerManagementService = {
  async getPeople(filters: PeopleFilters): Promise<Paginated<OrganizerPerson>> { const people = await fetchPeople(); const query = filters.search.toLowerCase(); return paginate(people.filter((person) => (!query || `${person.name} ${person.email}`.toLowerCase().includes(query)) && (filters.role === "All" || person.role === filters.role) && (filters.status === "All" || person.participationStatus === filters.status)), filters.page, filters.limit); },
  async getPeopleSummary() { const people = await fetchPeople(); return { total: people.length, students: people.filter((item) => item.role === "Student").length, mentors: people.filter((item) => item.role === "Mentor").length, judges: people.filter((item) => item.role === "Judge").length, organizers: people.filter((item) => item.role === "Organizer").length, active: people.filter((item) => item.participationStatus === "Active").length }; },
  async getPerson(id: string) { return (await fetchPeople()).find((person) => person.id === id) ?? null; },
  async getSubmissions(filters: SubmissionFilters): Promise<Paginated<OrganizerSubmission>> { const submissions = await fetchSubmissions(); const query = filters.search.toLowerCase(); return paginate(submissions.filter((submission) => (!query || `${submission.team} ${submission.project}`.toLowerCase().includes(query)) && (filters.status === "All" || submission.status === filters.status) && (filters.evaluation === "All" || submission.evaluationStatus === filters.evaluation)), filters.page, filters.limit); },
  async getSubmissionSummary() { const [submissions, responses] = await Promise.all([fetchSubmissions(), fetchSubmissionDashboard()]); const summaries = responses.map((response) => record(unwrap(response.data))); const sum = (...keys: string[]) => summaries.reduce((total, summary) => total + numeric(pick(summary, ...keys)), 0); return { total: submissions.length || sum("total", "totalSubmissions"), onTime: submissions.filter((item) => item.status === "On Time").length || sum("onTime", "onTimeSubmissions"), late: submissions.filter((item) => item.status === "Late").length || sum("late", "lateSubmissions"), pending: submissions.filter((item) => item.evaluationStatus !== "Evaluated").length || sum("pending", "pendingEvaluation"), evaluated: submissions.filter((item) => item.evaluationStatus === "Evaluated").length || sum("evaluated"), notSubmitted: sum("notSubmitted", "teamsNotSubmitted") }; },
  async getSubmission(id: string) { return (await fetchSubmissions()).find((submission) => submission.id === id) ?? null; },
  async getSubmissionActivity() { const responses = await fetchSubmissionDashboard(); const totals = new Map<string, number>(); responses.forEach((response) => { const payload = record(unwrap(response.data)); list(payload, "activity", "trend", "submissionActivity").forEach((value) => { const row = record(value); const date = text(pick(row, "date", "day", "label")); totals.set(date, (totals.get(date) ?? 0) + numeric(pick(row, "Submissions", "submissions", "count"))); }); }); return [...totals].map(([date, Submissions]) => ({ date, Submissions })); },
  async getScheduledNotifications(): Promise<OrganizerNotification[]> { return []; },
  async getSentNotifications(): Promise<OrganizerNotification[]> { return []; },
  async getNotificationTemplates(): Promise<NotificationTemplate[]> { return []; },
  async sendReminder(input: { eventId: string; audience: string; subject: string; message: string; scheduledAt?: string; channels?: string[] }) { const response = await axiosClient.post("/organizer/notifications/reminders", input); return unwrap(response.data); },
  async getSettings(): Promise<OrganizerSettings> { const response = await axiosClient.get("/users/profile"); const user = record(unwrap(response.data)); const details = record(pick(user, "stakeholderProfile", "profile")); const settings = emptySettings(); settings.profile = { fullName: text(pick(user, "name", "fullName")), email: text(user.email), phone: text(pick(user, "phone") ?? details.phone), department: text(pick(details, "department", "organization", "organizationName")), position: text(pick(details, "jobTitle", "position")), bio: text(details.bio) }; return settings; },
  async saveSettings(settings: OrganizerSettings) { const response = await axiosClient.put("/users/profile/stakeholder", { jobTitle: settings.profile.position, organization: settings.profile.department, bio: settings.profile.bio, phone: settings.profile.phone }); return unwrap(response.data); },
};
