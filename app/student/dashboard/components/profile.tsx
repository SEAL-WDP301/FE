"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard, PageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Camera,
    Crown,
    Award,
    Medal,
    Trophy,
    GitBranch,
    Save,
    Lock,
    GraduationCap,
} from "lucide-react";

const awards = [
    { name: "Spring 2026 Champion", desc: "Web Platforms · OrbitWave", icon: Crown, color: "from-amber-500 to-orange-600" },
    { name: "Summer 2026 Finalist", desc: "DevOps · NebulaForge", icon: Award, color: "from-[#FF6B2C] to-[#FFA800]" },
    { name: "Spring 2025 Finalist", desc: "Fintech · Pixel Drift", icon: Award, color: "from-blue-500 to-indigo-600" },
    { name: "Best UX Award", desc: "Round 2 — SEAL Fall 2026", icon: Medal, color: "from-emerald-500 to-teal-600" },
];

export function ProfilePage() {
    const [profile, setProfile] = useState({
        fullName: "Nguyễn Minh Khoa",
        email: "khoanmse171234@fpt.edu.vn",
        studentId: "SE171234",
        phone: "+84 90 123 4567",
        university: "FPT University HCMC",
        major: "Software Engineering",
    });

    const handleSave = () => {
        console.log("Đã lưu thông tin cá nhân:", profile);
        alert("Cập nhật thông tin Player Card thành công!");
    };

    return (
        <DashboardLayout>
            <PageHeader
                eyebrow="My Profile"
                title="Player Card"
                description="Your SEAL identity, history, and credentials."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-start">
                {/* Left column: Card cá nhân */}
                <div className="space-y-6">
                    <GlassCard glow className="text-center p-6 relative overflow-hidden">
                        <div className="relative inline-block mt-2">
                            <Avatar className="h-28 w-28 ring-4 ring-primary/40 mx-auto">
                                <AvatarFallback className="bg-[var(--gradient-primary)] text-primary-foreground text-3xl font-black">
                                    MK
                                </AvatarFallback>
                            </Avatar>
                            <button aria-label="Change profile picture" className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-[var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow)] hover:brightness-110 border-none outline-none cursor-pointer transition-all active:scale-95">
                                <Camera className="h-4 w-4 text-primary-foreground" />
                            </button>
                        </div>

                        <h2 className="mt-4 text-xl font-bold text-white">{profile.fullName}</h2>

                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 justify-center mt-1">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            <span>FPT University · HCMC · K17</span>
                        </div>

                        <div className="mt-3 flex items-center justify-center gap-2">
                            <Badge className="bg-primary/15 text-primary border border-primary/30 px-3 py-0.5 text-xs font-bold rounded-md">
                                <Trophy className="h-3.5 w-3.5 mr-1" /> Champion
                            </Badge>
                            <Badge variant="outline" className="bg-white/[0.03] border-white/[0.08] text-muted-foreground px-3 py-0.5 text-xs font-bold rounded-md">
                                Lv. 14
                            </Badge>
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
                            <div className="rounded-xl bg-black/30 border border-border py-2.5">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Events</div>
                                <div className="font-bold text-base text-primary mt-0.5">6</div>
                            </div>
                            <div className="rounded-xl bg-black/30 border border-border py-2.5">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Teams</div>
                                <div className="font-bold text-base text-primary mt-0.5">3</div>
                            </div>
                            <div className="rounded-xl bg-black/30 border border-border py-2.5">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Awards</div>
                                <div className="font-bold text-base text-primary mt-0.5">4</div>
                            </div>
                        </div>

                        {/* Chỉ giữ duy nhất GitHub nút bấm và căn giữa */}
                        <div className="mt-5 flex items-center justify-center">
                            <button aria-label="Visit GitHub profile" className="h-10 w-full max-w-[120px] rounded-xl bg-white/[0.02] border border-border flex items-center justify-center gap-2 hover:border-primary/40 hover:bg-white/[0.06] text-muted-foreground hover:text-white transition-all duration-150 border-none outline-none cursor-pointer font-bold text-xs">
                                <GitBranch className="h-4 w-4" /> GitHub
                            </button>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h3 className="text-sm font-semibold text-white mb-3">Team history</h3>
                        <ul className="space-y-2 text-xs">
                            {[
                                { t: "NebulaForge", p: "2026 · Lead" },
                                { t: "OrbitWave", p: "2025–2026 · Backend" },
                                { t: "Pixel Drift", p: "2024–2025 · Member" },
                            ].map((h) => (
                                <li
                                    key={h.t}
                                    className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-border px-3 py-2 hover:bg-white/[0.04] transition-colors"
                                >
                                    <span className="font-semibold text-white">{h.t}</span>
                                    <span className="text-muted-foreground">{h.p}</span>
                                </li>
                            ))}
                        </ul>
                    </GlassCard>
                </div>

                {/* Right column: Form và Thành tích */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-white">Personal information</h3>
                            <Button size="sm" onClick={handleSave} className="rounded-lg bg-[var(--gradient-primary)] text-primary-foreground hover:brightness-110 font-bold px-3 py-1 text-xs">
                                <Save className="h-3.5 w-3.5 mr-1.5" /> Save
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label="Full name"
                                defaultValue={profile.fullName}
                                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                            />
                            <FormField
                                label="Email"
                                defaultValue={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            />
                            <FormField
                                label="Student ID"
                                defaultValue={profile.studentId}
                                onChange={(e) => setProfile({ ...profile, studentId: e.target.value })}
                            />
                            <FormField
                                label="Phone"
                                defaultValue={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            />
                            <FormField
                                label="University"
                                defaultValue={profile.university}
                                onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                            />
                            <FormField
                                label="Major"
                                defaultValue={profile.major}
                                onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                            />
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h3 className="text-sm font-semibold mb-4 text-white">Awards & achievements</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {awards.map((a) => (
                                <div
                                    key={a.name}
                                    className="group relative overflow-hidden rounded-xl border border-border bg-white/[0.02] p-4 hover:border-primary/40 transition-all duration-200"
                                >
                                    <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    <div className="relative flex items-center gap-3">
                                        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-lg shrink-0`}>
                                            <a.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-white">{a.name}</div>
                                            <div className="text-[11px] text-muted-foreground mt-0.5">{a.desc}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-semibold text-white">Password & security</h3>
                            </div>
                            <Button size="sm" variant="outline" className="rounded-lg border-border bg-white/[0.03] text-muted-foreground hover:text-white hover:bg-white/[0.08] transition-colors">
                                Update password
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <FormField label="Current" type="password" placeholder="••••••••" />
                            <FormField label="New" type="password" placeholder="••••••••" />
                            <FormField label="Confirm" type="password" placeholder="••••••••" />
                        </div>
                    </GlassCard>
                </div>
            </div>
        </DashboardLayout>
    );
}

function FormField({
    label,
    defaultValue,
    type,
    placeholder,
    onChange,
}: {
    label: string;
    defaultValue?: string;
    type?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                {label}
            </Label>
            <Input
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                onChange={onChange}
                className="h-10 bg-black/30 border-border focus-visible:ring-primary/40 focus-visible:border-primary/60 rounded-xl text-white placeholder:text-muted-foreground/40 outline-none"
            />
        </div>
    );
}