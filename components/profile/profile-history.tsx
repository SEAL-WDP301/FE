"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { Loader2, Trophy, Medal, MapPin, Users, Calendar, Award } from "lucide-react";
import { format } from "date-fns";

export function ProfileHistory({ userId }: { userId?: number }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profileHistory", userId],
    queryFn: async () => {
      const res = await axiosClient.get("/users/profile-history");
      return res.data?.data;
    },
    enabled: !!userId,
  });

  if (!userId) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-[22px] border border-[rgba(255,154,60,0.16)] bg-[#14100c] p-8 text-center text-[#a39c8f]">
        Could not load history.
      </div>
    );
  }

  const { hackerHistory = [], judgeHistory = [], mentorHistory = [] } = data;

  const totalAwards = hackerHistory.filter((t: any) => t.award).length;

  return (
    <div className="space-y-8">
      {/* Achievements Showcase */}
      {totalAwards > 0 && (
        <div className="rounded-[22px] border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 p-6 shadow-[0_0_30px_rgba(234,179,8,0.05)]">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-yellow-500">Trophy Showcase</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hackerHistory
              .filter((t: any) => t.award)
              .map((team: any) => (
                <div key={team.id} className="flex flex-col items-center justify-center p-4 rounded-xl border border-yellow-500/20 bg-black/40 text-center transition-transform hover:scale-105">
                  <Medal className={`w-10 h-10 mb-3 ${
                    team.award === "first_prize" ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" :
                    team.award === "second_prize" ? "text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.8)]" :
                    team.award === "third_prize" ? "text-orange-600 drop-shadow-[0_0_10px_rgba(234,88,12,0.8)]" :
                    "text-blue-400"
                  }`} />
                  <span className="text-xs font-bold uppercase text-yellow-500/80 mb-1">
                    {team.award.replace("_", " ")}
                  </span>
                  <span className="text-sm font-semibold text-[#f5f2ec] line-clamp-1" title={team.event?.name}>
                    {team.event?.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    Team {team.name}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Hacker History */}
      <div>
        <h3 className="text-lg font-bold text-[#f5f2ec] mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-400" /> Participated Hackathons
        </h3>
        {hackerHistory.length === 0 ? (
          <p className="text-sm text-[#a39c8f]">No participations yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hackerHistory.map((team: any) => (
              <div key={team.id} className="flex flex-col justify-between p-5 rounded-[16px] border border-[rgba(255,154,60,0.16)] bg-[#14100c] hover:border-[rgba(255,154,60,0.3)] transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[#f5f2ec] text-base">{team.event?.name}</h4>
                    {team.award && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold text-yellow-500">
                        <Award className="w-3 h-3" /> {team.award.replace("_", " ")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#ff9a3c] mb-1">Team: {team.name}</p>
                  <p className="text-xs text-[#a39c8f] mb-4">Track: {team.track?.name}</p>
                </div>
                <div className="flex items-center text-[11px] text-[#6f685c] gap-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(team.createdAt), "MMM yyyy")}</span>
                  {team.leaderId === userId && <span className="flex items-center gap-1 text-emerald-500"><Users className="w-3 h-3" /> Team Leader</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Other Roles History */}
      {(judgeHistory.length > 0 || mentorHistory.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[rgba(255,154,60,0.16)]">
          {/* Judge History */}
          <div>
            <h3 className="text-lg font-bold text-[#f5f2ec] mb-4 flex items-center gap-2">
               <Award className="w-5 h-5 text-emerald-400" /> Judging Roles
            </h3>
            <div className="space-y-3">
              {judgeHistory.map((assignment: any) => (
                <div key={assignment.id} className="p-4 rounded-[12px] border border-emerald-500/20 bg-[#14100c]">
                  <p className="font-semibold text-sm text-[#f5f2ec]">{assignment.round?.event?.name}</p>
                  <p className="text-xs text-emerald-400 mt-1">Round: {assignment.round?.name}</p>
                  {assignment.track && <p className="text-[10px] text-muted-foreground mt-1">Track: {assignment.track.name}</p>}
                </div>
              ))}
            </div>
          </div>
          
          {/* Mentor History */}
          <div>
            <h3 className="text-lg font-bold text-[#f5f2ec] mb-4 flex items-center gap-2">
               <MapPin className="w-5 h-5 text-blue-400" /> Mentoring Roles
            </h3>
            <div className="space-y-3">
              {mentorHistory.map((assignment: any) => (
                <div key={assignment.id} className="p-4 rounded-[12px] border border-blue-500/20 bg-[#14100c]">
                  <p className="font-semibold text-sm text-[#f5f2ec]">{assignment.team?.event?.name}</p>
                  <p className="text-xs text-blue-400 mt-1">Mentored Team: {assignment.team?.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Track: {assignment.team?.track?.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
