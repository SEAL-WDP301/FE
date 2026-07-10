"use client";

import * as Accordion from '@radix-ui/react-accordion';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';
import { enqueueSnackbar } from 'notistack';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  BellRing,
  Calendar,
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  Headphones,
  Mail,
  MapPin,
  Phone,
  Scale,
  Trophy,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { getStudentAssignedMentor, getMentorTeams } from '@/lib/api/mentor.api';
import { useAuthStore } from '@/lib/stores/auth.store';

type EventTrack = {
  id: number | string;
  name: string;
  description?: string | null;
  maxMembersPerTeam?: number | null;
};

type EventDetail = {
  id: number | string;
  name: string;
  description?: string | null;
  season?: string | null;
  year?: number | string | null;
  status?: string | null;
  registrationDeadline?: string | null;
  startDate?: string | null;
  prize1st?: string | null;
  githubOrgUrl?: string | null;
  tracks?: EventTrack[];
  ruleGroups?: ApiRuleGroup[];
  rules?: ApiRuleGroup[] | ApiRuleRecord | string[] | string | null;
  faqItems?: ApiFAQItem[];
  faq?: ApiFAQItem[] | null;
  faqs?: ApiFAQItem[] | null;
  contact?: ApiContact[] | ApiContact | string[] | string | null;
  contacts?: ApiContact[] | ApiContact | string[] | string | null;
  support?: ApiSupport | null;
  location?: ApiLocation | string | null;
  venue?: ApiLocation | string | null;
};

type UserAccount = {
  role?: string | null;
};

type PendingInvitation = {
  team?: {
    eventId?: number | string;
  };
};

type JudgeEvent = {
  id?: number | string;
};

type MentorTeam = {
  eventId?: number | string;
  event?: {
    id?: number | string;
  };
};

type RuleGroup = {
  title: string;
  icon: LucideIcon;
  items: string[];
};

type FAQItem = {
  question: string;
  answer: string;
};

type ApiRuleGroup = {
  title?: string | null;
  name?: string | null;
  category?: string | null;
  items?: string[] | null;
  rules?: string[] | null;
  content?: string | string[] | null;
  description?: string | null;
};

type ApiRuleRecord = {
  teamRules?: string[] | null;
  submissionRules?: string[] | null;
  judgingRules?: string[] | null;
  disqualificationRules?: string[] | null;
  requirements?: string[] | null;
};

type ApiFAQItem = {
  question?: string | null;
  q?: string | null;
  title?: string | null;
  answer?: string | null;
  a?: string | null;
  content?: string | null;
};

type ApiLocation = {
  type?: 'online' | 'offline' | 'hybrid' | string | null;
  name?: string | null;
  venueName?: string | null;
  room?: string | null;
  hall?: string | null;
  address?: string | null;
  mapUrl?: string | null;
  meetingPlatform?: string | null;
  platform?: string | null;
  meetingUrl?: string | null;
  note?: string | null;
};

type ApiContact = {
  label?: string | null;
  type?: string | null;
  name?: string | null;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  detail?: string | null;
  responseTime?: string | null;
};

type ApiSupport = {
  organizer?: ApiContact | null;
  technical?: ApiContact | null;
  mentorNote?: string | null;
  contacts?: ApiContact[] | null;
};

function getInitials(name?: string | null) {
  return (name || 'M')
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function toStringList(value?: string | string[] | null) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return value
    .split(/\r?\n/)
    .map((item) => item.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
}

function getRuleIcon(title: string) {
  const normalizedTitle = title.toLowerCase();
  if (normalizedTitle.includes('team')) return Users;
  if (normalizedTitle.includes('submission') || normalizedTitle.includes('requirement')) return FileText;
  if (normalizedTitle.includes('judg') || normalizedTitle.includes('score')) return Scale;
  if (normalizedTitle.includes('disqualification') || normalizedTitle.includes('violation')) return AlertTriangle;
  return FileText;
}

function normalizeRuleGroups(event: EventDetail): RuleGroup[] {
  const groupSource = event.ruleGroups ?? (Array.isArray(event.rules) && typeof event.rules[0] === 'object' ? event.rules as ApiRuleGroup[] : undefined);

  if (groupSource?.length) {
    return groupSource
      .map((group) => {
        const title = group.title || group.name || group.category || 'Rules';
        const items = [
          ...(group.items ?? []),
          ...(group.rules ?? []),
          ...toStringList(group.content),
          ...toStringList(group.description),
        ].filter(Boolean);

        return {
          title,
          icon: getRuleIcon(title),
          items,
        };
      })
      .filter((group) => group.items.length > 0);
  }

  if (Array.isArray(event.rules) || typeof event.rules === 'string') {
    const items = toStringList(event.rules as string | string[]);
    return items.length ? [{ title: 'Rules & Requirements', icon: FileText, items }] : [];
  }

  if (event.rules && typeof event.rules === 'object') {
    const ruleRecord = event.rules as ApiRuleRecord;
    return [
      { title: 'Team Rules', icon: Users, items: ruleRecord.teamRules ?? [] },
      { title: 'Submission Rules', icon: FileText, items: ruleRecord.submissionRules ?? [] },
      { title: 'Judging Rules', icon: Scale, items: ruleRecord.judgingRules ?? [] },
      { title: 'Disqualification Rules', icon: AlertTriangle, items: ruleRecord.disqualificationRules ?? [] },
      { title: 'Requirements', icon: FileText, items: ruleRecord.requirements ?? [] },
    ].filter((group) => group.items.length > 0);
  }

  return [];
}

function normalizeFaqItems(event: EventDetail): FAQItem[] {
  return (event.faqItems ?? event.faq ?? event.faqs ?? [])
    .map((faq) => ({
      question: faq.question || faq.q || faq.title || '',
      answer: faq.answer || faq.a || faq.content || '',
    }))
    .filter((faq) => faq.question && faq.answer);
}

function normalizeLocation(event: EventDetail): ApiLocation | null {
  const location = event.location ?? event.venue;
  if (!location) return null;
  if (typeof location === 'string') return { name: location };
  return location;
}

function parseContactText(value: string): ApiContact {
  const email = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  const phone = value.match(/phone\s*:\s*([+\d][\d\s().-]{6,})/i)?.[1]?.trim();
  const name = value.match(/name\s*:\s*([^¶\n\r|;]+)/i)?.[1]?.trim();
  const label = value.match(/(?:label|type)\s*:\s*([^¶\n\r|;]+)/i)?.[1]?.trim();
  const supportHours = value.match(/support\s*hours\s*:\s*([^¶\n\r|;]+)/i)?.[1]?.trim();
  const cleanedDetail = value
    .replace(/email\s*:\s*/gi, '')
    .replace(/phone\s*:\s*[+\d][\d\s().-]{6,}/gi, '')
    .replace(/support\s*hours\s*:\s*[^¶\n\r|;]+/gi, '')
    .replace(/name\s*:\s*[^¶\n\r|;]+/gi, '')
    .replace(/(?:label|type)\s*:\s*[^¶\n\r|;]+/gi, '')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '')
    .replace(/[¶|;]/g, '\n')
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .join(' · ');

  return {
    label: label || 'Event contact',
    name,
    email,
    phone,
    detail: [cleanedDetail && cleanedDetail !== email ? cleanedDetail : undefined, supportHours ? `Support hours: ${supportHours}` : undefined]
      .filter(Boolean)
      .join(' · ') || undefined,
  };
}

function normalizeContactValue(value?: ApiContact[] | ApiContact | string[] | string | null): ApiContact[] {
  if (!value) return [];
  const items = Array.isArray(value) ? value : [value];
  return items.map((item) => (typeof item === 'string' ? parseContactText(item) : item));
}

function normalizeContacts(event: EventDetail): ApiContact[] {
  const supportContacts = [
    event.support?.organizer,
    event.support?.technical,
    ...(event.support?.contacts ?? []),
  ].filter(Boolean) as ApiContact[];

  return [
    ...normalizeContactValue(event.contact),
    ...normalizeContactValue(event.contacts),
    ...supportContacts,
  ].filter(Boolean);
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function RulesSection({ groups }: { groups: RuleGroup[] }) {
  if (!groups.length) return null;

  return (
    <section className="mb-12">
      <div className="rounded-3xl border border-orange-500/20 bg-card/70 p-6 shadow-lg shadow-black/10 md:p-8">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeader
            eyebrow="Participant Guide"
            title="Rules & Requirements"
            subtitle="Key rules for teams, submissions, judging, and disqualification review."
          />
          <Badge variant="highlight" className="w-fit">
            Important
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => {
            const Icon = group.icon;

            return (
              <article
                key={group.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-orange-500/30"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{group.title}</h3>
                </div>

                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SupportLocationSection({
  location,
  contacts,
  mentorNote,
}: {
  location: ApiLocation | null;
  contacts: ApiContact[];
  mentorNote?: string | null;
}) {
  if (!location && contacts.length === 0 && !mentorNote) return null;
  const venueName = location?.venueName || location?.name;
  const room = location?.room || location?.hall;
  const platform = location?.meetingPlatform || location?.platform;
  const mapUrl = location?.mapUrl;
  const hasVenueInfo = Boolean(venueName || room || location?.address || location?.note);
  const hasOnlineInfo = Boolean(platform || location?.meetingUrl);

  return (
    <section className="mb-12">
      <div className="rounded-3xl border border-white/10 bg-card/70 p-6 shadow-lg shadow-black/10 md:p-8">
        <SectionHeader
          eyebrow="Help Desk"
          title="Event Support & Location"
          subtitle="Know where the event happens and who to contact when you need help."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {location ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Location / Venue</h3>
                  <p className="text-sm text-muted-foreground">Hybrid-ready event information</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                {hasVenueInfo ? (
                  <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                    {venueName ? <p className="font-semibold text-foreground">{venueName}</p> : null}
                    {room ? <p className="mt-1 text-muted-foreground">{room}</p> : null}
                    {location.address ? <p className="mt-1 text-muted-foreground">{location.address}</p> : null}
                    {location.note ? <p className="mt-2 text-muted-foreground">{location.note}</p> : null}
                  </div>
                ) : null}

                {hasOnlineInfo ? (
                  <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                      <Video className="h-4 w-4 text-orange-400" />
                      Online Event Access
                    </div>
                    {platform ? <p className="text-muted-foreground">{platform}</p> : null}
                    {location.meetingUrl ? (
                      <a
                        href={location.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex text-orange-400 hover:text-orange-300"
                      >
                        Open meeting link
                      </a>
                    ) : null}
                  </div>
                ) : null}

                {mapUrl ? (
                  <Button asChild variant="outline" size="sm" className="rounded-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                    <a href={mapUrl} target="_blank" rel="noreferrer">
                      View Map
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}

          {(contacts.length > 0 || mentorNote) ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Contact Support</h3>
                  <p className="text-sm text-muted-foreground">Organizer, technical, and mentor channels</p>
                </div>
              </div>

              <div className="space-y-4">
                {contacts.map((contact, index) => (
                  <ContactRow key={`${contact.email || contact.phone || contact.name || contact.title}-${index}`} contact={contact} />
                ))}

                {mentorNote ? (
                  <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm text-orange-100">
                    {mentorNote}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ContactRow({ contact }: { contact: ApiContact }) {
  const label = contact.label || contact.type || 'Contact';
  const title = contact.name || contact.title;
  const note = [contact.detail, contact.responseTime].filter(Boolean).join(' · ');

  return (
    <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
      </div>

      {title ? <p className="mb-3 text-sm font-semibold text-foreground">{title}</p> : null}

      <div className="grid gap-2 text-sm">
        {contact.email ? (
          <a
            href={`mailto:${contact.email}`}
            className="flex min-w-0 items-center gap-2 text-muted-foreground transition-colors hover:text-orange-300"
          >
            <Mail className="h-3.5 w-3.5 shrink-0 text-orange-400" />
            <span className="truncate">{contact.email}</span>
          </a>
        ) : null}

        {contact.phone ? (
          <a
            href={`tel:${contact.phone.replace(/\s/g, '')}`}
            className="flex min-w-0 items-center gap-2 text-muted-foreground transition-colors hover:text-orange-300"
          >
            <Phone className="h-3.5 w-3.5 shrink-0 text-orange-400" />
            <span>{contact.phone}</span>
          </a>
        ) : null}

        {note ? (
          <p className="flex items-start gap-2 text-muted-foreground">
            <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-400" />
            <span>{note}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function FAQSection({ items }: { items: FAQItem[] }) {
  if (!items.length) return null;

  return (
    <section className="mb-4">
      <SectionHeader
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        subtitle="Quick answers for participants before and during the competition."
      />

      <Accordion.Root type="single" collapsible className="space-y-3">
        {items.map((faq, index) => (
          <Accordion.Item
            key={faq.question}
            value={`faq-${index}`}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-card/70 transition-colors hover:border-orange-500/30"
          >
            <Accordion.Header>
              <Accordion.Trigger className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-orange-500/5">
                <span className="text-sm font-semibold text-foreground sm:text-base">
                  {faq.question}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-orange-400 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="border-t border-white/10 px-5 pb-5 pt-4">
                <p className="text-sm leading-6 text-muted-foreground">{faq.answer}</p>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;

  // Fetch Current User
  const { data: user } = useQuery<UserAccount | null>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const token = useAuthStore.getState().accessToken;
      if (!token) return null;
      const res = await axiosClient.get('/users/profile');
      return res.data?.data;
    },
  });

  const userRole = user?.role?.toLowerCase();

  // Fetch Public Event Details
  const { data: event, isLoading: isEventLoading } = useQuery<EventDetail>({
    queryKey: ['publicEvent', eventId],
    queryFn: async () => {
      const res = await axiosClient.get(`/public/events/${eventId}`);
      return res.data.data;
    },
  });

  // Fetch Student Registration Status (Only if student)
  const { data: studentInfo, isLoading: isStudentLoading } = useQuery({
    queryKey: ['studentEventStatus', eventId],
    queryFn: async () => {
      const res = await axiosClient.get(`/student/teams/status/${eventId}`);
      return res.data.data;
    },
    enabled: !!user && user.role === 'student',
  });

  // Fetch Pending Invitations to check if we need to show an alert
  const { data: pendingInvitations } = useQuery({
    queryKey: ['pendingInvitations'],
    queryFn: async () => {
      const res = await axiosClient.get('/student/teams/invitations/pending');
      return res.data.data;
    },
    enabled: !!user && userRole === 'student',
  });

  const teamStatus = studentInfo?.teamInfo?.team?.status;
  const hasApprovedTeam =
    !!studentInfo?.teamInfo?.team &&
    teamStatus === 'approved';

  const { data: assignedMentor, isLoading: isMentorLoading } = useQuery({
    queryKey: ['studentAssignedMentor', eventId],
    queryFn: () => getStudentAssignedMentor(eventId),
    enabled: !!user && userRole === 'student' && hasApprovedTeam,
    retry: false,
  });

  // Fetch Stakeholder Data
  const { data: judgeEvents } = useQuery<JudgeEvent[]>({
    queryKey: ['judgeEvents'],
    queryFn: async () => {
      const res = await axiosClient.get('/judge/events');
      return res.data?.data ?? [];
    },
    enabled: !!user && userRole === 'stakeholder',
  });

  const { data: mentorTeams } = useQuery<MentorTeam[]>({
    queryKey: ['mentorTeams', eventId],
    queryFn: () => getMentorTeams(eventId),
    enabled: !!user && userRole === 'stakeholder',
  });

  const isJudgeForEvent = judgeEvents?.some((e) => Number(e.id) === Number(eventId));
  const isMentorForEvent = mentorTeams?.some((t) => Number(t.event?.id) === Number(eventId) || Number(t.eventId) === Number(eventId));

  const notificationShown = useRef(false);

  useEffect(() => {
    if (userRole === 'stakeholder' && !notificationShown.current) {
      if (isJudgeForEvent && isMentorForEvent) {
        enqueueSnackbar('Bạn đã được chỉ định làm Mentor và Judge cho sự kiện này!', { variant: 'info', preventDuplicate: true });
        notificationShown.current = true;
      } else if (isJudgeForEvent) {
        enqueueSnackbar('Bạn đã được chỉ định làm Judge cho sự kiện này!', { variant: 'info', preventDuplicate: true });
        notificationShown.current = true;
      } else if (isMentorForEvent) {
        enqueueSnackbar('Bạn đã được chỉ định làm Mentor cho sự kiện này!', { variant: 'info', preventDuplicate: true });
        notificationShown.current = true;
      }
    }
  }, [userRole, isJudgeForEvent, isMentorForEvent]);

  const eventPendingInvitations =
    (pendingInvitations as PendingInvitation[] | undefined)?.filter(
      (inv) => Number(inv.team?.eventId) === Number(eventId)
    ) || [];

  if (isEventLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex justify-center items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex justify-center items-center">
          <p className="text-xl text-muted-foreground">Event not found.</p>
        </div>
      </div>
    );
  }

  const eventRuleGroups = normalizeRuleGroups(event);
  const eventFaqItems = normalizeFaqItems(event);
  const eventLocation = normalizeLocation(event);
  const eventContacts = normalizeContacts(event);
  const mentorSupportNote = event.support?.mentorNote;

  // Render Action Button based on Role
  const renderActionButton = () => {
    // 1. Unauthenticated
    if (!user) {
      return (
        <Link href="/login">
          <Button size="lg" className="w-full sm:w-auto px-8 bg-orange-500 hover:bg-orange-600">
            Login to Register
          </Button>
        </Link>
      );
    }

    // 2. Organizer or Admin
    if (userRole === 'organizer' || userRole === 'admin') {
      return (
        <Link href={`/organizer/events/${eventId}`}>
          <Button size="lg" className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700">
            Manage Event (Admin)
          </Button>
        </Link>
      );
    }

    // 3. Student
    if (userRole === 'student') {
      if (isStudentLoading) {
        return <Button disabled>Loading status...</Button>;
      }

      // Check if student is already registered
      if (studentInfo?.individualRegistration || studentInfo?.teamInfo) {
        const teamInfo = studentInfo.teamInfo;
        const memberStatus = teamInfo?.status;
        const teamStatus = teamInfo?.team?.status || "registered";
        const displayStatus = memberStatus === 'pending' ? 'Invitation Pending' : teamStatus;

        return (
          <div className="bg-card/40 backdrop-blur-md border border-border/50 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full sm:w-auto shadow-lg shadow-black/5">
            <div>
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-500" />
                {teamInfo ? `Team: ${teamInfo.team.name}` : 'Individual Registration'}
              </p>
              <div className="text-xs text-muted-foreground uppercase mt-2 font-medium flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  {displayStatus === 'pending' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${displayStatus === 'pending' || displayStatus === 'Invitation Pending' ? 'bg-yellow-500' : displayStatus === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </span>
                Status: <span className="text-foreground">{displayStatus}</span>
              </div>
            </div>

            {displayStatus === 'pending' && teamInfo?.role === 'leader' && (
              <Link href={`/home/events/${eventId}/register`}>
                <Button variant="outline" size="sm" className="border-orange-500/30 text-orange-500 hover:bg-orange-500/10 hover:text-orange-600 transition-colors">
                  Edit Registration
                </Button>
              </Link>
            )}
            {displayStatus === 'approved' && (
              <Link href={`/student/events/${eventId}/workspace`}>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white transition-colors">
                  Enter Workspace
                </Button>
              </Link>
            )}
            {(displayStatus === 'rejected' || displayStatus === 'disqualified') && (
              <Link href={`/home/events/${eventId}/register`}>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white transition-colors">
                  Register Again
                </Button>
              </Link>
            )}
          </div>
        );
      }

      // Not registered, check event status
      if (event.status !== 'active') {
        return (
          <Button size="lg" disabled className="w-full sm:w-auto px-8">
            Registration Closed
          </Button>
        );
      }

      return (
        <Link href={`/home/events/${eventId}/register`}>
          <Button size="lg" className="w-full sm:w-auto px-8 bg-orange-500 hover:bg-orange-600">
            Register Now
          </Button>
        </Link>
      );
    }

    // 4. Stakeholder (Judge/Mentor)
    if (userRole === 'stakeholder') {
      if (isJudgeForEvent || isMentorForEvent) {
        return (
          <div className="flex gap-4">
            {isJudgeForEvent && (
              <Link href={`/judge/events/${eventId}/dashboard`}>
                <Button size="lg" className="w-full sm:w-auto px-8 bg-purple-600 hover:bg-purple-700 text-white">
                  Enter Judge Workspace
                </Button>
              </Link>
            )}
            {isMentorForEvent && (
              <Link href={`/mentor/events/${eventId}/teams`}>
                <Button size="lg" className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white">
                  Enter Mentor Workspace
                </Button>
              </Link>
            )}
          </div>
        );
      }
      return (
        <Button size="lg" disabled className="w-full sm:w-auto px-8">
          Not Assigned to Event
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <Link href="/home" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-card border border-border p-8 md:p-12 mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-orange-500/10 blur-[100px]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 mb-6 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              {event.season} {event.year}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
              {event.name}
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-3 border border-border">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Registration Deadline</div>
                  <div className="font-semibold text-foreground">
                    {event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleDateString() : 'TBA'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-3 border border-border">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Start Date</div>
                  <div className="font-semibold text-foreground">
                    {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBA'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-3 border border-border">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Grand Prize</div>
                  <div className="font-semibold text-foreground">{event.prize1st || 'TBA'}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {renderActionButton()}

              {event.githubOrgUrl && (
                <a href={event.githubOrgUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="px-6">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    GitHub Repo
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Pending Invitations Alert */}
        {eventPendingInvitations.length > 0 && (
          <div className="mb-12 bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 flex items-center justify-between text-orange-600 dark:text-orange-400">
            <div className="flex items-center gap-3">
              <BellRing className="h-5 w-5 animate-pulse" />
              <span className="font-medium">
                You have {eventPendingInvitations.length} pending team invitation(s) for this event.
                Please check your notifications bell on the header to accept or reject them.
              </span>
            </div>
          </div>
        )}

        {user?.role === 'student' && hasApprovedTeam && (
          <div className="mb-12">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
              <div className="mb-5 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-foreground">Your Mentor</h2>
              </div>

              {isMentorLoading ? (
                <div className="h-20 animate-pulse rounded-2xl bg-muted" />
              ) : assignedMentor ? (
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border border-orange-500/30">
                      {assignedMentor.avatarUrl || assignedMentor.avatar_url ? (
                        <AvatarImage
                          src={assignedMentor.avatarUrl || assignedMentor.avatar_url || undefined}
                          alt={assignedMentor.name || 'Assigned mentor'}
                        />
                      ) : null}
                      <AvatarFallback className="text-lg">
                        {getInitials(assignedMentor.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {assignedMentor.name || 'Assigned Mentor'}
                      </p>
                      <p className="mt-1 text-sm text-orange-500">
                        {assignedMentor.stakeholderProfile?.jobTitle || 'Event Mentor'}
                        {assignedMentor.stakeholderProfile?.organization ||
                          assignedMentor.stakeholderProfile?.organizationName
                          ? ` · ${assignedMentor.stakeholderProfile.organization ||
                          assignedMentor.stakeholderProfile.organizationName
                          }`
                          : ''}
                      </p>
                      {assignedMentor.email ? (
                        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {assignedMentor.email}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <Button asChild variant="outline">
                    <Link href={`/student/events/${eventId}/workspace/mentor`}>
                      Open Mentor Workspace
                    </Link>
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No mentor has been assigned to your team yet.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tracks Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-orange-500" />
            Competition Tracks
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {event.tracks?.map((track) => (
              <div key={track.id} className="bg-card border border-border rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
                <h3 className="text-xl font-bold text-foreground mb-3">{track.name}</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {track.description}
                </p>
                <div className="flex justify-between items-center text-sm font-medium bg-muted/50 p-3 rounded-lg border border-border/50">
                  <span className="text-muted-foreground">Team Size:</span>
                  <span className="text-foreground">Max {track.maxMembersPerTeam || 'TBA'} members</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <RulesSection groups={eventRuleGroups} />
        <SupportLocationSection
          location={eventLocation}
          contacts={eventContacts}
          mentorNote={mentorSupportNote}
        />
        <FAQSection items={eventFaqItems} />

      </main>
    </div>
  );
}
