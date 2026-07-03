"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Users, Target, MessageSquare, ExternalLink } from "lucide-react";
import { FloatingTeamChat } from "@/components/floating-team-chat";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function MentorMessagesPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const eventId = params.eventId as string;
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  const { data: teams, isLoading } = useQuery({
    queryKey: ["mentorTeams", eventId],
    queryFn: async () => {
      const res = await axiosClient.get(`/mentor/teams?eventId=${eventId}`);
      return res.data.data;
    },
    enabled: !!eventId,
  });

  const sortedTeams = teams ? [...teams].sort((a, b) => {
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
    const aDate = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bDate = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return bDate - aDate;
  }) : [];

  // Default select first team
  useEffect(() => {
    if (sortedTeams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(sortedTeams[0].id);
    }
  }, [sortedTeams, selectedTeamId]);

  const handleTeamSelect = (team: any) => {
    setSelectedTeamId(team.id);
    // Optimistically clear unread count
    if (team.unreadCount > 0) {
      queryClient.setQueryData(["mentorTeams", eventId], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((t: any) => t.id === team.id ? { ...t, unreadCount: 0 } : t);
      });
    }
  };

  const selectedTeamData = sortedTeams.find(t => t.id === selectedTeamId);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Left side: Teams list */}
      <div className="w-[280px] shrink-0 flex flex-col gap-2 overflow-y-auto pr-2 no-scrollbar">
        <div className="mb-2">
          <h2 className="text-lg font-bold tracking-tight">Messages</h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-orange-500" /></div>
        ) : sortedTeams.map((team: any) => {
          const currentRound = team.teamRounds?.[0]?.round;

          return (
            <Card 
              key={team.id}
              onClick={() => handleTeamSelect(team)}
              className={`relative p-2.5 cursor-pointer transition-all hover:border-orange-500/50 hover:shadow-sm ${selectedTeamId === team.id ? 'border-orange-500 ring-1 ring-orange-500 shadow-sm bg-orange-50/50 dark:bg-orange-500/10' : ''}`}
            >
              {team.unreadCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 z-10 flex items-center justify-center min-w-[18px] h-4.5 px-1 bg-red-500 text-white border-2 border-background rounded-full shadow-sm text-[9px] font-bold">
                  {team.unreadCount > 99 ? '99+' : team.unreadCount}
                </div>
              )}
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-sm line-clamp-1 pr-2">{team.name}</h3>
                {team.track && <Badge variant="outline" className="shrink-0 text-[8px] h-4 px-1">{team.track.name}</Badge>}
              </div>
              
              {currentRound && (
                <div className="text-[10px] text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Target className="h-2.5 w-2.5" />
                  <span className="truncate">{currentRound.name}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-1">
                <div className="flex -space-x-1">
                   {(team.members || []).slice(0, 3).map((m: any, idx: number) => (
                     <Avatar key={`avatar-${team.id}-${m.user?.id || 'anon'}-${idx}`} className="h-4 w-4 border border-background">
                       <AvatarImage src={m.user?.avatarUrl || m.user?.avatar_url} />
                       <AvatarFallback className="text-[6px]">{m.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                     </Avatar>
                   ))}
                   {(team.members?.length || 0) > 3 && (
                     <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[6px] border border-background z-10 font-medium">
                       +{(team.members?.length || 0) - 3}
                     </div>
                   )}
                </div>
                <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{team.members?.length || 0}</span>
                </div>
              </div>
            </Card>
          );
        })}
        {teams?.length === 0 && (
           <div className="text-center py-10 text-muted-foreground text-sm">
             No teams found.
           </div>
        )}
      </div>

      {/* Right side: Chat */}
      <div className="flex-1 bg-card rounded-xl border border-border shadow-sm overflow-hidden relative flex flex-col">
        {selectedTeamId ? (
          <>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] leading-tight">{selectedTeamData?.name}</h3>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Target className="h-3 w-3" />
                    <span>{selectedTeamData?.track?.name || 'Hackathon Team'}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5 h-8 text-[11px] font-medium"
                onClick={() => router.push(`/mentor/events/${eventId}/teams/${selectedTeamId}`)}
              >
                View Team <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex-1 relative">
              <FloatingTeamChat teamId={selectedTeamId} teamName={selectedTeamData?.name} inline={true} defaultOpen={true} />
            </div>
          </>
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
