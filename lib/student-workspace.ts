export const STUDENT_LAST_EVENT_KEY = "student_last_event_id";

export function getStudentLastEventId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STUDENT_LAST_EVENT_KEY);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function setStudentLastEventId(eventId: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STUDENT_LAST_EVENT_KEY, String(eventId));
}
