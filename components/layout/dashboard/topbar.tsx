import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { NotificationsMenu } from "./notifications-menu";
import Logo from "@/components/ui/logo";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { axiosClient } from "@/lib/axios";
import { getRoleAccountLinks } from "@/lib/role-navigation";

export function Topbar({
  customCenterContent,
  showDesktopLogo,
}: {
  customCenterContent?: React.ReactNode;
  showDesktopLogo?: boolean;
}) {
  const pathname = usePathname();

  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return null;
      const res = await axiosClient.get("/users/profile");
      return res.data?.data;
    },
  });

  const accountLinks = getRoleAccountLinks(user?.role, pathname);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex min-h-16 items-center gap-2 px-4 py-3 md:gap-4 lg:min-h-20 lg:px-8">
        <div
          className={`flex items-center ${!showDesktopLogo ? "lg:hidden" : "mr-4"}`}
        >
          <Logo size="sm" showText={showDesktopLogo} href={accountLinks.home} />
        </div>

        <div className="relative ml-auto flex items-center md:flex-1 md:max-w-xl">
          {customCenterContent ?? null}
        </div>

        <ThemeToggle />
        <NotificationsMenu />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-2xl border border-border bg-card px-2 py-1.5 outline-none transition-colors hover:bg-muted">
            <Avatar className="h-9 w-9 border border-orange-500/30">
              <AvatarFallback className="bg-orange-500/15 text-sm font-bold text-orange-400">
                {user ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>

            <div className="hidden text-left leading-tight md:block">
              <p className="max-w-[120px] truncate text-sm font-semibold text-foreground">
                {user ? user.name : "Loading..."}
              </p>
              <p className="text-[11px] capitalize text-muted-foreground">
                {user ? user.role : "User"}
              </p>
            </div>

            <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 border border-border bg-popover/95 backdrop-blur-xl"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href={accountLinks.home}>Dashboard</Link>
            </DropdownMenuItem>

            {accountLinks.profile ? (
              <DropdownMenuItem asChild>
                <Link href={accountLinks.profile}>Profile</Link>
              </DropdownMenuItem>
            ) : null}

            {accountLinks.settings &&
            accountLinks.settings !== accountLinks.profile ? (
              <DropdownMenuItem asChild>
                <Link href={accountLinks.settings}>Settings</Link>
              </DropdownMenuItem>
            ) : null}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500"
              onClick={() => {
                localStorage.removeItem("access_token");
                window.dispatchEvent(new Event("auth-unauthorized"));
                window.location.href = "/login";
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
