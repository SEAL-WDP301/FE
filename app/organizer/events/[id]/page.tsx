import { redirect } from "next/navigation";

export default function OrganizerEventRoot({ params }: { params: { id: string } }) {
  redirect(`/organizer/events/${params.id}/overview`);
}
