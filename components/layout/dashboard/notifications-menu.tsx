"use client";

import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export function NotificationsMenu() {
  const { data, isLoading } = useQuery({
    queryKey: ['userNotifications'],
    queryFn: async () => {
      const res = await axiosClient.get('/users/notifications');
      return res.data.data;
    },
  });

  const notifications = data || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2">
        <DropdownMenuLabel className="font-bold flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 text-xs px-2 py-0.5 rounded-full">
              {unreadCount} mới
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
            <Bell className="h-8 w-8 opacity-20" />
            <p>No notifications</p>
          </div>
        ) : (
          <div className="max-h-[350px] overflow-y-auto space-y-1 pr-1">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {notifications.map((notif: any) => (
              <DropdownMenuItem 
                key={notif.id} 
                className={`p-3 rounded-lg flex flex-col items-start gap-1 cursor-default focus:bg-muted ${!notif.isRead ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''}`}
              >
                <div className="flex justify-between items-start w-full gap-2">
                  <p className={`text-sm leading-tight text-foreground ${!notif.isRead ? 'font-bold' : 'font-medium'}`}>
                    {notif.title}
                  </p>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {notif.content}
                </p>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="my-2" />
            <Link href="/student/notifications" className="block w-full text-center text-xs font-medium text-blue-500 hover:text-blue-600 hover:underline p-1">
              View all notifications
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
