"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { enqueueSnackbar } from "notistack";
import {
  Award,
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  GitMerge,
  GraduationCap,
  Layers3,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UploadCloud,
  User,
  Users,
  X,
} from "lucide-react";

import { axiosClient } from "@/lib/axios";
import { getOrganizerEvent } from "@/lib/api/organizer-events.api";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/dashboard/theme-toggle";

const workspaceItems = [
  { name: "Teams", segment: "teams", icon: Users },
  { name: "Mentors & Judges", segment: "stakeholders", icon: GraduationCap },
  { name: "Submissions", segment: "submissions", icon: FileText },
  { name: "Grading Criteria", segment: "criteria", icon: Award },
];

export default function EventDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const eventId = params.id as string;
  const currentRoundId = params.roundId as string | undefined;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedRoundIds, setExpandedRoundIds] = useState<string[]>(
    currentRoundId ? [currentRoundId] : []
  );

  const { data: event } = useQuery({
    queryKey: ["organizerEvent", eventId],
    queryFn: () => getOrganizerEvent(eventId),
  });

  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await axiosClient.get("/users/profile");
      const profile = res.data?.data;
      return profile
        ? { ...profile, avatarUrl: profile.avatarUrl ?? profile.avatar_url }
        : null;
    },
  });

  const rounds = [...(event?.rounds || [])].sort(
    (a, b) => a.roundNumber - b.roundNumber
  );
  const baseUrl = `/organizer/events/${eventId}`;
  const avatarUrl =
    typeof user?.avatarUrl === "string" ? user.avatarUrl.trim() : "";

  const logout = () => {
    localStorage.removeItem("access_token");
    queryClient.setQueryData(["userProfile"], null);
    enqueueSnackbar("Đăng xuất thành công!", { variant: "info" });
    router.push("/");
  };

  const closeMobile = () => setMobileOpen(false);
  const toggleRound = (roundId: string) => {
    setExpandedRoundIds((current) =>
      current.includes(roundId)
        ? current.filter((id) => id !== roundId)
        : [...current, roundId]
    );
  };

  const sidebar = (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 92 : 320 }}
      className="relative flex h-full shrink-0 flex-col overflow-hidden rounded-[28px] border border-border bg-sidebar/90 text-sidebar-foreground shadow-[0_24px_70px_rgba(75,45,20,.12),0_0_50px_rgba(243,112,33,.07)] backdrop-blur-2xl dark:shadow-[0_24px_80px_rgba(0,0,0,.45),0_0_60px_rgba(243,112,33,.08)]"
    >
      <div className={cn("flex items-center p-6", collapsed && "justify-center px-4")}>
        <Logo href="/organizer/events" collapsed={collapsed} />
      </div>

      {!collapsed && user && (
        <div className="mx-4 mb-4 flex items-center gap-3 rounded-2xl border border-border bg-background/45 p-3.5">
          <Avatar className="size-10 border border-orange-500/20">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={user.name} />}
            <AvatarFallback className="bg-orange-500/15 text-orange-400">
              {user.name?.charAt(0).toUpperCase() || "O"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {user.name || "Organizer"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      )}

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-4 pb-4">
        <NavLink
          href="/organizer/events"
          label="Dashboard"
          icon={LayoutDashboard}
          active={pathname === "/organizer/events"}
          collapsed={collapsed}
          onClick={closeMobile}
        />

        {!collapsed && (
          <p className="px-3 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
            Events
          </p>
        )}

        <div className="rounded-2xl border border-border bg-background/35 p-2">
          <div className={cn("flex items-center gap-3 px-2 py-2", collapsed && "justify-center px-0")}>
            <div className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-xl bg-orange-500/15 text-xs font-bold text-orange-400">
              {event?.icons?.[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={event.icons[0].url} alt="" className="size-full object-cover" />
              ) : (
                event?.name?.charAt(0).toUpperCase() || "E"
              )}
            </div>
            {!collapsed && (
              <p className="truncate text-sm font-semibold text-foreground">
                {event?.name || "Loading event..."}
              </p>
            )}
          </div>

          <NavLink
            href={`${baseUrl}/overview`}
            label="Overview"
            icon={LayoutDashboard}
            active={pathname.startsWith(`${baseUrl}/overview`)}
            collapsed={collapsed}
            compact
            onClick={closeMobile}
          />
          <NavLink
            href={`${baseUrl}/tracks`}
            label="Tracks & Rounds"
            icon={GitMerge}
            active={pathname.startsWith(`${baseUrl}/tracks`)}
            collapsed={collapsed}
            compact
            onClick={closeMobile}
          />

          {rounds.map((round) => (
            <div key={round.id} className="mt-2">
              <button
                type="button"
                onClick={() => toggleRound(String(round.id))}
                className={cn(
                  "flex w-full items-center rounded-xl text-left transition-colors hover:bg-muted",
                  collapsed
                    ? "justify-center px-2 py-2.5"
                    : "gap-2 px-3 py-2.5",
                  currentRoundId === String(round.id) &&
                  "bg-orange-500/[0.07]"
                )}
                title={collapsed ? round.name : undefined}
                aria-expanded={expandedRoundIds.includes(String(round.id))}
              >
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    currentRoundId === String(round.id)
                      ? "bg-orange-500 shadow-[0_0_10px_rgba(243,112,33,.7)]"
                      : "bg-muted-foreground/40"
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {round.name}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-3.5 text-muted-foreground transition-transform duration-200",
                        expandedRoundIds.includes(String(round.id)) &&
                        "rotate-180"
                      )}
                    />
                  </>
                )}
              </button>

              <AnimatePresence initial={false}>
                {expandedRoundIds.includes(String(round.id)) && !collapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mx-3 mb-2 space-y-2 rounded-xl border border-border bg-background/45 p-3">
                      <RoundInfo
                        icon={Layers3}
                        label="Status"
                        value={formatRoundStatus(round.status)}
                        accent={round.status === "open"}
                      />
                      <RoundInfo
                        icon={CalendarClock}
                        label="Deadline"
                        value={formatRoundDeadline(round.submissionDeadline)}
                      />
                      <RoundInfo
                        icon={UploadCloud}
                        label="Submission"
                        value={formatSubmissionType(round.submissionType)}
                      />
                      {round.track?.name && (
                        <RoundInfo
                          icon={GitMerge}
                          label="Track"
                          value={round.track.name}
                        />
                      )}
                    </div>

                    {workspaceItems.map((item) => (
                      <NavLink
                        key={item.segment}
                        href={`${baseUrl}/rounds/${round.id}/${item.segment}`}
                        label={item.name}
                        icon={item.icon}
                        active={pathname.startsWith(
                          `${baseUrl}/rounds/${round.id}/${item.segment}`
                        )}
                        collapsed={collapsed}
                        compact
                        nested
                        onClick={closeMobile}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </nav>

      <div className="space-y-1 border-t border-border p-4">
        <NavLink
          href="/home"
          label="Profile Settings"
          icon={Settings}
          active={false}
          collapsed={collapsed}
          onClick={closeMobile}
        />
        <div className={cn("flex items-center rounded-xl px-3 py-2", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && <span className="text-sm text-muted-foreground">Theme</span>}
          <div className={cn(collapsed && "scale-75")}>
            <ThemeToggle />
          </div>
        </div>
        <button
          onClick={logout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && "Logout"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        className="absolute -right-0 top-7 hidden size-6 items-center justify-center rounded-l-xl border-y border-l border-border bg-card text-muted-foreground transition-colors hover:text-orange-500 lg:flex"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </button>
    </motion.aside>
  );

  return (
    <div className="relative min-h-full overflow-hidden bg-background text-foreground transition-colors duration-300">
      <div className="pointer-events-none absolute -left-32 top-20 size-[420px] rounded-full bg-orange-500/[0.07] blur-[130px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 size-[300px] rounded-full bg-orange-500/[0.035] blur-[120px]" />
      {Array.from({ length: 9 }).map((_, index) => (
        <span
          key={index}
          className="pointer-events-none absolute size-1 rounded-full bg-orange-400/30"
          style={{
            left: `${12 + ((index * 17) % 82)}%`,
            top: `${8 + ((index * 29) % 84)}%`,
          }}
        />
      ))}

      <div className="relative flex min-h-screen gap-5 p-3 sm:p-5">
        <div className="sticky top-5 hidden h-[calc(100vh-2.5rem)] lg:block">
          {sidebar}
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm dark:bg-black/75 lg:hidden"
                onClick={closeMobile}
                aria-label="Close navigation"
              />
              <motion.div
                initial={{ x: -340 }}
                animate={{ x: 0 }}
                exit={{ x: -340 }}
                className="fixed inset-y-3 left-3 z-50 h-[calc(100vh-1.5rem)] lg:hidden"
              >
                {sidebar}
                <button
                  onClick={closeMobile}
                  className="absolute right-4 top-4 grid size-9 place-items-center rounded-xl bg-muted text-muted-foreground"
                  aria-label="Close navigation"
                >
                  <X className="size-4" />
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid size-11 place-items-center rounded-2xl border border-border bg-card/80"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <User className="size-4 text-orange-400" />
              Organizer
            </div>
          </div>
          <div className="mx-auto max-w-[1500px] px-1 py-3 sm:px-3 sm:py-5 lg:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function RoundInfo({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start gap-2 text-[11px]">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span
        className={cn(
          "ml-auto max-w-[130px] truncate text-right font-medium text-foreground/80",
          accent && "text-green-500"
        )}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

function formatRoundStatus(status?: string) {
  if (!status) return "Not started";

  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatRoundDeadline(deadline?: string) {
  if (!deadline) return "Not configured";

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatSubmissionType(type?: string) {
  if (!type) return "Not configured";
  return type === "github_link" ? "GitHub link" : "File upload";
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
  compact = false,
  nested = false,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  collapsed: boolean;
  compact?: boolean;
  nested?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl text-sm transition-all duration-200",
        compact ? "px-3 py-2.5" : "px-3 py-3",
        nested && "ml-3",
        collapsed && "justify-center px-2",
        active
          ? "bg-orange-500/12 text-orange-400 shadow-[inset_0_0_0_1px_rgba(243,112,33,.18),0_0_24px_rgba(243,112,33,.08)]"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
      {active && <span className="absolute right-2 size-1 rounded-full bg-orange-400" />}
    </Link>
  );
}
