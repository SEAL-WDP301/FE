"use client";

import { ChevronDown } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { NotificationsMenu } from "./notifications-menu";
import Logo from "@/components/ui/logo";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { useAuthStore } from "@/lib/stores/auth.store";

export function Topbar({ customCenterContent, showDesktopLogo }: { customCenterContent?: React.ReactNode, showDesktopLogo?: boolean }) {
    const pathname = usePathname();
    // Fetch Current User
    const { data: user } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const token = useAuthStore.getState().accessToken;
            if (!token) return null;
            const res = await axiosClient.get('/users/profile');
            return res.data?.data;
        },
    });

    // Helper function to get initials
    const getInitials = (name?: string) => {
        if (!name) return "U";
        return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
    };

    const getProfileHref = () => {
        const role = user?.role?.toLowerCase();
        if (role === "student") return "/student/profile";
        if (role === "judge") return "/judge/profile";
        if (role === "stakeholder") {
            const mentorEventMatch = pathname.match(/^\/mentor\/events\/([^/]+)/);
            return mentorEventMatch ? `/mentor/events/${mentorEventMatch[1]}/settings` : "/mentor/profile";
        }
        if (role === "admin" || role === "organizer") return "/organizer/profile";
        return "/home";
    };

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
            {/* Giảm min-h xuống 16 (h-16) trên mobile để đỡ chiếm diện tích, lên lg mới là min-h-20 */}
            <div className="flex min-h-16 lg:min-h-20 items-center gap-2 md:gap-4 px-4 py-3 lg:px-8">

                {/* Logo: Hiện trên Mobile, hoặc hiện trên Desktop nếu được yêu cầu (ví dụ khi ẩn Sidebar) */}
                <div className={`flex items-center ${!showDesktopLogo ? "lg:hidden" : "mr-4"}`}>
                    <Logo size="sm" showText={showDesktopLogo} />
                </div>

                {/* Khu vực Search hoặc Custom Content */}
                <div className="relative ml-auto flex items-center md:flex-1 md:max-w-xl">
                    {customCenterContent ? (
                        customCenterContent
                    ) : null}
                </div>

                <ThemeToggle />

                {/* Notification */}
                <NotificationsMenu />

                {/* User */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-3 rounded-2xl border border-border bg-card px-2 py-1.5 transition-colors hover:bg-muted outline-none">
                        <Avatar className="h-9 w-9 border border-orange-500/30 overflow-hidden">
                            {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="Avatar" />}
                            <AvatarFallback className="bg-orange-500/15 text-sm font-bold text-orange-400">
                                {user ? getInitials(user.name) : "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="hidden text-left leading-tight md:block">
                            <p className="text-sm font-semibold text-foreground max-w-[120px] truncate">
                                {user ? user.name : "Loading..."}
                            </p>

                            <p className="text-[11px] text-muted-foreground capitalize">
                                {user ? user.role : "User"}
                            </p>
                        </div>

                        <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-56 border border-border bg-popover/95 backdrop-blur-xl"
                    >
                        <DropdownMenuLabel>
                            My Account
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <Link href={getProfileHref()}>
                                Profile
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link href="/student/settings">
                                Team Settings
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            Preferences
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem 
                            className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                            onClick={() => {
                                useAuthStore.getState().clearAccessToken();
                                window.dispatchEvent(new Event('auth-unauthorized'));
                                window.location.href = '/login';
                            }}
                        >
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </header>
    );
}
