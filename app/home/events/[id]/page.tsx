"use client";

import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, Users, Trophy, ExternalLink, ArrowLeft, Clock } from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;

  // Fetch Current User
  const { data: user } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return null;
      const res = await axiosClient.get('/users/profile');
      return res.data?.data;
    },
  });

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
      const res = await axiosClient.get(`/student/events/${eventId}`);
      return res.data.data;
    },
    enabled: !!user && user.role === 'student',
  });

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
    if (user.role === 'organizer' || user.role === 'admin') {
      return (
        <Link href={`/organizer/events/${eventId}`}>
          <Button size="lg" className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700">
            Manage Event (Admin)
          </Button>
        </Link>
      );
    }

    // 3. Student
    if (user.role === 'student') {
      if (isStudentLoading) {
        return <Button disabled>Loading status...</Button>;
      }

      // Check if student is already registered
      if (studentInfo?.individualRegistration || studentInfo?.teamInfo) {
        const teamStatus = studentInfo.teamInfo?.status;
        return (
          <Button size="lg" disabled className="w-full sm:w-auto px-8 bg-green-600 opacity-100 cursor-default">
            {teamStatus === 'pending' ? 'Registration Pending' : 'Registered Successfully'}
          </Button>
        );
      }

      // Not registered, but check event status
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

        {/* Tracks Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-orange-500" />
            Competition Tracks
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
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
