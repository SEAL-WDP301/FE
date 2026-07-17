import { Users } from "lucide-react"; import { Button } from "@/components/ui/button";
import type { RegistrationTeam } from "@/lib/organizer/registrations/registration-types";
export function RegistrationTeamTab({ team }: { team?: RegistrationTeam }) {
  if (!team) return <div className="grid min-h-56 place-items-center text-center"><div><Users className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 text-sm text-muted-foreground">Student has not joined a team.</p></div></div>;
  return <div className="rounded-xl border border-border p-4"><h4 className="font-semibold">{team.name}</h4><p className="mt-1 text-xs text-muted-foreground">{team.status} · {team.role} · {team.members.length} members</p><div className="mt-4 space-y-2 text-sm"><p><span className="text-muted-foreground">Leader:</span> {team.leader}</p>{team.members.map((member) => <div key={member} className="rounded-lg bg-muted/40 px-3 py-2">{member}</div>)}</div><Button variant="outline" className="mt-4">Open Team Details</Button></div>;
}
