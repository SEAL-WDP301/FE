import { Medal, TrendingUp, TrendingDown, Trophy } from 'lucide-react';

export default function RankingSection() {
  const teams = [
    { rank: 1, name: 'Code Crusaders', university: 'FPT University', category: 'AI & ML', score: 98.5, trend: 'up' },
    { rank: 2, name: 'Binary Beasts', university: 'FPT University', category: 'Web Dev', score: 95.2, trend: 'up' },
    { rank: 3, name: 'Tech Titans', university: 'HCMUS', category: 'Mobile App', score: 93.8, trend: 'same' },
    { rank: 4, name: 'Quantum Coders', university: 'FPT University', category: 'AI & ML', score: 91.4, trend: 'up' },
    { rank: 5, name: 'Cyber Knights', university: 'HCMUT', category: 'Cybersecurity', score: 89.7, trend: 'down' },
    { rank: 6, name: 'DevOps Dragons', university: 'FPT University', category: 'Cloud', score: 87.3, trend: 'up' },
    { rank: 7, name: 'IoT Innovators', university: 'UIT', category: 'IoT', score: 85.9, trend: 'up' },
    { rank: 8, name: 'Cloud Ninjas', university: 'FPT University', category: 'Web Dev', score: 83.6, trend: 'same' },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-[#F37021] to-[#fb923c]';
    return 'from-[#F37021]/50 to-[#fb923c]/50';
  };

  return (
    <section className="relative overflow-hidden bg-background py-24">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/5 blur-[200px]" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-black md:text-5xl">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Live Rankings
            </span>
          </h2>

          <p className="text-lg text-muted-foreground">
            Current leaderboard standings
          </p>
        </div>

        {/* Table */}
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-card backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              {/* Header */}
              <thead className="border-b border-orange-500/20 bg-orange-500/5">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-medium text-muted-foreground">
                    Rank
                  </th>

                  <th className="px-6 py-5 text-left text-sm font-medium text-muted-foreground">
                    Team
                  </th>

                  <th className="px-6 py-5 text-left text-sm font-medium text-muted-foreground">
                    University
                  </th>

                  <th className="px-6 py-5 text-left text-sm font-medium text-muted-foreground">
                    Category
                  </th>

                  <th className="px-6 py-5 text-right text-sm font-medium text-muted-foreground">
                    Score
                  </th>

                  <th className="px-6 py-5 text-center text-sm font-medium text-muted-foreground">
                    Trend
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-orange-500/10">
                {teams.map((team) => (
                  <tr
                    key={team.rank}
                    className={`transition-colors hover:bg-orange-500/5 ${
                      team.rank <= 3
                        ? 'bg-orange-500/5'
                        : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="px-6 py-5">
                      {team.rank <= 3 ? (
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${getRankColor(
                            team.rank
                          )} shadow-lg`}
                        >
                          {team.rank === 1 ? (
                            <Trophy className="text-white" />
                          ) : (
                            <Medal className="text-white" />
                          )}
                        </div>
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-sm font-semibold text-muted-foreground">
                          {team.rank}
                        </div>
                      )}
                    </td>

                    {/* Team */}
                    <td className="px-6 py-5">
                      <div className="font-semibold text-foreground">
                        {team.name}
                      </div>
                    </td>

                    {/* University */}
                    <td className="px-6 py-5">
                      <span className="text-sm text-muted-foreground">
                        {team.university}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-5">
                      <span className="rounded-xl bg-orange-500/10 px-3 py-1 text-sm text-orange-400">
                        {team.category}
                      </span>
                    </td>

                    {/* Score */}
                    <td className="px-6 py-5 text-right">
                      <span
                        className={`bg-gradient-to-r ${getRankColor(
                          team.rank
                        )} bg-clip-text text-2xl font-black text-transparent`}
                      >
                        {team.score}
                      </span>
                    </td>

                    {/* Trend */}
                    <td className="px-6 py-5 text-center">
                      {team.trend === 'up' && (
                        <TrendingUp className="mx-auto text-green-500" />
                      )}

                      {team.trend === 'down' && (
                        <TrendingDown className="mx-auto text-red-500" />
                      )}

                      {team.trend === 'same' && (
                        <div className="mx-auto h-[2px] w-4 rounded-full bg-zinc-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-orange-500/20 bg-orange-500/5 px-6 py-4">
            <p className="text-center text-sm text-muted-foreground">
              Rankings update every 6 hours based on
              qualification round submissions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
