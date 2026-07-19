"use client";

import { useState, useEffect, Suspense } from "react";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { Bell, Calendar, MailOpen, Mail, Clock, ExternalLink, Download, AlertCircle, CheckCircle2, XCircle, Trash2, CheckCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

// ==========================================
// DYNAMIC TEMPLATES
// ==========================================

const ActionUrlButton = ({ url }: { url?: string }) => {
  if (!url) return null;
  const isExternal = url.startsWith('http');
  return (
    <div className="mt-6 border-t border-border pt-4">
      <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
        <ExternalLink className="w-4 h-4 text-orange-500" />
        QUICK ACTION
      </h3>
      {isExternal ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
            Open Link
          </Button>
        </a>
      ) : (
        <Link href={url}>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
            View Details
          </Button>
        </Link>
      )}
    </div>
  );
};

const TeamAssignedTemplate = ({ notification }: { notification: any }) => (
  <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
    <p className="font-medium text-lg">Hello,</p>
    <p>
      The system has detected a change in your team membership. Please review the updated information below.
    </p>
    
    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
      <p className="text-blue-600 dark:text-blue-400 font-bold text-base mb-2 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" />
        UPDATED INFORMATION
      </p>
      <p className="whitespace-pre-wrap">{notification.content}</p>
    </div>

    <div>
      <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-orange-500" />
        NEXT STEPS
      </h3>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        <li>Visit the Team Management page to review the current team member list.</li>
        <li>Connect with your teammates and assign responsibilities to prepare for the upcoming round.</li>
      </ul>
    </div>
    
    <ActionUrlButton url={notification.actionUrl} />

    <div className="pt-6 border-t border-border mt-8">
      <p>Best regards,</p>
      <p className="font-bold text-orange-500 text-lg mt-1">{notification.event?.name || 'Hệ thống SEAL'}</p>
    </div>
  </div>
);

const RegistrationApprovedTemplate = ({ notification }: { notification: any }) => (
  <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
    <p className="font-medium text-lg">Dear Team Leader,</p>
    
    <p>
      Congratulations! Your team registration has been successfully evaluated and approved by the Review Committee. This is an exciting first step in your journey through our event.
    </p>
    
    <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-xl shadow-sm">
      <p className="text-green-600 dark:text-green-400 font-bold text-base mb-3 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" />
        REGISTRATION STATUS: APPROVED
      </p>
      <p className="text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: formatNotificationContent(notification.content) }} />
    </div>

    <div className="bg-muted/50 border border-border p-5 rounded-xl">
      <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
        <Download className="w-4 h-4 text-orange-500" />
        Preparation & Resources
      </h3>
      <p className="text-muted-foreground mb-3">To ensure your team is fully prepared for the upcoming phases, please review the following essential resources:</p>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        <li><strong>Competition Guidelines:</strong> Familiarize yourself with the grading rubrics and ethical standards.</li>
        <li><strong>System Operations Guide:</strong> Understand the workflow for submitting your deliverables.</li>
      </ul>
    </div>

    <ActionUrlButton url={notification.actionUrl} />

    <div className="pt-6 border-t border-border mt-8">
      <p>Warm regards,</p>
      <p className="font-bold text-orange-500 text-lg mt-1">{notification.event?.name ? `Organizing Committee ${notification.event.name}` : 'Event Organizing Committee'}</p>
    </div>
  </div>
);

const RegistrationRejectedTemplate = ({ notification }: { notification: any }) => (
  <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
    <p className="font-medium text-lg">Dear Team Leader,</p>
    
    <p>
       Thank you for your interest in participating. After careful consideration, we regret to inform you that your registration did not meet all the necessary criteria for this particular event.
    </p>
    
    <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-xl shadow-sm">
      <p className="text-red-600 dark:text-red-400 font-bold text-base mb-3 flex items-center gap-2">
        <XCircle className="w-5 h-5" />
        REGISTRATION STATUS: REJECTED
      </p>
      <p className="text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: formatNotificationContent(notification.content) }} />
    </div>

    <div className="bg-muted/50 border border-border p-5 rounded-xl">
      <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-orange-500" />
        Guidance & Next Actions
      </h3>
      <p className="text-muted-foreground mb-2">We deeply appreciate the effort you put into your application. Please do not be discouraged. You can still:</p>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        <li>Review the feedback provided above and identify areas for improvement.</li>
        <li>If the registration window is still open, you may address the highlighted issues and submit a new application.</li>
        <li>Stay tuned for future events and opportunities that might better align with your team's profile.</li>
      </ul>
    </div>

    <ActionUrlButton url={notification.actionUrl} />

    <div className="pt-6 border-t border-border mt-8">
      <p>Warm regards,</p>
      <p className="font-bold text-orange-500 text-lg mt-1">{notification.event?.name ? `Organizing Committee ${notification.event.name}` : 'Organizing Committee'}</p>
    </div>
  </div>
);

const formatNotificationContent = (content: string) => {
  if (!content) return "";
  let html = content;
  
  // Severe negative keywords (keep red)
  html = html.replace(/(rejected|disqualified)/gi, '<span class="text-red-600 dark:text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded-md">$&</span>');

  // Mild negative keywords (no background, just red text)
  html = html.replace(/(did not advance|eliminated)/gi, '<span class="font-bold text-red-500">$&</span>');
  
  // Positive keywords (need to avoid overwriting 'did not advance')
  const placeholder = '___DID_NOT_ADVANCE___';
  html = html.replace(/<span class="font-bold text-red-500">did not advance<\/span>/gi, placeholder);
  
  html = html.replace(/(advanced|approved|finalist|winner|first prize|second prize|third prize|champion)/gi, '<span class="text-green-600 dark:text-green-400 font-bold bg-green-500/10 px-1.5 py-0.5 rounded-md">$&</span>');
  
  html = html.replace(new RegExp(placeholder, 'g'), '<span class="font-bold text-red-500">did not advance</span>');

  return html;
};

const RoundResultTemplate = ({ notification }: { notification: any }) => {
  const contentLower = notification.content.toLowerCase();
  const isAdvanced = contentLower.includes('advanced') && !contentLower.includes('did not advance');
  const isEliminated = contentLower.includes('did not advance') || contentLower.includes('eliminated');
  const isAwarded = /(winner|first prize|second prize|third prize|champion|finalist)/i.test(contentLower);
  
  const isSuccess = isAdvanced || isAwarded;

  return (
    <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
      <p className="font-medium text-lg">Dear Team,</p>
      
      <p>
        The Evaluation Committee has officially announced the results for the recent round. Thank you for your exceptional hard work, dedication, and innovative spirit throughout this phase of the competition.
      </p>
      
      <div className={cn(
        "border p-5 rounded-xl shadow-sm",
        isAwarded ? "bg-amber-500/10 border-amber-500/30" :
        isAdvanced ? "bg-green-500/5 border-green-500/20" : 
        "bg-muted/30 border-border/50"
      )}>
        <p className="font-bold text-base mb-3 flex items-center gap-2">
          {isAwarded ? <CheckCircle2 className="w-5 h-5 text-amber-500" /> : 
           isAdvanced ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
           <Info className="w-5 h-5 text-muted-foreground" />}
          {isAwarded ? "🏆 OUTSTANDING ACHIEVEMENT!" : isAdvanced ? "🎉 CONGRATULATIONS!" : "📋 ROUND RESULTS"}
        </p>
        <p className="text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: formatNotificationContent(notification.content) }} />
      </div>

      {isAwarded && (
        <div className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20 p-5 rounded-xl">
          <h3 className="font-bold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Hall of Fame & Next Steps
          </h3>
          <p className="text-muted-foreground mb-3">
            Your outstanding performance has earned you a place among the top teams. The Organizing Committee would like to formally acknowledge your brilliant achievements and extend our highest commendations.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Keep an eye on your email for the official Award Ceremony invitation.</li>
            <li>Prepare a brief presentation or showcase if requested by the committee.</li>
          </ul>
        </div>
      )}

      {isAdvanced && !isAwarded && (
        <div className="bg-muted/50 border border-border p-5 rounded-xl">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-500" />
            Looking Ahead (Next Steps)
          </h3>
          <p className="text-muted-foreground mb-3">
            We are thrilled to see your team move forward. This achievement is a testament to your excellent collaboration and technical proficiency. Please prepare diligently for the upcoming challenges. The journey ahead will demand even greater innovation and resilience.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Review the guidelines for the next round immediately.</li>
            <li>Schedule a strategic meeting with your mentor to refine your approach.</li>
          </ul>
        </div>
      )}

      {isEliminated && (
        <div className="bg-muted/50 border border-border p-5 rounded-xl">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-orange-500" />
            Acknowledgment & Encouragement
          </h3>
          <p className="text-muted-foreground">
            Although your team did not advance this time, the Organizing Committee highly values the effort, creativity, and perseverance you have demonstrated. We hope the insights and feedback gained from this competition will serve as a strong foundation for your future academic and professional endeavors. Keep striving for excellence, and we look forward to seeing you in our upcoming events!
          </p>
        </div>
      )}

      <div>
        <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
          <Mail className="w-4 h-4 text-orange-500" />
          Support & Inquiries
        </h3>
        <p className="mb-2 text-muted-foreground">If you have any questions regarding the evaluation results or require further feedback, please contact us:</p>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li><strong>Organizer Email:</strong> support@seal.edu.vn</li>
          <li>Submit a formal inquiry through the competition Ticket System.</li>
        </ul>
      </div>

      <ActionUrlButton url={notification.actionUrl} />

      <div className="pt-6 border-t border-border mt-8">
        <p>Best regards,</p>
        <p className="font-bold text-orange-500 text-lg mt-1">{notification.event?.name ? `Evaluation Committee ${notification.event.name}` : 'Evaluation Committee'}</p>
      </div>
    </div>
  );
};

const TeamInvitationTemplate = ({ notification }: { notification: any }) => {
  const isAccepted = notification.type === "team_invite_accepted";
  const isRejected = notification.type === "team_invite_rejected";
  
  return (
    <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
      <p className="font-medium text-lg">Dear Team Leader,</p>
      
      <p>
        There is an update regarding a recent invitation you sent out for your team.
      </p>
      
      <div className={cn(
        "border p-5 rounded-xl shadow-sm",
        isAccepted ? "bg-green-500/5 border-green-500/20" : 
        isRejected ? "bg-muted/30 border-border/50" : 
        "bg-blue-500/5 border-blue-500/20"
      )}>
        <p className="font-bold text-base mb-3 flex items-center gap-2">
          {isAccepted ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
           isRejected ? <XCircle className="w-5 h-5 text-muted-foreground" /> : 
           <Info className="w-5 h-5 text-blue-500" />}
          {isAccepted ? "INVITATION ACCEPTED" : 
           isRejected ? "INVITATION DECLINED" : "TEAM UPDATE"}
        </p>
        <p className="text-base leading-relaxed">
          {notification.content}
        </p>
      </div>

      <ActionUrlButton url={notification.actionUrl} />

      <div className="pt-6 border-t border-border mt-8">
        <p>Best regards,</p>
        <p className="font-bold text-orange-500 text-lg mt-1">{notification.event?.name ? `SEAL System - ${notification.event.name}` : 'SEAL System'}</p>
      </div>
    </div>
  );
};

const GenericTemplate = ({ notification }: { notification: any }) => (
  <div className="space-y-4 text-sm text-foreground/90 leading-relaxed">
    <p>Hello,</p>
    <div className="bg-muted/30 border border-border/50 p-4 rounded-lg">
      <p className="whitespace-pre-wrap">{notification.content}</p>
    </div>
    
    <ActionUrlButton url={notification.actionUrl} />
    
    <div className="pt-6 border-t border-border mt-8">
      <p>Best regards,</p>
      <p className="font-bold">SEAL System</p>
    </div>
  </div>
);

const StakeholderAssignedTemplate = ({ notification }: { notification: any }) => {
  const isMentor = notification.type === "mentor_assigned";
  const roleText = isMentor ? "Mentor" : "Judge";
  const basePath = isMentor ? `/mentor/events/${notification.eventId}` : `/judge/events/${notification.eventId}`;
  const actionUrl = notification.actionUrl || basePath;

  return (
    <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
      <p className="font-medium text-lg">Dear {roleText},</p>
      
      <p>
        We are thrilled to welcome you to the evaluation committee. You have been officially assigned as a {roleText.toLowerCase()} for the upcoming phases of our event.
      </p>
      
      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
        <p className="text-blue-600 dark:text-blue-400 font-bold text-base mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          ASSIGNMENT DETAILS
        </p>
        <p className="whitespace-pre-wrap">{notification.content}</p>
      </div>

      <ActionUrlButton url={actionUrl} />

      <div className="pt-6 border-t border-border mt-8">
        <p>Best regards,</p>
        <p className="font-bold text-orange-500 text-lg mt-1">{notification.event?.name ? `Organizing Committee ${notification.event.name}` : 'Event Organizing Committee'}</p>
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

function NotificationsContent() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const idParam = searchParams.get('id');

  const { 
    data, 
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['userNotifications'],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get(`/notifications?page=${pageParam}&limit=25`);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    }
  });

  const notifications = data?.pages.flatMap((page) => page.data) || [];

  useEffect(() => {
    if (idParam && notifications.length > 0) {
      const id = parseInt(idParam, 10);
      if (!isNaN(id)) {
        setSelectedId(id);
        const notif = notifications.find((n: any) => n.id === id);
        if (notif && !notif.isRead) {
          markAsReadMutation.mutate(id);
        }
      }
    } else if (!selectedId && notifications.length > 0) {
      setSelectedId(notifications[0].id);
    }
  }, [idParam, notifications]);

  const selectedNotification = notifications.find((n: any) => n.id === selectedId);

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosClient.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.patch('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
      enqueueSnackbar("All have been marked as read.", { variant: 'success' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosClient.delete(`/notifications/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
      if (selectedId === id) {
        setSelectedId(null);
        router.replace('/home/notifications');
      }
      enqueueSnackbar("Notification removed", { variant: 'info' });
    }
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.delete('/notifications/all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
      setSelectedId(null);
      router.replace('/home/notifications');
      enqueueSnackbar("All notification have been deleted", { variant: 'info' });
    }
  });

  const handleSelectNotification = (notif: any) => {
    setSelectedId(notif.id);
    router.replace(`/home/notifications?id=${notif.id}`);
    if (!notif.isRead) {
      markAsReadMutation.mutate(notif.id);
    }
  };

  // Helper to map type to template
  const renderTemplate = (notification: any) => {
    switch (notification.type) {
      case 'team_assigned':
        return <TeamAssignedTemplate notification={notification} />;
      case 'registration_approved':
        return <RegistrationApprovedTemplate notification={notification} />;
      case 'registration_rejected':
        return <RegistrationRejectedTemplate notification={notification} />;
      case 'round_result':
      case 'final_result':
      case 'finalist':
        return <RoundResultTemplate notification={notification} />;
      case 'mentor_assigned':
      case 'judge_assigned':
        return <StakeholderAssignedTemplate notification={notification} />;
      case 'team_invite_accepted':
      case 'team_invite_rejected':
      case 'team_leadership_transfer':
        return <TeamInvitationTemplate notification={notification} />;
      default:
        return <GenericTemplate notification={notification} />;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-background">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Bell className="w-6 h-6 text-orange-500" />
          Notification Center
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Stay updated with the latest announcements, notifications, and event schedules.</p>
      </div>

      {/* Main Inbox Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Column: Notification List */}
        <div className="w-1/3 min-w-[320px] max-w-[400px] border-r border-border bg-card/20 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur z-10 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Tất cả thông báo</h2>
              <span className="bg-orange-500/10 text-orange-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {notifications.length}
              </span>
            </div>
            
            {notifications.length > 0 && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs h-8 text-muted-foreground"
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending || notifications.every((n: any) => n.isRead)}
                >
                  <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
                  Mark all read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete all notifications?")) {
                      deleteAllMutation.mutate();
                    }
                  }}
                  disabled={deleteAllMutation.isPending}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground animate-pulse">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
              <Bell className="w-12 h-12 mb-3 opacity-20" />
              <p>No notifications available.</p>
            </div>
          ) : (
            <div 
              className="flex-1 overflow-y-auto p-2 space-y-1"
              onScroll={(e) => {
                const target = e.target as HTMLDivElement;
                if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
                  if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }
              }}
            >
              {notifications.map((notif: any) => {
                const isSelected = selectedNotification?.id === notif.id;
                return (
                  <div key={notif.id} className="relative group">
                    <button
                      onClick={() => handleSelectNotification(notif)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl transition-all duration-200 border border-transparent",
                        isSelected
                          ? "bg-muted shadow-sm border-border/50" 
                          : "hover:bg-muted/50",
                        !notif.isRead && !isSelected ? "bg-orange-500/5 border-orange-500/20" : ""
                      )}
                    >
                      <div className="flex justify-between items-start mb-2 pr-6">
                        <div className="flex items-center gap-2">
                          {!notif.isRead ? (
                            <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                          ) : (
                            <MailOpen className={cn("w-4 h-4 shrink-0", isSelected ? "text-orange-500" : "text-muted-foreground")} />
                          )}
                          <span className="text-xs font-semibold text-muted-foreground truncate max-w-[120px]" title={notif.event?.name || 'Hệ thống SEAL'}>
                            {notif.event?.name || 'SEAL System'}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <h3 className={cn(
                        "text-sm line-clamp-2 leading-snug",
                        !notif.isRead ? "font-bold text-foreground" : "font-medium text-foreground/80"
                      )}>
                        {notif.title}
                      </h3>
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(notif.id);
                      }}
                      className="absolute top-4 right-3 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 p-1 rounded-md"
                      title="Delete notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
              {isFetchingNextPage && (
                <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">
                  Loading more...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Detailed View */}
        <div className="flex-1 bg-background overflow-y-auto relative">
          {selectedNotification ? (
            <div className="max-w-4xl mx-auto p-8 md:p-12">
              
              {/* Email Header Style */}
              <div className="mb-8 pb-6 border-b border-border/50">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                    {selectedNotification.title}
                  </h1>
                </div>
                
                <div className="flex items-center justify-between bg-muted/30 p-4 rounded-xl border border-border/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shrink-0">
                      <span className="text-orange-600 font-bold text-lg">
                        {selectedNotification.event?.name ? selectedNotification.event.name.charAt(0).toUpperCase() : 'S'}
                      </span>
                    </div>
                    <div>
                      {selectedNotification.event?.id ? (
                        <Link href={`/home/events/${selectedNotification.event.id}`} className="font-semibold text-foreground hover:text-orange-500 hover:underline transition-colors">
                          {selectedNotification.event.name}
                        </Link>
                      ) : (
                        <p className="font-semibold text-foreground">{selectedNotification.event?.name || 'SEAL System'}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">To: You</p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-muted-foreground">
                      {format(new Date(selectedNotification.createdAt), "dd/MM/yyyy, HH:mm")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Template Render */}
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-foreground">
                {renderTemplate(selectedNotification)}
              </div>
              
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <MailOpen className="w-16 h-16 opacity-20 mb-4" />
              <p>Select a notification to view its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationsContent />
    </Suspense>
  );
}

