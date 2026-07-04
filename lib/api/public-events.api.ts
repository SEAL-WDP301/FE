import { axiosClient } from "@/lib/axios";
import type { OrganizerEvent } from "@/lib/api/organizer-events.api";

export type PublicEvent = OrganizerEvent & {
  image_url?: string | null;
  registration_deadline?: string | null;
};

type PublicEventsResponse =
  | PublicEvent[]
  | {
      data?: PublicEvent[] | { events?: PublicEvent[] };
      events?: PublicEvent[];
    };

function normalizePublicEvents(payload: PublicEventsResponse): PublicEvent[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.events)) return payload.events;
  if (payload.data && !Array.isArray(payload.data) && Array.isArray(payload.data.events)) {
    return payload.data.events;
  }
  return [];
}

export async function getPublicEvents() {
  const res = await axiosClient.get<PublicEventsResponse>("/public/events");
  return normalizePublicEvents(res.data);
}
