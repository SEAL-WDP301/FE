import { Camera, Lock, Mail, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { MentorPageHeader } from "../_components/mentor-page-header";
import { mentorProfile } from "../mock-data";

export default function MentorSettingsPage() {
    return (
        <div className="mx-auto max-w-[1200px] space-y-6">
            <MentorPageHeader title="Mentor Settings" subtitle="Manage profile, expertise, availability, notifications, and account security." />

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
                <main className="space-y-5">
                    <GlassCard className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
                        <div className="mt-5 flex flex-col gap-5 md:flex-row">
                            <div>
                                <Avatar className="h-24 w-24 border border-orange-500/25"><AvatarFallback className="text-2xl">{mentorProfile.initials}</AvatarFallback></Avatar>
                                <Button variant="soft" className="mt-4 rounded-2xl"><Camera className="h-4 w-4" />Upload</Button>
                            </div>
                            <div className="grid flex-1 gap-4 md:grid-cols-2">
                                <Input defaultValue={mentorProfile.name} className="h-11 rounded-2xl border-white/10 bg-white/[0.03]" />
                                <Input defaultValue={mentorProfile.email} className="h-11 rounded-2xl border-white/10 bg-white/[0.03]" />
                                <Textarea defaultValue="Mentor focused on scalable backend systems and practical architecture." className="min-h-28 rounded-2xl border-white/10 bg-white/[0.03] md:col-span-2" />
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-white">Expertise Areas</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {mentorProfile.expertise.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                            {["Fintech", "Education", "DevOps"].map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                        </div>
                    </GlassCard>

                    <GlassCard className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-white">Availability Schedule</h2>
                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                            {["Monday 7PM - 10PM", "Wednesday 8PM - 10PM", "Friday 7PM - 9PM", "Saturday 2PM - 5PM"].map((slot) => (
                                <div key={slot} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-white">{slot}</div>
                            ))}
                        </div>
                    </GlassCard>
                </main>

                <aside className="space-y-5">
                    <GlassCard className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-white">Notification Settings</h2>
                        <div className="mt-4 space-y-3">
                            {["Email notifications", "Session reminders", "Team alerts"].map((item) => (
                                <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                                    <span className="text-sm text-white">{item}</span>
                                    <span className="h-6 w-11 rounded-full bg-orange-500/25 p-0.5"><span className="block h-5 w-5 translate-x-5 rounded-full bg-orange-400" /></span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="rounded-[24px] bg-card p-6">
                        <h2 className="text-lg font-semibold text-white">Account Settings</h2>
                        <div className="mt-4 grid gap-3">
                            <Button variant="outline" className="justify-start rounded-2xl border-white/10 bg-white/[0.03]"><Lock className="h-4 w-4" />Change Password</Button>
                            <Button variant="outline" className="justify-start rounded-2xl border-white/10 bg-white/[0.03]"><ShieldCheck className="h-4 w-4" />Security Settings</Button>
                            <Button variant="outline" className="justify-start rounded-2xl border-white/10 bg-white/[0.03]"><Mail className="h-4 w-4" />Linked Accounts</Button>
                        </div>
                    </GlassCard>
                </aside>
            </div>
        </div>
    );
}
