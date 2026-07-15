"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getOrganizerEvent } from "@/lib/api/organizer-events.api";
import {
  LayoutDashboard,
  GitMerge,
  ChevronRight,
  ChevronLeft,
  MessageSquareText,
  Users, 
  GraduationCap, 
  FileText, 
  Award, 
  BarChart3,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useSocket } from "@/lib/hooks/useSocket";
import { useEffect, useState } from "react";
import { axiosClient } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export default function EventDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const eventId = params.id as string;
  const roundId = params.roundId as string | undefined;
  const baseUrl = `/organizer/events/${eventId}`;
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const currentTabMatch = pathname.match(/\/rounds\/\d+\/(teams|stakeholders|submissions|criteria|rankings)/);
  const currentTab = currentTabMatch ? currentTabMatch[1] : "teams";

  const { data: teams } = useQuery({
    queryKey: ["organizerTeams", eventId],
    queryFn: async () => {
      const res = await axiosClient.get(`/organizer/teams/events/${eventId}`);
      return res.data.data;
    },
  });

  const unreadTeamsCount = teams?.reduce((acc: number, team: any) => acc + (team.unreadCount > 0 ? 1 : 0), 0) || 0;

  const navItems = [
    { name: "Overview", href: `${baseUrl}/overview`, icon: LayoutDashboard },
    { name: "Tracks & Rounds", href: `${baseUrl}/tracks`, icon: GitMerge },
    { name: "Messages", href: `${baseUrl}/messages`, icon: MessageSquareText, badge: unreadTeamsCount },
  ];

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ["organizerEvent", eventId],
    queryFn: () => getOrganizerEvent(eventId),
  });

  const eventName = isLoading
    ? "Loading event..."
    : isError
      ? "Event unavailable"
      : event?.name || "Event Control";
  const eventIconUrl = event?.icons?.[0]?.url;

  const { data: user } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
        const token = useAuthStore.getState().accessToken;
        if (!token) return null;
        const res = await axiosClient.get('/users/profile');
        const profile = res.data?.data;
        return profile
            ? { ...profile, avatarUrl: profile.avatarUrl ?? profile.avatar_url }
            : null;
    },
  });

  const avatarUrl = typeof user?.avatarUrl === 'string' ? user.avatarUrl.trim() : '';

  const handleLogout = () => {
    useAuthStore.getState().clearAccessToken();
    queryClient.setQueryData(['userProfile'], null);
    enqueueSnackbar('Đăng xuất thành công!', { variant: 'info' });
    router.push('/');
  };

  const { socket, isConnected } = useSocket("/chat");

  useEffect(() => {
    if (!socket || !isConnected || !teams || teams.length === 0) return;

    teams.forEach((team: any) => {
      socket.emit("join_team_room", team.id);
    });

    const handleReceiveMessage = (newMessage: any) => {
      queryClient.setQueryData(["organizerTeams", eventId], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((t: any) => {
          if (t.id === newMessage.teamId) {
            return {
              ...t,
              unreadCount: (t.unreadCount || 0) + (newMessage.senderId !== user?.id ? 1 : 0),
              lastMessageAt: newMessage.createdAt,
            };
          }
          return t;
        });
      });
    };

    const handleMessagesReadUpdated = (updatedMessages: any[]) => {
      if (!updatedMessages || updatedMessages.length === 0) return;
      const teamId = updatedMessages[0].teamId;
      queryClient.setQueryData(["organizerTeams", eventId], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((t: any) => {
          if (t.id === teamId) {
            return { ...t, unreadCount: 0 };
          }
          return t;
        });
      });
    };

    socket.on("receive_chat_message", handleReceiveMessage);
    socket.on("messages_read_updated", handleMessagesReadUpdated);

    return () => {
      socket.off("receive_chat_message", handleReceiveMessage);
      socket.off("messages_read_updated", handleMessagesReadUpdated);
    };
  }, [socket, isConnected, teams, queryClient, eventId, user?.id]);

  const sortedRounds = [...(event?.rounds || [])].sort((a, b) => a.roundNumber - b.roundNumber);
  const activeRoundId = roundId || (sortedRounds.length > 0 ? String(sortedRounds[0].id) : null);

  const roundNavItems = activeRoundId ? [
    { name: "Teams", href: `${baseUrl}/rounds/${activeRoundId}/teams`, icon: Users },
    { name: "Mentors & Judges", href: `${baseUrl}/rounds/${activeRoundId}/stakeholders`, icon: GraduationCap },
    { name: "Submissions", href: `${baseUrl}/rounds/${activeRoundId}/submissions`, icon: FileText },
    { name: "Grading Criteria", href: `${baseUrl}/rounds/${activeRoundId}/criteria`, icon: Award },
    { name: "Rankings", href: `${baseUrl}/rounds/${activeRoundId}/rankings`, icon: BarChart3 },
  ] : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Global Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="flex h-16 items-center px-6 gap-6 max-w-[1600px] mx-auto w-full">
          {/* Event Info */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-8 w-8 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center font-bold overflow-hidden shrink-0">
              {eventIconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={eventIconUrl} alt={`${eventName} icon`} className="h-full w-full object-cover" />
              ) : (
                eventName.charAt(0).toUpperCase()
              )}
            </div>
            <h2 className="font-bold tracking-tight truncate max-w-[200px] sm:max-w-[300px]">{eventName}</h2>
          </div>

          <div className="h-6 w-px bg-border shrink-0" />

          {/* Round Line Timeline */}
          {sortedRounds.length > 0 && (
            <>
              <div className="h-6 w-px bg-border shrink-0 ml-auto" />
              <div className="overflow-x-auto no-scrollbar flex items-center gap-2 pl-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2 shrink-0 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  Workspace
                </span>
                <div className="flex items-center gap-2">
                  {sortedRounds.map((round, index) => {
                    const isRoundActive = roundId === String(round.id);
                    return (
                      <div key={round.id} className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`${baseUrl}/rounds/${round.id}/${currentTab}`}
                          className={cn(
                            "relative px-4 py-1.5 text-sm font-semibold transition-all duration-300 rounded-full border shadow-sm flex items-center gap-2 group",
                            isRoundActive
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent ring-2 ring-blue-500/30 scale-105"
                              : "bg-background text-muted-foreground border-border hover:border-blue-500/50 hover:text-foreground hover:bg-blue-50/50 dark:hover:bg-blue-950/30"
                          )}
                        >
                          {isRoundActive && (
                            <motion.div 
                              layoutId="activeRoundGlow" 
                              className="absolute inset-0 rounded-full bg-white/20 blur-md pointer-events-none" 
                            />
                          )}
                          <span className="relative z-10">{round.name}</span>
                        </Link>
                        {index < sortedRounds.length - 1 && (
                          <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-1 max-w-[1600px] mx-auto w-full px-6 pt-6 gap-6">
        {/* Expandable Sidebar Wrapper */}
        <div className="sticky top-[88px] h-[calc(100vh-88px-1.5rem)] shrink-0 z-10">
          <motion.aside
            initial={false}
            animate={{ width: isSidebarExpanded ? 260 : 80 }}
            className="relative flex flex-col h-full rounded-2xl border border-border bg-card shadow-sm transition-all duration-300"
          >
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              {isSidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 p-4">
              {/* Event Workspace section */}
              <div>
                <div className={cn("text-xs font-semibold text-muted-foreground mb-2 ml-2 transition-opacity duration-300", !isSidebarExpanded && "opacity-0 text-center ml-0")}>
                  {isSidebarExpanded ? "EVENT MANAGEMENT" : "..."}
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all group overflow-hidden",
                          isActive
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          !isSidebarExpanded && "justify-center"
                        )}
                        title={!isSidebarExpanded ? item.name : undefined}
                      >
                        <item.icon className={cn("shrink-0", isActive ? "text-blue-500" : "text-muted-foreground group-hover:text-foreground", isSidebarExpanded ? "h-5 w-5 mr-3" : "h-5 w-5")} />
                        {isSidebarExpanded && (
                          <span className="truncate relative z-10 flex-1">{item.name}</span>
                        )}
                        {item.badge !== undefined && item.badge > 0 && (
                          <div className={cn("flex items-center justify-center bg-red-500 text-white font-bold rounded-full text-[10px]", isSidebarExpanded ? "h-5 min-w-5 px-1 ml-2" : "absolute top-1 right-1 h-3.5 min-w-3.5 px-0.5")}>
                            {item.badge > 99 ? '99+' : item.badge}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Round Workspace section */}
              {roundNavItems.length > 0 && (
                <div>
                  <div className={cn("text-xs font-semibold text-muted-foreground mb-2 ml-2 transition-opacity duration-300", !isSidebarExpanded && "opacity-0 text-center ml-0")}>
                    {isSidebarExpanded ? "ROUND WORKSPACE" : "..."}
                  </div>
                  <nav className="space-y-1">
                    {roundNavItems.map((item) => {
                      const isActive = pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all group overflow-hidden",
                            isActive
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            !isSidebarExpanded && "justify-center"
                          )}
                          title={!isSidebarExpanded ? item.name : undefined}
                        >
                          <item.icon className={cn("shrink-0", isActive ? "text-blue-500" : "text-muted-foreground group-hover:text-foreground", isSidebarExpanded ? "h-5 w-5 mr-3" : "h-5 w-5")} />
                          {isSidebarExpanded && (
                            <span className="truncate relative z-10 flex-1">{item.name}</span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              )}
            </div>

            {/* User Profile & Logout */}
            <div className={cn("mt-auto p-4 border-t border-border", !isSidebarExpanded && "flex flex-col items-center")}>
              {user ? (
                <div className={cn("flex items-center gap-3 mb-4", !isSidebarExpanded && "justify-center")}>
                  <Avatar className={cn("ring-2 ring-primary/10", isSidebarExpanded ? "h-10 w-10 shrink-0" : "h-10 w-10")}>
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={user.name} />
                    ) : null}
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase() || <UserIcon className="h-4 w-4" />}</AvatarFallback>
                  </Avatar>
                  {isSidebarExpanded && (
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold truncate text-foreground">{user.name}</span>
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                  )}
                </div>
              ) : (
                 isSidebarExpanded && <div className="mb-4 text-sm text-muted-foreground">Not logged in</div>
              )}

              <button
                onClick={handleLogout}
                title={!isSidebarExpanded ? "Logout" : undefined}
                className={cn(
                  "flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-all hover:bg-red-500/10 hover:text-red-600",
                  !isSidebarExpanded && "justify-center"
                )}
              >
                <LogOut className={cn("shrink-0", isSidebarExpanded ? "h-5 w-5 mr-3" : "h-5 w-5")} />
                {isSidebarExpanded && <span>Logout</span>}
              </button>
            </div>
          </motion.aside>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 bg-gradient-to-br from-background to-muted/20 min-w-0 pb-6">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
