import { Bell, ChevronDown, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export function Topbar() {
    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-xl">
            <div className="flex min-h-20 items-center gap-4 px-4 py-3 lg:px-8">

                <div className="hidden min-w-0 md:block">
                    <h1 className="truncate text-xl font-semibold tracking-tight text-white">
                        Good evening, Tam 👋
                    </h1>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                        Here is your team progress for SEAL Hackathon
                    </p>
                </div>

                {/* Search */}
                <div className="relative ml-auto flex-1 max-w-xl">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder="Search team workspace..."
                        className="h-11 rounded-2xl border-white/10 bg-white/[0.03] pl-11 pr-16 text-sm focus-visible:ring-orange-500/30"
                    />

                    <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-muted-foreground md:flex">
                        ⌘K
                    </kbd>
                </div>

                {/* Notification */}
                <Button asChild variant="dashboardIcon" size="dashboardIcon" className="relative">
                    <Link href={"/student/notifications"}>
                        <Bell className="h-[18px] w-[18px]" />
                        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(243,112,33,0.8)]" />
                    </Link>
                </Button>

                {/* User */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-1.5 transition-colors hover:bg-white/[0.06] outline-none">
                        <Avatar className="h-9 w-9 border border-orange-500/30">
                            <AvatarFallback className="bg-orange-500/15 text-sm font-bold text-orange-400">
                                MK
                            </AvatarFallback>
                        </Avatar>

                        <div className="hidden text-left leading-tight md:block">
                            <p className="text-sm font-semibold text-white">
                                Tam
                            </p>

                            <p className="text-[11px] text-muted-foreground">
                                Team Leader
                            </p>
                        </div>

                        <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-56 border border-white/10 bg-[#140D09]/95 backdrop-blur-xl"
                    >
                        <DropdownMenuLabel>
                            My Account
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <Link href="/student/profile">
                                Profile
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Link href="/student/settings">
                                Team Settings
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            Preferences
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-red-400 focus:text-red-400">
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
