"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { Bell, Calendar, MailOpen, Mail, Clock, ExternalLink, Download, AlertCircle, CheckCircle2, XCircle, Trash2, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ==========================================
// DYNAMIC TEMPLATES
// ==========================================

const TeamAssignedTemplate = ({ notification }: { notification: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) => (
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
    
    <div className="pt-6 border-t border-border mt-8">
      <p>Best regards,</p>
      <p className="font-bold text-orange-500 text-lg mt-1">{notification.event?.name || 'Hệ thống SEAL'}</p>
    </div>
  </div>
);

const RegistrationApprovedTemplate = ({ notification }: { notification: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) => (
  <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
    <p className="font-medium text-lg">Dear Team Leader,</p>
    
    <p>
      Congratulations! Your team registration has been successfully approved.
    </p>
    
    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
      <p className="text-green-600 dark:text-green-400 font-bold text-base mb-2 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" />
        REGISTRATION APPROVED
      </p>
      <p className="whitespace-pre-wrap">{notification.content}</p>
    </div>

    <div>
      <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
        <Download className="w-4 h-4 text-orange-500" />
        IMPORTANT DOCUMENTS
      </h3>
      <p className="mb-2">Please download and carefully review the following event documents:</p>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        <li><strong>Competition Rules:</strong> Understand the regulations and judging criteria.</li>
        <li><strong>Platform Guide:</strong> Learn how to use the submission system.</li>
      </ul>
    </div>

    <div className="pt-6 border-t border-border mt-8">
      <p>Best regards,</p>
      <p className="font-bold text-orange-500 text-lg mt-1">{notification.event?.name ? `Organizing Committee ${notification.event.name}` : 'Event Organizing Committee'}</p>
    </div>
  </div>
);

const RegistrationRejectedTemplate = ({ notification }: { notification: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) => (
  <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
    <p className="font-medium text-lg">Dear Team Leader,</p>
    
    <p>
       We regret to inform you that your registration did not meet the requirements for this event.
    </p>
    
    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
      <p className="text-red-600 dark:text-red-400 font-bold text-base mb-2 flex items-center gap-2">
        <XCircle className="w-5 h-5" />
        REJECTION REASON
      </p>
      <p className="whitespace-pre-wrap">{notification.content}</p>
    </div>

    <div>
      <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-orange-500" />
        NEXT ACTIONS
      </h3>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        <li>If registration is still open, you may update the required information and resubmit your application.</li>
        <li>Please carefully review your team information and attached documents.</li>
      </ul>
    </div>

    <div className="pt-6 border-t border-border mt-8">
      <p>Best regards,</p>
      <p className="font-bold text-orange-500 text-lg mt-1">{notification.event?.name ? `Ban tổ chức ${notification.event.name}` : 'Ban tổ chức sự kiện'}</p>
    </div>
  </div>
);

const RoundResultTemplate = ({ notification }: { notification: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) => (
  <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
    <p className="font-medium text-lg">Dear Team,</p>
    
    <p>
      The results for the recent round have been officially announced. Thank you for your hard work and dedication.
    </p>
    
    <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
      <p className="text-orange-600 dark:text-orange-400 font-bold text-base mb-2">🎉 ROUND RESULTS</p>
      <p className="whitespace-pre-wrap">{notification.content}</p>
    </div>

    <div>
      <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
        <ExternalLink className="w-4 h-4 text-orange-500" />
        ADDITIONAL SUPPORT
      </h3>
      <p className="mb-2">If you have any questions regarding the evaluation results, please contact:</p>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        <li><strong>Organizer Email:</strong> support@seal.edu.vn</li>
        <li> Submit your inquiries through the competition Ticket System.</li>
      </ul>
    </div>

    <div className="pt-6 border-t border-border mt-8">
      <p>Best regards,</p>
      <p className="font-bold text-orange-500 text-lg mt-1">{notification.event?.name ? `Evaluation Committee ${notification.event.name}` : 'Evaluation Committee'}</p>
    </div>
  </div>
);

const GenericTemplate = ({ notification }: { notification: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) => (
  <div className="space-y-4 text-sm text-foreground/90 leading-relaxed">
    <p>Hello,</p>
    <p className="whitespace-pre-wrap">{notification.content}</p>
    <br />
    <div className="pt-6 border-t border-border mt-8">
      <p>Best regards,</p>
      <p className="font-bold">SEAL System</p>
    </div>
  </div>
);

const StakeholderAssignedTemplate = ({ notification }: { notification: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) => {
  const isMentor = notification.type === "mentor_assigned";
  const roleText = isMentor ? "Mentor" : "Judge";
  const basePath = isMentor ? `/mentor/events/${notification.eventId}` : `/judge/events/${notification.eventId}`;

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

      <div>
        <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-orange-500" />
          ACCESS YOUR WORKSPACE
        </h3>
        <p className="mb-4">Please click the button below to access your dedicated workspace, where you can review team details, schedules, and grading rubrics.</p>
        {notification.eventId ? (
          <Link href={basePath}>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
              Go to {roleText} Workspace
            </Button>
          </Link>
        ) : (
          <p className="text-muted-foreground italic">Event link is unavailable.</p>
        )}
      </div>

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

export default function NotificationsPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Fetch Real Data
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['userNotifications'],
    queryFn: async () => {
      const res = await axiosClient.get('/users/notifications');
      return res.data.data;
    },
  });

  const selectedNotification = notifications.find((n: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => n.id === selectedId) || notifications[0];

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosClient.patch(`/users/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.patch('/users/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
      enqueueSnackbar("All have been marked as read.", { variant: 'success' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosClient.delete(`/users/notifications/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
      if (selectedId === id) setSelectedId(null);
      enqueueSnackbar("Notification removed", { variant: 'info' });
    }
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.delete('/users/notifications/all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
      setSelectedId(null);
      enqueueSnackbar("All notification have been deleted", { variant: 'info' });
    }
  });

  const handleSelectNotification = (notif: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
    setSelectedId(notif.id);
    if (!notif.isRead) {
      markAsReadMutation.mutate(notif.id);
    }
  };

  // Helper to map type to template
  const renderTemplate = (notification: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
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
                  disabled={markAllAsReadMutation.isPending || notifications.every((n: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => n.isRead)}
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
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {notifications.map((notif: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
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
                      <p className="font-semibold text-foreground">{selectedNotification.event?.name || 'SEAL System'}</p>
                      <p className="text-xs text-muted-foreground">To: You</p>
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
