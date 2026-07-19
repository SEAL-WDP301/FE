"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { Loader2, Trophy, Medal, MapPin, Users, Calendar, Award, Star } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

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
              .map((team: any) => {
                const awardName = team.award?.name?.toLowerCase() || "";
                const isFirst = awardName.includes("1st") || awardName.includes("first") || awardName.includes("champion");
                const isSecond = awardName.includes("2nd") || awardName.includes("second") || awardName.includes("runner-up");
                const isThird = awardName.includes("3rd") || awardName.includes("third");
                const isFourth = awardName.includes("best") || awardName.includes("outstanding");
                
                let Icon = Award;
                let colorClass = "text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]";
                
                if (isFirst) {
                  Icon = Trophy;
                  colorClass = "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]";
                } else if (isSecond) {
                  Icon = Medal;
                  colorClass = "text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.8)]";
                } else if (isThird) {
                  Icon = Medal;
                  colorClass = "text-orange-600 drop-shadow-[0_0_10px_rgba(234,88,12,0.8)]";
                } else if (isFourth) {
                  Icon = Star;
                  colorClass = "text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]";
                }

                return (
                  <div key={team.id} className="flex flex-col items-center justify-center p-4 rounded-xl border border-yellow-500/20 bg-black/40 text-center transition-transform hover:scale-105">
                    <Icon className={`w-10 h-10 mb-3 ${colorClass}`} />
                    <span className={`text-xs font-bold uppercase mb-1 ${isFirst ? 'text-yellow-500' : isSecond ? 'text-slate-300' : isThird ? 'text-orange-500' : isFourth ? 'text-purple-400' : 'text-blue-400'}`}>
                      {team.award?.name || "Award"}
                    </span>
                    <span className="text-sm font-semibold text-[#f5f2ec] line-clamp-1" title={team.event?.name}>
                      {team.event?.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      Team {team.name}
                    </span>
                  </div>
                );
              })}
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
          <div className="grid grid-cols-1 gap-5">
            {hackerHistory.map((team: any) => {
              const awardName = team.award?.name?.toLowerCase() || "";
              const isFirst = awardName.includes("1st") || awardName.includes("first") || awardName.includes("champion");
              const isSecond = awardName.includes("2nd") || awardName.includes("second") || awardName.includes("runner-up");
              const isThird = awardName.includes("3rd") || awardName.includes("third");
              const isFourth = awardName.includes("best") || awardName.includes("outstanding");
              
              let BadgeIcon = Award;
              let badgeStyle = "border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.1)]";
              
              if (isFirst) {
                BadgeIcon = Trophy;
                badgeStyle = "border-yellow-500/30 bg-yellow-500/10 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.1)]";
              } else if (isSecond) {
                BadgeIcon = Medal;
                badgeStyle = "border-slate-300/30 bg-slate-300/10 text-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.1)]";
              } else if (isThird) {
                BadgeIcon = Medal;
                badgeStyle = "border-orange-500/30 bg-orange-500/10 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.1)]";
              } else if (isFourth) {
                BadgeIcon = Star;
                badgeStyle = "border-purple-400/30 bg-purple-400/10 text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.1)]";
              }

              return (
                <Link key={team.id} href={`/home/events/${team.event?.id}`} className="block">
                  <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-[16px] border border-[rgba(255,154,60,0.16)] bg-[#14100c] hover:border-[rgba(255,154,60,0.3)] hover:bg-[#1a1510] transition-all group">
                    {/* Event Image or Fallback */}
                    <div className="w-full sm:w-56 h-40 sm:h-auto rounded-xl overflow-hidden bg-[#1e1814] flex-shrink-0 relative">
                      {team.event?.image_url || team.event?.imageUrl ? (
                        <img src={team.event?.image_url || team.event?.imageUrl} alt={team.event?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center border border-[rgba(255,154,60,0.1)] opacity-50">
                          <Trophy className="w-8 h-8 text-orange-500 mb-2 opacity-50" />
                          <span className="text-xs font-bold text-orange-500/50 uppercase tracking-widest">{team.event?.season} {team.event?.year}</span>
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2 flex gap-2">
                          {team.event?.status === 'closed' && <span className="bg-red-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">Ended</span>}
                          {team.event?.status === 'active' && <span className="bg-blue-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">Active</span>}
                          {team.event?.status === 'ongoing' && <span className="bg-yellow-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">Ongoing</span>}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex justify-between items-start mb-2 gap-4">
                          <h4 className="font-bold text-[#f5f2ec] text-xl group-hover:text-orange-400 transition-colors line-clamp-1">{team.event?.name}</h4>
                          {team.award && (
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold shrink-0 ${badgeStyle}`}>
                              <BadgeIcon className="w-3.5 h-3.5" /> {team.award?.name || "Award"}
                            </span>
                          )}
                        </div>
                        
                        {team.event?.description && (
                           <p className="text-sm text-[#a39c8f] line-clamp-2 mb-4 leading-relaxed">
                             {team.event.description}
                           </p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                          <p className="text-sm font-semibold text-orange-500 flex items-center gap-1.5 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
                            Team: {team.name}
                          </p>
                          {team.track?.name && (
                            <p className="text-sm text-[#a39c8f] flex items-center gap-1.5 border border-white/5 bg-white/5 px-2.5 py-1 rounded-md">
                              Track: {team.track.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center text-[12px] text-[#6f685c] gap-4 pt-4 border-t border-[rgba(255,154,60,0.1)] mt-auto">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined {format(new Date(team.createdAt), "MMM yyyy")}</span>
                        {team.leaderId === userId ? (
                          <span className="flex items-center gap-1.5 text-emerald-500"><Users className="w-3.5 h-3.5" /> Team Leader</span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-blue-400"><Users className="w-3.5 h-3.5" /> Member</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Other Roles History */}
      {(judgeHistory.length > 0 || mentorHistory.length > 0) && (
        <div className="space-y-8 pt-4 border-t border-[rgba(255,154,60,0.16)]">
          {/* Judge History */}
          {judgeHistory.length > 0 && (() => {
            const judgeEventsMap = new Map();
            judgeHistory.forEach((assignment: any) => {
              const event = assignment.round?.event;
              if (!event) return;
              if (!judgeEventsMap.has(event.id)) {
                judgeEventsMap.set(event.id, { event, assignments: [] });
              }
              judgeEventsMap.get(event.id).assignments.push(assignment);
            });
            const judgeEvents = Array.from(judgeEventsMap.values());

            return (
              <div>
                <h3 className="text-lg font-bold text-[#f5f2ec] mb-4 flex items-center gap-2">
                   <Award className="w-5 h-5 text-emerald-400" /> Judging Roles
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {judgeEvents.map(({ event, assignments }: any) => (
                    <Link key={event.id} href={`/home/events/${event.id}`} className="block">
                      <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-[16px] border border-[rgba(16,185,129,0.2)] bg-[#14100c] hover:border-[rgba(16,185,129,0.4)] hover:bg-[#1a211c] transition-colors group">
                        <div className="w-full sm:w-56 h-40 sm:h-auto rounded-xl overflow-hidden flex-shrink-0 bg-[#1e1814] relative">
                          {event.image_url || event.imageUrl ? (
                            <img src={event.image_url || event.imageUrl} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center border border-white/5 opacity-50">
                              <Trophy className="w-8 h-8 text-emerald-500/50 mb-2" />
                              <span className="text-xs font-bold text-emerald-500/50 uppercase tracking-widest">{event.season} {event.year}</span>
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-2">
                            {event.status === 'closed' && <span className="bg-red-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">Ended</span>}
                            {event.status === 'active' && <span className="bg-blue-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">Active</span>}
                            {event.status === 'ongoing' && <span className="bg-yellow-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">Ongoing</span>}
                          </div>
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <h4 className="font-bold text-[#f5f2ec] text-xl group-hover:text-emerald-400 transition-colors line-clamp-1 mb-2">{event.name}</h4>
                            {event.description && (
                              <p className="text-sm text-[#a39c8f] line-clamp-2 mb-4 leading-relaxed">
                                {event.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {assignments.map((assignment: any) => (
                                <div key={assignment.id} className="text-xs border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 rounded-md text-emerald-400">
                                  <span className="font-semibold">{assignment.round?.name}</span>
                                  {assignment.track && <span className="opacity-80"> - {assignment.track.name}</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-[12px] text-[#6f685c] gap-4 pt-4 border-t border-[rgba(16,185,129,0.1)] mt-auto">
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Assigned {format(new Date(assignments[0]?.createdAt || new Date()), "MMM yyyy")}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Mentor History */}
          {mentorHistory.length > 0 && (() => {
            const mentorEventsMap = new Map();
            mentorHistory.forEach((assignment: any) => {
              const event = assignment.team?.event;
              if (!event) return;
              if (!mentorEventsMap.has(event.id)) {
                mentorEventsMap.set(event.id, { event, teams: [] });
              }
              mentorEventsMap.get(event.id).teams.push(assignment.team);
            });
            const mentorEvents = Array.from(mentorEventsMap.values());

            return (
              <div>
                <h3 className="text-lg font-bold text-[#f5f2ec] mb-4 flex items-center gap-2">
                   <MapPin className="w-5 h-5 text-blue-400" /> Mentoring Roles
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {mentorEvents.map(({ event, teams }: any) => (
                    <Link key={event.id} href={`/home/events/${event.id}`} className="block">
                      <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-[16px] border border-[rgba(59,130,246,0.2)] bg-[#14100c] hover:border-[rgba(59,130,246,0.4)] hover:bg-[#181d24] transition-colors group">
                        <div className="w-full sm:w-56 h-40 sm:h-auto rounded-xl overflow-hidden flex-shrink-0 bg-[#1e1814] relative">
                          {event.image_url || event.imageUrl ? (
                            <img src={event.image_url || event.imageUrl} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center border border-white/5 opacity-50">
                              <Trophy className="w-8 h-8 text-blue-500/50 mb-2" />
                              <span className="text-xs font-bold text-blue-500/50 uppercase tracking-widest">{event.season} {event.year}</span>
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-2">
                            {event.status === 'closed' && <span className="bg-red-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">Ended</span>}
                            {event.status === 'active' && <span className="bg-blue-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">Active</span>}
                            {event.status === 'ongoing' && <span className="bg-yellow-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">Ongoing</span>}
                          </div>
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <h4 className="font-bold text-[#f5f2ec] text-xl group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">{event.name}</h4>
                            {event.description && (
                              <p className="text-sm text-[#a39c8f] line-clamp-2 mb-4 leading-relaxed">
                                {event.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {teams.map((team: any) => (
                                <div key={team.id} className="text-xs border border-blue-500/30 bg-blue-500/10 px-2.5 py-1.5 rounded-md text-blue-400">
                                  <span className="font-semibold">{team.name}</span>
                                  {team.track?.name && <span className="opacity-80"> ({team.track.name})</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-[12px] text-[#6f685c] gap-4 pt-4 border-t border-[rgba(59,130,246,0.1)] mt-auto">
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Assigned {format(new Date(teams[0]?.createdAt || new Date()), "MMM yyyy")}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

    </div>
  );
}
