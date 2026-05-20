"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

export default function EventPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "prizes" | "criteria" | "submit">("overview");

  return (
    <div className="relative min-h-screen text-slate-100 bg-[#0A0E1A] py-12 font-sans selection:bg-orange-500/40 selection:text-white">
      
      {/* Banner / Header */}
      <section className="relative overflow-hidden border-b border-white/10 rounded-3xl max-w-7xl mx-auto bg-white/[0.02] mb-12 shadow-2xl">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[36rem] w-[70rem] bg-orange-500/20 blur-[150px] animate-pulse" />
        
        <div className="relative mx-auto max-w-7xl px-10 pt-16 pb-20">
          <Link href="/" className="text-base text-slate-300 hover:text-orange-400 transition-colors flex items-center gap-2 font-semibold">
            ← Back to home
          </Link>
          
          <div className="mt-10 flex flex-wrap gap-4 items-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-orange-500/40 bg-orange-500/10 px-5 py-2 text-base shadow-inner">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-orange-400 font-bold tracking-wide">S.01 · SEAL Spring 2026</span>
            </div>
            <span className="px-4 py-1.5 rounded-full text-sm font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 tracking-widest uppercase">
              7 days to deadline
            </span>
          </div>

          <h1 className="mt-8 text-5xl md:text-7xl font-black max-w-6xl tracking-tight leading-[1.15] text-white">
            Reddit Mod Tools and <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 bg-clip-text text-transparent">Migrated Apps Hackathon</span>
          </h1>
          
          <p className="mt-8 max-w-5xl text-slate-200 text-lg md:text-xl leading-relaxed font-medium">
            Join Reddit to build moderation tools for the Reddit community! Create a utility, automation, or moderation tool that solves existing community pain points using Devvit i.e. Reddit's Developer Platform.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="mx-auto max-w-7xl px-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        
        {/* Left Column: Navigation Tabs & Detailed Info */}
        <main className="space-y-10">
          
          {/* Navigation Tabs - Đã fix độ tương phản chữ trắng rõ ràng hơn khi active/hover */}
          <div className="flex border-b-2 border-white/10 overflow-x-auto scrollbar-none sticky top-0 bg-[#0A0E1A] z-10 py-4 gap-4">
            {[
              { id: "overview", label: "Overview" },
              { id: "prizes", label: "Prizes" },
              { id: "criteria", label: "Judging Criteria" },
              { id: "submit", label: "How to Submit" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-lg font-black rounded-xl transition-all duration-200 whitespace-nowrap border-2 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-lg shadow-orange-500/20 scale-[1.02]"
                    : "text-slate-400 border-transparent hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-10 animate-fadeIn">
              
              {/* About / Description */}
              <section className="backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-xl">
                <h2 className="text-3xl font-black text-white mb-5 flex items-center gap-3">
                  <span className="h-6 w-1.5 bg-orange-500 rounded-full" /> About This Hackathon
                </h2>
                <p className="text-slate-100 text-lg leading-relaxed font-normal">
                  SEAL Spring 2026 brings together 250+ student teams to design, build and demo production-grade software in a single weekend. Teams compete across eight tracks, mentored by FPTU faculty and engineering leaders from Vingroup, Tiki, VinAI, Grab and TechHub Vietnam.
                </p>
                <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-base">
                  <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                    <span className="text-slate-400 font-bold block mb-1 uppercase tracking-wider text-xs">Who can participate</span>
                    <span className="text-slate-200 font-bold text-lg leading-snug">Above legal age & all countries (excluding standard exceptions)</span>
                  </div>
                  <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                    <span className="text-slate-400 font-bold block mb-1 uppercase tracking-wider text-xs">Platform Requirement</span>
                    <span className="text-slate-200 font-bold text-lg leading-snug">Must be built on Reddit's Developer Platform (Devvit)</span>
                  </div>
                </div>
              </section>

              {/* What to Build Section */}
              <section className="backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-black text-white mb-4">What to Build</h3>
                <p className="text-slate-100 text-lg leading-relaxed mb-6">
                  Build a moderation app with Devvit. We are looking for tools that range from automated enforcement, to better queue management, to creative community-building utilities. The best apps reduce moderation load significantly, improve community operation, or serve to incentivize good behavior in the community through innovative utilities.
                </p>
                <div className="bg-[#131926] border border-orange-500/20 rounded-2xl p-6 text-base text-slate-200 space-y-4 leading-relaxed shadow-inner">
                  <p className="flex gap-3"><span className="text-xl shrink-0">💡</span> <span className="font-medium">These apps can have a custom post component, or can operate entirely in the background.</span></p>
                  <p className="flex gap-3"><span className="text-xl shrink-0">💡</span> <span className="font-medium">We want to see evidence that the tool can save significant time or make a measurable impact. Importantly, the tool should also be easy to understand, install, and provide a great user experience for mods installing the tool.</span></p>
                </div>
              </section>

              {/* Timeline */}
              <section className="backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-black text-white mb-6">Timeline & Schedule</h2>
                <div className="space-y-4">
                  {[
                    ["Mar 01 → Mar 30", "Registration Window", "Form your team and submit your initial application details."],
                    ["Apr 01", "Opening Ceremony & Matchmaking", "Keynote session plus live mentor matchmaking."],
                    ["Apr 02 → Apr 04", "48-Hour Hackathon", "Build, break, ship — non-stop building phase."],
                    ["Apr 08", "Semifinals", "Top 24 teams pitch their projects live to track judges."],
                    ["Apr 12", "Demo Day & Awards Grand Finale", "Grand finale presentations live at FPTU Auditorium."],
                  ].map(([date, title, desc], i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-5 p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-orange-500/30 hover:bg-white/[0.03] transition-all">
                      <div className="font-mono text-base text-orange-400 sm:w-48 shrink-0 font-extrabold tracking-wide pt-0.5">{date}</div>
                      <div>
                        <div className="font-black text-white text-lg">{title}</div>
                        <div className="text-base text-slate-300 mt-1.5 leading-relaxed font-normal">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Judges & Mentors */}
              <section className="backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <span className="h-6 w-1.5 bg-orange-500 rounded-full" /> Judges & Mentors
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    ["NHA", "Dr. Nguyen H. Anh", "Head of Software Engineering · FPTU"],
                    ["LTM", "Le T. Minh", "Principal AI Engineer · Vingroup"],
                    ["PVT", "Pham V. Tuan", "Technical Founder · TechHub Vietnam"],
                    ["TQH", "Tran Q. Huong", "VP of Engineering · Tiki"],
                    ["DKL", "Do K. Long", "Staff Engineer · Grab Vietnam"],
                    ["BTM", "Bui T. My", "Senior AI Researcher · VinAI"],
                  ].map(([initials, name, role]) => (
                    <div key={name} className="backdrop-blur-md bg-white/[0.02] border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-orange-500/40 hover:bg-white/[0.04] transition-all shadow-md">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white grid place-items-center font-black text-lg shadow-lg shadow-orange-500/20 shrink-0">
                        {initials}
                      </div>
                      <div>
                        <div className="font-black text-lg text-white leading-snug">{name}</div>
                        <div className="text-base text-slate-300 mt-1 leading-normal font-medium">{role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Categories */}
              <section className="backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-black text-white mb-5">Available Tracks & Categories</h3>
                <div className="flex flex-wrap gap-3">
                  {["AI · ML", "Web · SaaS", "FinTech", "GreenTech", "Mobile Apps", "Game · XR", "DevTools", "Open Category"].map((c) => (
                    <span key={c} className="px-5 py-2.5 rounded-xl text-base font-bold border border-white/15 bg-white/[0.04] text-slate-200 shadow-sm">
                      {c}
                    </span>
                  ))}
                </div>
              </section>

              {/* Rules */}
              <section className="backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-black text-white mb-5">Rules</h2>
                <ul className="space-y-4 text-lg text-slate-100">
                  {[
                    "Teams of 3–5 students. At least one FPTU student required per team.",
                    "All core application code must be written during the 48-hour hack window.",
                    "Use of open-source libraries and AI tooling is encouraged, but plagiarism is forbidden.",
                    "Submissions must include public source code repository link, demo video, and live pitch deck.",
                  ].map((rule, i) => (
                    <li key={i} className="flex gap-3.5 items-start">
                      <span className="text-orange-500 font-black text-2xl leading-none mt-0.5">›</span>
                      <span className="leading-relaxed font-medium">{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {/* TAB 2: PRIZES */}
          {activeTab === "prizes" && (
            <div className="space-y-8 animate-fadeIn">
              <section className="relative backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-2xl p-8 overflow-hidden shadow-2xl">
                <div className="absolute -inset-x-20 -top-20 h-44 bg-orange-500/10 blur-[100px] opacity-60" />
                <div className="relative">
                  <span className="text-xs uppercase tracking-widest text-orange-400 font-black">Total Prize Pool</span>
                  <div className="mt-3 text-5xl md:text-6xl font-black text-white tracking-tight">
                    140.000.000 VNĐ <span className="text-xl font-normal text-slate-300">in cash</span>
                  </div>
                  <p className="mt-4 text-base text-slate-300 font-medium">Plus Internship offers · Cloud API credits · Global Conference passes</p>
                </div>
              </section>

              {/* Detailed Prize Categories */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-6 space-y-4 shadow-md">
                  <div className="px-3 py-1 text-xs font-black uppercase tracking-widest bg-orange-500/20 text-orange-400 rounded border border-orange-500/30 w-max">
                    Main Category
                  </div>
                  <h4 className="font-black text-white text-xl">New Mod Tool Award</h4>
                  <p className="text-base text-slate-300 leading-relaxed font-normal">
                    For the most innovative tool or utility that solves a significant pain point for moderators. This could be easier rule enforcement, moderation workflows, community engagement tools, or anything else that supports moderators in community leadership.
                  </p>
                  <div className="text-3xl font-black text-orange-400 pt-4 border-t border-white/10 mt-3">
                    60.000.000 VNĐ
                  </div>
                </div>

                <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-6 space-y-4 shadow-md">
                  <div className="px-3 py-1 text-xs font-black uppercase tracking-widest bg-amber-500/20 text-amber-400 rounded border border-amber-500/30 w-max">
                    Migration Track
                  </div>
                  <h4 className="font-black text-white text-xl">Best Ported App Award</h4>
                  <p className="text-base text-slate-300 leading-relaxed font-normal">
                    This award recognizes the most successful migration of an <span className="text-orange-400 font-semibold">existing Data API moderation bot or tool</span> to Devvit. The winning submission will maintain the bot's core utility and can be generalized to serve many communities through app install.
                  </p>
                  <div className="text-3xl font-black text-amber-400 pt-4 border-t border-white/10 mt-3">
                    35.000.000 VNĐ
                  </div>
                </div>

                <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-6 space-y-4 sm:col-span-2 shadow-md">
                  <div className="px-3 py-1 text-xs font-black uppercase tracking-widest bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/30 w-max">
                    Special Jury Prize
                  </div>
                  <h4 className="font-black text-white text-xl">Moderators' Choice</h4>
                  <p className="text-base text-slate-300 leading-relaxed font-normal">
                    A panel of moderator judges will select one additional grand prize winner, based on the core judging criteria. This moderator panel will review a shortlist of projects from the two other categories that score highly in the first round of judging.
                  </p>
                  <div className="text-3xl font-black text-yellow-400 pt-3 border-t border-white/10">
                    20.000.000 VNĐ
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JUDGING CRITERIA */}
          {activeTab === "criteria" && (
            <div className="space-y-6 animate-fadeIn">
              {[
                { title: "Community Impact", desc: "How effectively does this tool solve real issues for subreddit moderators? Does it save measurable time or energy?" },
                { title: "Technical Execution & Quality", desc: "Is the app stable, clean, and optimized? Does it leverage Devvit platform capabilities to its fullest potential smoothly?" },
                { title: "User Experience & Ease of Use", desc: "Is the tool easy to understand and quick to install for non-technical moderators? Clean UI/UX flow." },
                { title: "Originality & Innovation", desc: "Does this submission provide a fresh perspective or unique approach to community management automation?" }
              ].map((item, idx) => (
                <div key={idx} className="backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex gap-6 items-start shadow-xl">
                  <div className="h-12 w-12 rounded-xl bg-orange-500/20 border-2 border-orange-500 text-orange-400 font-mono text-lg font-black flex items-center justify-center shrink-0 shadow-md">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xl">{item.title}</h4>
                    <p className="text-base md:text-lg text-slate-200 mt-2 leading-relaxed font-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: HOW TO SUBMIT */}
          {activeTab === "submit" && (
            <div className="backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-6 shadow-xl animate-fadeIn">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">Submission Requirements</h3>
                <p className="text-slate-300 text-base font-medium">Make sure to provide all required links before the deadline window closes.</p>
              </div>
              
              <div className="space-y-5 pt-2">
                {[
                  { label: "App listing", desc: "Link to your published app draft or live production on developer.reddit.com." },
                  { label: "Reddit usernames", desc: "List all participant team members' exact Reddit usernames." },
                  { label: "Tool Overview", desc: "Describe in detail the functionality of the bot. Include all capabilities and how moderators and users are intended to use the app." },
                  { label: "Project Impact", desc: "List 1-3 communities that you think would find this app useful and how you see moderators/communities benefiting. We're looking for community impact, time savings for moderators, etc." },
                  { label: "[For Ported Projects] Original Bot username", desc: "Please list the u/name of the bot you ported for this specific category." },
                  { label: "[For Ported Projects] Port Completion", desc: "Describe any differences, improvements, or gaps between your new app and the original bot. Could this app be installed today and serve the original function of the app?" },
                  { label: "[Optional] Developer Platform feedback", desc: "Complete our developer satisfaction survey for a shot at the Best Feedback prize category." }
                ].map((req, i) => (
                  <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all shadow-sm">
                    <span className="text-orange-400 text-lg font-extrabold block">● {req.label}</span>
                    <span className="text-slate-100 text-base md:text-lg mt-2.5 block leading-relaxed pl-5 border-l-2 border-orange-500/30 font-normal">{req.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Right Column: Sticky Sidebar Info */}
        <aside className="lg:sticky lg:top-8 self-start space-y-8">
          
          {/* Live Countdown Component */}
          <Countdown />
          
          {/* Quick Metrics Cards */}
          <div className="backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-6 text-base font-bold shadow-xl">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-slate-400 font-semibold">Status</span>
              <span className="text-orange-400 font-black flex items-center gap-2.5 text-base">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-400 animate-ping" /> Registration Open
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-slate-400 font-semibold">Format</span>
              <span className="text-slate-100 font-extrabold">Hybrid (Online + FPTU HCMC)</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-slate-400 font-semibold">Registered Teams</span>
              <span className="text-white font-mono font-black text-lg">2644 participants</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-slate-400 font-semibold">Hackathon Judges</span>
              <span className="text-slate-100 font-extrabold">Reddit Official Panel</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Language</span>
              <span className="text-slate-100 font-extrabold">English / Vietnamese</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/register" className="block text-center bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:brightness-110 text-white py-4.5 rounded-xl font-black shadow-xl shadow-orange-500/20 transition-all transform hover:-translate-y-1 text-lg tracking-wider uppercase">
              Join hackathon →
            </Link>
            <button className="w-full py-4 rounded-xl border-2 border-white/10 text-base font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all tracking-wide">
              Join Discord & r/Devvit Support
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}

// Countdown Sub-component
function Countdown() {
  const targetDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.getTime();
  }, []);

  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (now === null) {
    return (
      <div className="backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-2xl p-6 h-36 animate-pulse" />
    );
  }

  const ms = Math.max(0, targetDate - now);
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms / 3600000) % 24);
  const m = Math.floor((ms / 60000) % 60);
  const s = Math.floor((ms / 1000) % 60);
  
  const timeUnits: [string, number][] = [["DAYS", d], ["HOURS", h], ["MIN", m], ["SEC", s]];

  return (
    <div className="relative backdrop-blur-md bg-white/[0.03] border-2 border-orange-500/30 rounded-2xl p-6 overflow-hidden shadow-2xl bg-gradient-to-b from-white/[0.01] to-orange-500/[0.02]">
      <div className="absolute -inset-x-10 -top-10 h-32 bg-orange-500/10 blur-[60px] opacity-80" />
      <div className="relative">
        <div className="text-sm uppercase tracking-widest text-orange-400 font-black text-center sm:text-left">Submissions Close In</div>
        <div className="mt-5 grid grid-cols-4 gap-2.5">
          {timeUnits.map(([label, val]) => (
            <div key={label} className="text-center rounded-xl bg-[#0F1524] border border-white/10 py-4 px-1 shadow-md">
              <div className="text-3xl md:text-4xl font-black font-mono text-orange-400 tracking-tight">{String(val).padStart(2, "0")}</div>
              <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-2">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}