"use client";

import { useState } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { enqueueSnackbar } from "notistack";
import { 
  Users, GraduationCap, FileText, Award, MessageSquare,
  ChevronLeft, ChevronRight, LogOut, User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function RoundWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const eventId = params.id as string;
  const roundId = params.roundId as string;
  const baseUrl = `/organizer/events/${eventId}/rounds/${roundId}`;

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const roundNavItems = [
    { name: "Teams", href: `${baseUrl}/teams`, icon: Users },
    { name: "Mentors & Judges", href: `${baseUrl}/stakeholders`, icon: GraduationCap },
    { name: "Submissions", href: `${baseUrl}/submissions`, icon: FileText },
    { name: "Grading Criteria", href: `${baseUrl}/criteria`, icon: Award },
    { name: "Messages", href: `${baseUrl}/messages`, icon: MessageSquare },
  ];

  const { data: user } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return null;
        const res = await axiosClient.get('/users/profile');
        const profile = res.data?.data;
        return profile
            ? { ...profile, avatarUrl: profile.avatarUrl ?? profile.avatar_url }
            : null;
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    queryClient.setQueryData(['userProfile'], null);
    enqueueSnackbar('Đăng xuất thành công!', { variant: 'info' });
    router.push('/');
  };

  const avatarUrl = typeof user?.avatarUrl === 'string' ? user.avatarUrl.trim() : '';

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-8rem)] items-start">
      {/* Expandable Sidebar Wrapper */}
      <div className="sticky top-20 h-[calc(100vh-6rem)] shrink-0 z-10">
        <motion.aside
          initial={false}
          animate={{ width: isSidebarExpanded ? 280 : 80 }}
          className="relative flex flex-col h-full rounded-2xl border border-border bg-card shadow-sm transition-all duration-300"
        >
        <button
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          {isSidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        <div className={cn("p-6 pb-2 flex items-center transition-opacity duration-300", !isSidebarExpanded && "justify-center px-0")}>
          <span className="font-bold tracking-tight text-primary truncate">
            {isSidebarExpanded ? "Round Workspace" : "RW"}
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar space-y-2 p-4">
          {roundNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all group overflow-hidden",
                  isActive
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  !isSidebarExpanded && "justify-center"
                )}
                title={!isSidebarExpanded ? item.name : undefined}
              >
                <item.icon className={cn("shrink-0", isActive ? "text-blue-500" : "text-muted-foreground group-hover:text-foreground", isSidebarExpanded ? "h-5 w-5 mr-3" : "h-6 w-6")} />
                {isSidebarExpanded && (
                  <span className="truncate relative z-10">{item.name}</span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebarIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-blue-500"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

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
              "flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-500/10 hover:text-red-600",
              !isSidebarExpanded && "justify-center"
            )}
          >
            <LogOut className={cn("shrink-0", isSidebarExpanded ? "h-5 w-5 mr-3" : "h-6 w-6")} />
            {isSidebarExpanded && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>
      </div>

      {/* Round Content */}
      <div className="flex-1 min-w-0 animate-in fade-in duration-500">
        {children}
      </div>
    </div>
  );
}
