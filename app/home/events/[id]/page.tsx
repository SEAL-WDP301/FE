"use client";

import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';
import { enqueueSnackbar } from 'notistack';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Calendar, Users, Trophy, ExternalLink, ArrowLeft, Clock, BellRing, GraduationCap, Mail } from 'lucide-react';
import { getStudentAssignedMentor, getMentorTeams } from '@/lib/api/mentor.api';
import { useAuthStore } from '@/lib/stores/auth.store';

function getInitials(name?: string | null) {
  return (name || 'M')
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;

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

  const userRole = user?.role?.toLowerCase();

  // Fetch Public Event Details
  const { data: event, isLoading: isEventLoading } = useQuery({
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
  const { data: judgeEvents } = useQuery({
    queryKey: ['judgeEvents'],
    queryFn: async () => {
      const res = await axiosClient.get('/judge/events');
      return res.data?.data ?? [];
    },
    enabled: !!user && userRole === 'stakeholder',
  });

  const { data: mentorTeams } = useQuery({
    queryKey: ['mentorTeams'],
    queryFn: getMentorTeams,
    enabled: !!user && userRole === 'stakeholder',
  });

  const isJudgeForEvent = judgeEvents?.some((e: any) => e.id === Number(eventId));
  const isMentorForEvent = mentorTeams?.some((t: any) => t.event?.id === Number(eventId) || t.eventId === Number(eventId));

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventPendingInvitations = pendingInvitations?.filter((inv: any) => inv.team.eventId === Number(eventId)) || [];

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
                          ? ` · ${
                              assignedMentor.stakeholderProfile.organization ||
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
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {event.tracks?.map((track: any) => (
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

      </main>
    </div>
  );
}
