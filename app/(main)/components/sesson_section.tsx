import { Calendar, Users, Trophy, ArrowRight, Flower2, Sun, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SealSeasonsSection() {
  const seasons = [
    {
      name: 'SEAL Spring',
      icon: Flower2,
      status: 'Completed',
      statusColor: 'text-green-400',
      timeline: 'March - April 2026',
      teams: 145,
      prizePool: '₫45,000,000',
      description: 'Spring innovation challenge focusing on emerging technologies',
      gradient: 'from-pink-500 to-rose-600',
      borderGlow: 'shadow-pink-500/20',
      button: 'View Results'
    },
    {
      name: 'SEAL Summer',
      icon: Sun,
      status: 'Registration Open',
      statusColor: 'text-[#F37021]',
      timeline: 'June - July 2026',
      teams: 98,
      prizePool: '₫50,000,000',
      description: 'Summer intensive hackathon with real-world problem solving',
      gradient: 'from-[#F37021] to-[#fb923c]',
      borderGlow: 'shadow-[#F37021]/30',
      button: 'Register Now'
    },
    {
      name: 'SEAL Fall',
      icon: Leaf,
      status: 'Coming Soon',
      statusColor: 'text-amber-400',
      timeline: 'September - October 2026',
      teams: 0,
      prizePool: '₫50,000,000',
      description: 'Fall championship finale with industry partnerships',
      gradient: 'from-amber-500 to-orange-600',
      borderGlow: 'shadow-amber-500/20',
      button: 'Learn More'
    },
  ];

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
            Three major hackathons throughout the
            academic year
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {seasons.map((season, index) => {
            const Icon = season.icon;

            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-2xl ${season.borderGlow}`}
              >
                {/* Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${season.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
                />

                {/* Glow */}
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-orange-500/10 blur-[80px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${season.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="text-3xl text-white" />
                  </div>

                  {/* Name */}
                  <h3 className="mb-3 text-2xl font-bold text-foreground">
                    {season.name}
                  </h3>

                  {/* Status */}
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 backdrop-blur-xl">
                    <span
                      className={`h-2 w-2 rounded-full bg-current ${season.statusColor} ${
                        season.status ===
                        'Registration Open'
                          ? 'animate-pulse'
                          : ''
                      }`}
                    />

                    <span
                      className={`text-sm ${season.statusColor}`}
                    >
                      {season.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mb-6 text-sm leading-7 text-muted-foreground">
                    {season.description}
                  </p>

                  {/* Stats */}
                  <div className="mb-6 space-y-4">
                    {/* Timeline */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar />

                        <span>Timeline</span>
                      </div>

                      <span className="text-foreground">
                        {season.timeline}
                      </span>
                    </div>

                    {/* Teams */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users />

                        <span>Teams</span>
                      </div>

                      <span
                        className={`bg-gradient-to-r ${season.gradient} bg-clip-text font-semibold text-transparent`}
                      >
                        {season.teams > 0
                          ? season.teams
                          : 'TBA'}
                      </span>
                    </div>

                    {/* Prize */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Trophy />

                        <span>Prize Pool</span>
                      </div>

                      <span
                        className={`bg-gradient-to-r ${season.gradient} bg-clip-text font-semibold text-transparent`}
                      >
                        {season.prizePool}
                      </span>
                    </div>
                  </div>

                  {/* Button */}
                  <Button
                    variant="seasonGradient"
                    size="auto"
                    className={`w-full bg-gradient-to-r ${season.gradient} px-6 py-3 font-medium duration-300`}
                  >
                    <span>{season.button}</span>

                    <ArrowRight />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
