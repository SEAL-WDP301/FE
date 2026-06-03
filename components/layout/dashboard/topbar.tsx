import { Bell, ChevronDown, Search } from "lucide-react"; // Thêm Menu icon nếu cần trigger sidebar sau này

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import Logo from "@/components/ui/logo";

const notifications = [
    {
        id: 1,
        title: "New team invitation",
        description: "NebulaForge invited you to join the team.",
    },
    {
        id: 2,
        title: "Submission approved",
        description: "Your Round 2 submission has been approved.",
    },
];

export function Topbar() {
    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
            {/* Giảm min-h xuống 16 (h-16) trên mobile để đỡ chiếm diện tích, lên lg mới là min-h-20 */}
            <div className="flex min-h-16 lg:min-h-20 items-center gap-2 md:gap-4 px-4 py-3 lg:px-8">

                {/* Logo cho Mobile */}
                <div className="lg:hidden flex items-center">
                    <Logo size="sm" showText={false} />
                </div>

                {/* Khu vực Search: Trên Mobile chỉ hiện icon, trên Desktop hiện đầy đủ ô nhập */}
                <div className="relative ml-auto flex items-center md:flex-1 md:max-w-xl">
                    {/* Icon Search cố định trên Desktop, biến thành nút bấm trên Mobile */}
                    <Search className="h-5 w-5 md:h-4 md:w-4 text-muted-foreground md:absolute md:left-4 md:top-1/2 md:-translate-y-1/2 cursor-pointer md:cursor-default" />

                    {/* Ô Input: Ẩn trên Mobile (hidden), hiện từ màn hình md trở lên */}
                    <Input
                        placeholder="Search events..."
                        className="hidden md:block h-11 rounded-2xl border-border bg-card pl-11 pr-16 text-sm focus-visible:ring-orange-500/30 w-full"
                    />

                    {/* Phím tắt kbd: Giữ nguyên chỉ hiện từ md */}
                    <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-muted px-2 py-1 text-[10px] text-muted-foreground md:flex">
                        ⌘K
                    </kbd>
                </div>

                <ThemeToggle />

                {/* Notification */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="dashboardIcon"
                            size="dashboardIcon"
                            className="relative"
                        >
                            <Bell className="h-[18px] w-[18px]" />

                            {notifications.length > 0 && (
                                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(243,112,33,0.8)]" />
                            )}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-[360px] rounded-2xl border-border bg-card/95 p-2 backdrop-blur-xl"
                    >
                        <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold">
                            Notifications
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        {notifications.length > 0 ? (
                            notifications.map((item) => (
                                <DropdownMenuItem
                                    key={item.id}
                                    asChild
                                    className="cursor-pointer rounded-xl p-0 focus:bg-transparent"
                                >
                                    <Link
                                        href={"/student/notifications"}
                                        className="w-full rounded-xl px-3 py-3 transition-colors hover:bg-white/5"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-medium text-foreground">
                                                {item.title}
                                            </p>

                                            <p className="line-clamp-2 text-xs text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Bell className="mb-2 h-10 w-10 text-muted-foreground/40" />

                                <p className="text-sm text-muted-foreground">
                                    No announcement yet.
                                </p>
                            </div>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-3 rounded-2xl border border-border bg-card px-2 py-1.5 transition-colors hover:bg-muted outline-none">
                        <Avatar className="h-9 w-9 border border-orange-500/30">
                            <AvatarFallback className="bg-orange-500/15 text-sm font-bold text-orange-400">
                                MK
                            </AvatarFallback>
                        </Avatar>

                        <div className="hidden text-left leading-tight md:block">
                            <p className="text-sm font-semibold text-foreground">
                                Tam
                            </p>

                            <p className="text-[11px] text-muted-foreground">
                                Student
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
                            <Link href="/student/profile">
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
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </header>
    );
}