"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { useParams } from "next/navigation";
import { Loader2, Users, Target, MessageSquare } from "lucide-react";
import { FloatingTeamChat } from "@/components/floating-team-chat";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function RoundMessagesPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  const { data: teams, isLoading } = useQuery({
    queryKey: ["organizerTeams", eventId],
    queryFn: async () => {
      const res = await axiosClient.get(`/organizer/teams/events/${eventId}`);
      // return only approved teams or all, let's return all to be able to talk to anyone
      return res.data.data;
    },
  });

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left side: Teams list */}
      <div className="w-[350px] shrink-0 flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Messages</h2>
          <p className="text-sm text-muted-foreground mt-1">Select a team to view their chat room.</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
        ) : teams?.map((team: any) => (
          <Card 
            key={team.id}
            onClick={() => setSelectedTeamId(team.id)}
            className={`p-4 cursor-pointer transition-all hover:border-orange-500/50 hover:shadow-md ${selectedTeamId === team.id ? 'border-orange-500 ring-1 ring-orange-500 shadow-md bg-orange-50/50 dark:bg-orange-500/10' : ''}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-base line-clamp-1">{team.name}</h3>
              {team.track && <Badge variant="outline" className="shrink-0 text-[10px] h-5">{team.track.name}</Badge>}
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{team.members?.length || 0} members</span>
              </div>
              {team.mentors && team.mentors.length > 0 && (
                <div className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  <span>{team.mentors.length} mentors</span>
                </div>
              )}
            </div>

            <div className="flex -space-x-2 mt-3">
               {[...(team.leader ? [{ user: team.leader }] : []), ...(team.members || [])].slice(0, 5).map((m: any, idx) => (
                 <Avatar key={`avatar-${team.id}-${m.user?.id || 'anon'}-${idx}`} className="h-6 w-6 border-2 border-background ring-1 ring-border/50">
                   <AvatarImage src={m.user?.avatarUrl || m.user?.avatar_url} />
                   <AvatarFallback className="text-[8px]">{m.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                 </Avatar>
               ))}
               {((team.members?.length || 0) + (team.leader ? 1 : 0)) > 5 && (
                 <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[8px] border-2 border-background ring-1 ring-border/50 z-10 font-medium">
                   +{((team.members?.length || 0) + (team.leader ? 1 : 0)) - 5}
                 </div>
               )}
            </div>
          </Card>
        ))}
        {teams?.length === 0 && (
           <div className="text-center py-10 text-muted-foreground text-sm">
             No teams found in this event.
           </div>
        )}
      </div>

      {/* Right side: Chat */}
      <div className="flex-1 bg-card rounded-2xl border border-border shadow-sm overflow-hidden relative">
        {selectedTeamId ? (
          <div className="absolute inset-0">
            <FloatingTeamChat teamId={selectedTeamId} inline={true} defaultOpen={true} />
          </div>
        ) : (
          <div className="flex flex-col h-full items-center justify-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground/30" />
            <p>Select a team from the list to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}
