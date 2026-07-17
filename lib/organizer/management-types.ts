export type PersonRole = "Student" | "Mentor" | "Judge" | "Organizer";
export type ParticipationStatus = "Active" | "Inactive" | "Removed" | "Disqualified";
export interface OrganizerPerson {
  id: string; name: string; email: string; code: string; role: PersonRole; event: string;
  assignment: string; participationStatus: ParticipationStatus; lastActive: string;
  department: string; skills: string[]; bio: string;
}
export interface PeopleFilters { search: string; role: string; status: string; page: number; limit: number; }

export type SubmissionStatus = "On Time" | "Late" | "Invalid" | "Reopened";
export type EvaluationStatus = "Not Assigned" | "Pending" | "In Progress" | "Evaluated";
export interface OrganizerSubmission {
  id: string; team: string; project: string; event: string; round: string; track: string;
  submittedAt: string; status: SubmissionStatus; evaluationStatus: EvaluationStatus;
  repository: string; demo: string; description: string; score?: number;
}
export interface SubmissionFilters { search: string; status: string; evaluation: string; page: number; limit: number; }
export interface SubmissionActivityPoint { date: string; Submissions: number; }

export type NotificationStatus = "Scheduled" | "Sent" | "Cancelled" | "Failed";
export interface OrganizerNotification {
  id: string; subject: string; event: string; audience: string; channels: string[];
  scheduledAt?: string; sentAt?: string; recipients: number; success: number; failed: number; read: number; status: NotificationStatus;
}
export interface NotificationTemplate { id: string; name: string; subject: string; message: string; archived: boolean; }

export interface OrganizerSettings {
  profile: { fullName: string; email: string; phone: string; department: string; position: string; bio: string; };
  eventDefaults: { season: string; minTeamSize: number; maxTeamSize: number; registrationMode: string; fileLimit: number; timezone: string; visibility: string; dateFormat: string; };
  preferences: { theme: string; language: string; timezone: string; dateFormat: string; defaultEvent: string; pageSize: number; reducedMotion: boolean; };
  notifications: Record<string, boolean>;
  sessions: { id: string; device: string; location: string; lastActive: string; current: boolean; }[];
}

export interface Paginated<T> { data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number; }; }
