"use client";

import { Megaphone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { getMentorNotifications } from "@/lib/api/mentor.api";

import { MentorPageHeader } from "../_components/mentor-page-header";
import { MentorEmptyState, MentorErrorState, MentorLoadingState } from "../_components/mentor-query-state";

export default function AnnouncementsPage() {
  const query = useQuery({ queryKey: ["userNotifications"], queryFn: getMentorNotifications });
  if (query.isLoading) return <MentorLoadingState />;
  if (query.isError) return <MentorErrorState />;

  const notifications = query.data || [];
  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <MentorPageHeader title="Announcements" subtitle="Updates returned by the user notifications API." />
      {notifications.length === 0 ? (
        <MentorEmptyState title="No announcements" description="The backend returned no notifications for this account." />
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <GlassCard key={notification.id} className="rounded-[24px] bg-card p-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-primary">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap justify-between gap-3">
                    <h2 className="text-lg font-semibold">{notification.title}</h2>
                    {!notification.isRead ? <Badge>Unread</Badge> : <Badge variant="outline">Read</Badge>}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{notification.content}</p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
