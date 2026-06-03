"use client";

import { Calendar, Users, Trophy, ArrowRight, Flower2, Sun, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios';
import Link from 'next/link';

export default function SealSeasonsSection() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['publicEvents'],
    queryFn: async () => {
      const res = await axiosClient.get('/public/events');
      return res.data.data;
    },
  });

  const getSeasonStyles = (season: string) => {
    switch (season) {
      case 'Spring':
        return {
          icon: Flower2,
          gradient: 'from-pink-500 to-rose-600',
          borderGlow: 'shadow-pink-500/20',
        };
      case 'Summer':
        return {
          icon: Sun,
          gradient: 'from-[#F37021] to-[#fb923c]',
          borderGlow: 'shadow-[#F37021]/30',
        };
      case 'Fall':
        return {
          icon: Leaf,
          gradient: 'from-amber-500 to-orange-600',
          borderGlow: 'shadow-amber-500/20',
        };
      default:
        return {
          icon: Trophy,
          gradient: 'from-blue-500 to-cyan-600',
          borderGlow: 'shadow-blue-500/20',
        };
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Registration Open', color: 'text-[#F37021]', isPulse: true, btnText: 'Register Now' };
      case 'ongoing':
        return { label: 'Ongoing', color: 'text-amber-400', isPulse: false, btnText: 'View Details' };
      case 'closed':
        return { label: 'Completed', color: 'text-green-400', isPulse: false, btnText: 'View Results' };
      default:
        return { label: 'Coming Soon', color: 'text-muted-foreground', isPulse: false, btnText: 'Learn More' };
    }
  };

  return (
    <section className="relative overflow-hidden bg-background py-24">
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[140px]" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-black md:text-5xl">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              SEAL Seasons
            </span>
          </h2>

          <p className="text-lg text-muted-foreground">
            Explore our hackathons throughout the academic year
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Cards */}
        {!isLoading && events && (
          <div className="grid gap-8 md:grid-cols-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {events.map((event: any) => {
              const styles = getSeasonStyles(event.season);
              const Icon = styles.icon;
              const statusDisplay = getStatusDisplay(event.status);

              return (
                <div
                  key={event.id}
                  className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-2xl ${styles.borderGlow}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`} />
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-orange-500/10 blur-[80px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10">
                    <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${styles.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="text-3xl text-foreground" />
                    </div>

                    <h3 className="mb-3 text-2xl font-bold text-foreground">
                      {event.name}
                    </h3>

                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 backdrop-blur-xl">
                      <span className={`h-2 w-2 rounded-full bg-current ${statusDisplay.color} ${statusDisplay.isPulse ? 'animate-pulse' : ''}`} />
                      <span className={`text-sm ${statusDisplay.color}`}>
                        {statusDisplay.label}
                      </span>
                    </div>

                    <p className="mb-6 text-sm leading-7 text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>

                    <div className="mb-6 space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar />
                          <span>Timeline</span>
                        </div>
                        <span className="text-foreground">
                          {event.startDate ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'TBA'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users />
                          <span>Tracks</span>
                        </div>
                        <span className={`bg-gradient-to-r ${styles.gradient} bg-clip-text font-semibold text-transparent`}>
                          {event.tracks?.length || 0}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Trophy />
                          <span>Prize Pool</span>
                        </div>
                        <span className={`bg-gradient-to-r ${styles.gradient} bg-clip-text font-semibold text-transparent`}>
                          {event.prize1st || 'TBA'}
                        </span>
                      </div>
                    </div>

                    <Link href={`/home/events/${event.id}`}>
                      <Button
                        variant="seasonGradient"
                        size="auto"
                        className={`w-full bg-gradient-to-r ${styles.gradient} px-6 py-3 font-medium duration-300`}
                      >
                        <span>{statusDisplay.btnText}</span>
                        <ArrowRight />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
