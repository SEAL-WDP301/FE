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
    // Giảm bớt padding dọc từ py-24 xuống py-12 trên mobile để giao diện chặt chẽ hơn
    <section className="relative overflow-hidden bg-background py-12 md:py-24">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/5 blur-[200px]" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="mb-10 md:mb-16 text-center">
          <h2 className="mb-4 text-3xl font-black md:text-5xl">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Live Rankings
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Current leaderboard standings
          </p>
        </div>

        {/* Table Container */}
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-card backdrop-blur-xl">
          <div className="overflow-x-auto">
            {/* THAY ĐỔI: Bỏ min-w-[900px] cố định, dùng w-full */}
            <table className="w-full table-auto">
              {/* Header */}
              <thead className="border-b border-orange-500/20 bg-orange-500/5">
                <tr>
                  {/* Padding nhỏ hơn trên mobile (px-3 py-4) */}
                  <th className="px-3 md:px-6 py-4 md:py-5 text-left text-xs md:text-sm font-medium text-muted-foreground w-16">
                    Rank
                  </th>

                  <th className="px-3 md:px-6 py-4 md:py-5 text-left text-xs md:text-sm font-medium text-muted-foreground">
                    Team
                  </th>

                  {/* THAY ĐỔI: Thêm hidden md:table-cell để ẩn trên mobile */}
                  <th className="hidden md:table-cell px-6 py-5 text-left text-xs md:text-sm font-medium text-muted-foreground">
                    University
                  </th>

                  {/* THAY ĐỔI: Thêm hidden lg:table-cell để ẩn trên mobile/tablet nhỏ */}
                  <th className="hidden lg:table-cell px-6 py-5 text-left text-xs md:text-sm font-medium text-muted-foreground">
                    Category
                  </th>

                  <th className="px-3 md:px-6 py-4 md:py-5 text-right text-xs md:text-sm font-medium text-muted-foreground">
                    Score
                  </th>

                  {/* THAY ĐỔI: Thêm hidden sm:table-cell */}
                  <th className="hidden sm:table-cell px-6 py-5 text-center text-xs md:text-sm font-medium text-muted-foreground">
                    Trend
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-orange-500/10">
                {teams.map((team) => (
                  <tr
                    key={team.rank}
                    className={`transition-colors hover:bg-orange-500/5 ${team.rank <= 3 ? 'bg-orange-500/5' : ''
                      }`}
                  >
                    {/* Rank column */}
                    <td className="px-3 md:px-6 py-4 md:py-5">
                      {team.rank <= 3 ? (
                        // Thu nhỏ khối huy chương/cup một chút trên mobile (h-9 w-9 thay vì h-11 w-11)
                        <div
                          className={`flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br ${getRankColor(
                            team.rank
                          )} shadow-lg`}
                        >
                          {team.rank === 1 ? (
                            <Trophy className="h-4 w-4 md:h-5 md:w-5 text-white" />
                          ) : (
                            <Medal className="h-4 w-4 md:h-5 md:w-5 text-white" />
                          )}
                        </div>
                      ) : (
                        <div className="flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl md:rounded-2xl bg-muted text-xs md:text-sm font-semibold text-muted-foreground">
                          {team.rank}
                        </div>
                      )}
                    </td>

                    {/* Team column */}
                    <td className="px-3 md:px-6 py-4 md:py-5">
                      <div className="font-semibold text-sm md:text-base text-foreground">
                        {team.name}
                      </div>
                      {/* HIỂN THỊ THÊM TRÊN MOBILE: Gom tên trường vào dưới tên Team để không bị mất thông tin */}
                      <div className="block md:hidden text-xs text-muted-foreground mt-0.5">
                        {team.university} • <span className="text-orange-400/80">{team.category}</span>
                      </div>
                    </td>

                    {/* University column (Ẩn trên mobile) */}
                    <td className="hidden md:table-cell px-6 py-5">
                      <span className="text-sm text-muted-foreground">
                        {team.university}
                      </span>
                    </td>

                    {/* Category column (Ẩn trên mobile/tablet) */}
                    <td className="hidden lg:table-cell px-6 py-5">
                      <span className="rounded-xl bg-orange-500/10 px-3 py-1 text-sm text-orange-400">
                        {team.category}
                      </span>
                    </td>

                    {/* Score column */}
                    <td className="px-3 md:px-6 py-4 md:py-5 text-right">
                      <span
                        className={`bg-gradient-to-r ${getRankColor(
                          team.rank
                        )} bg-clip-text text-xl md:text-2xl font-black text-transparent`}
                      >
                        {team.score}
                      </span>
                    </td>

                    {/* Trend column (Ẩn trên mobile) */}
                    <td className="hidden sm:table-cell px-6 py-5 text-center">
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
            <p className="text-center text-xs md:text-sm text-muted-foreground">
              Rankings update every 6 hours based on qualification round submissions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}