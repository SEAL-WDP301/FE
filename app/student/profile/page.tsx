"use client";

import { useState } from "react";
import {
    Camera,
    Crown,
    Award,
    Medal,
    Trophy,
    GitBranch,
    Save,
    GraduationCap,
    CheckCircle,
} from "lucide-react";

// ==========================================
// TÍCH HỢP TRỰC TIẾP CÁC COMPONENT GIAO DIỆN ĐỂ TRÁNH LỖI IMPORT TRÊN CANVAS & LOCAL
// ==========================================

function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0C0A09] text-[#F4F2F1] font-sans antialiased relative overflow-x-hidden">
            {/* Hiệu ứng nền grid mờ ảo cực chất theo phong cách SEAL */}
            <div
                className="absolute inset-0 opacity-[0.15] pointer-events-none z-0 bg-grid-pattern"
            />

            {/* Đốm sáng cam tỏa nhẹ ở góc trên bên phải */}
            <div className="absolute top-0 right-1/4 h-[400px] w-[600px] bg-[#FF6B2C]/5 blur-[120px] rounded-full pointer-events-none z-0" />

            {/* Khu vực nội dung chính - Đã loại bỏ hoàn toàn Navbar phía trên */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12 py-10">
                {children}
            </div>
        </div>
    );
}

function GlassCard({
    children,
    className = "",
    glow = false,
}: {
    children: React.ReactNode;
    className?: string;
    glow?: boolean;
}) {
    return (
        <div
            className={`relative bg-[#14110F] border border-white/[0.04] rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:border-white/[0.08] ${glow ? "shadow-[0_0_50px_rgba(255,107,44,0.05)] border-[#FF6B2C]/10" : ""
                } ${className}`}
        >
            {/* Góc trang trí neon cực mảnh */}
            {glow && (
                <>
                    <div className="absolute top-0 left-0 w-8 h-[1px] bg-gradient-to-r from-[#FF6B2C] to-transparent" />
                    <div className="absolute top-0 left-0 w-[1px] h-8 bg-gradient-to-b from-[#FF6B2C] to-transparent" />
                </>
            )}
            {children}
        </div>
    );
}

function Button({
    children,
    size = "default",
    variant = "default",
    className = "",
    ...props
}: {
    children: React.ReactNode;
    size?: "default" | "sm";
    variant?: "default" | "outline";
    className?: string;
    [key: string]: any;
}) {
    const baseStyle =
        "inline-flex items-center justify-center font-black rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer text-xs uppercase tracking-widest border-none outline-none";

    const sizeStyle = size === "sm" ? "px-4 py-2" : "px-6 py-3.5 w-full";

    const variantStyle =
        variant === "default"
            ? "bg-[#FF6B2C] text-white hover:bg-[#ff7c43] shadow-[0_4px_20px_rgba(255,107,44,0.2)]"
            : "border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-[#A39690] hover:text-white";

    return (
        <button className={`${baseStyle} ${sizeStyle} ${variantStyle} ${className}`} {...props}>
            {children}
        </button>
    );
}

function Input({
    className = "",
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`w-full h-11 px-4 bg-[#0C0A09] border border-white/[0.05] focus:border-[#FF6B2C]/50 text-white font-bold text-sm rounded-xl transition-all outline-none placeholder:text-[#8E827C]/40 ${className}`}
            {...props}
        />
    );
}

function Label({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <label className={`text-[10px] uppercase tracking-wider text-[#8E827C] font-black block ${className}`}>
            {children}
        </label>
    );
}

function Avatar({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`overflow-hidden rounded-full flex items-center justify-center border-2 border-white/[0.04] ${className}`}>
            {children}
        </div>
    );
}

function AvatarFallback({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`w-full h-full flex items-center justify-center font-black ${className}`}>
            {children}
        </div>
    );
}

function Badge({
    children,
    variant = "default",
    className = "",
}: {
    children: React.ReactNode;
    variant?: "default" | "outline";
    className?: string;
}) {
    const baseStyle = "inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border";
    const variantStyle =
        variant === "default"
            ? "bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/20"
            : "bg-white/[0.02] border-white/[0.08] text-[#8E827C]";
    return <span className={`${baseStyle} ${variantStyle} ${className}`}>{children}</span>;
}

// ==========================================
// MẢNG DANH HIỆU & GIẢI THƯỞNG
// ==========================================

const awards = [
    { name: "Spring 2026 Champion", desc: "Web Platforms · OrbitWave", icon: Crown, color: "from-amber-500/10 to-orange-600/10 text-amber-500 border-amber-500/20" },
    { name: "Summer 2026 Finalist", desc: "DevOps · NebulaForge", icon: Award, color: "from-[#FF6B2C]/10 to-[#FFA800]/10 text-[#FF6B2C] border-[#FF6B2C]/20" },
    { name: "Spring 2025 Finalist", desc: "Fintech · Pixel Drift", icon: Award, color: "from-blue-500/10 to-indigo-600/10 text-blue-400 border-blue-500/20" },
    { name: "Best UX Award", desc: "Round 2 — SEAL Fall 2026", icon: Medal, color: "from-emerald-500/10 to-teal-600/10 text-emerald-400 border-emerald-500/20" },
];

export default function ProfilePage() {
    const [profile, setProfile] = useState({
        fullName: "Nguyễn Minh Khoa",
        email: "khoanmse171234@fpt.edu.vn",
        studentId: "SE171234",
        phone: "+84 90 123 4567",
        university: "FPT University HCMC",
        major: "Software Engineering",
        githubUrl: "https://github.com/khoanmse171234",
    });

    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        console.log("Đã lưu thông tin cá nhân thực tế:", profile);
        // Hiển thị toast thông báo tùy chỉnh thay vì dùng alert gây đơ trình duyệt
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const handleGithubClick = () => {
        if (profile.githubUrl) {
            window.open(profile.githubUrl, "_blank");
        }
    };

    return (
        <DashboardLayout>
            {/* THÔNG BÁO LƯU THÀNH CÔNG (CUSTOM TOAST NOTIFICATION) */}
            <div
                className={`fixed top-6 right-6 z-[100] flex items-center gap-3 bg-[#14110F] border border-[#FF6B2C]/30 rounded-2xl py-4 px-5 shadow-[0_4px_30px_rgba(255,107,44,0.15)] transition-all duration-300 transform ${showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
                    }`}
            >
                <div className="h-8 w-8 rounded-lg bg-[#FF6B2C]/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-5 w-5 text-[#FF6B2C]" />
                </div>
                <div>
                    <div className="text-xs font-black text-white uppercase tracking-wider">Success</div>
                    <div className="text-xs text-[#A39690] font-bold mt-0.5">Profile changes saved successfully!</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Cột trái: Identity Card & Team History */}
                <div className="space-y-6">
                    <GlassCard glow className="text-center p-8 relative overflow-hidden">
                        <div className="relative inline-block mt-2">
                            {/* Thiết kế Avatar hình tròn chuẩn phong cách game thủ với vòng phát sáng cam */}
                            <Avatar className="h-32 w-32 ring-4 ring-[#FF6B2C]/30 mx-auto">
                                <AvatarFallback className="bg-gradient-to-br from-[#E25A20] to-[#FFA800] text-white text-3xl font-black">
                                    MK
                                </AvatarFallback>
                            </Avatar>
                            <button aria-label="Change profile picture" className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-gradient-to-r from-[#FF6B2C] to-[#FFA800] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 border-none outline-none cursor-pointer transition-transform duration-150">
                                <Camera className="h-4 w-4 text-white" />
                            </button>
                        </div>

                        <h2 className="mt-5 text-2xl font-black text-white tracking-tight leading-none">{profile.fullName}</h2>

                        <div className="text-xs text-[#8E827C] font-black flex items-center gap-1.5 justify-center mt-2 bg-white/[0.01] border border-white/[0.04] py-1.5 px-3.5 rounded-full w-fit mx-auto">
                            <GraduationCap className="h-4 w-4 text-[#FF6B2C]" />
                            <span>FPT University · HCMC · K17</span>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2">
                            <Badge className="bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/20 px-3 py-1 rounded-lg">
                                <Trophy className="h-3.5 w-3.5 mr-1" /> Champion
                            </Badge>
                            <Badge variant="outline" className="bg-white/[0.02] border-white/[0.08] text-[#8E827C] px-3 py-1 rounded-lg">
                                Lv. 14
                            </Badge>
                        </div>

                        {/* LƯỚI THỐNG KÊ METRICS DẸT PHẲNG ĐỒNG BỘ MẪU FIGMA */}
                        <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
                            <div className="rounded-2xl bg-[#0C0A09] border border-white/[0.03] py-4 transition-all hover:border-[#FF6B2C]/20">
                                <div className="text-[10px] text-[#8E827C] font-black uppercase tracking-widest">Events</div>
                                <div className="font-mono font-black text-2xl text-[#FF6B2C] mt-1">6</div>
                            </div>
                            <div className="rounded-2xl bg-[#0C0A09] border border-white/[0.03] py-4 transition-all hover:border-[#FF6B2C]/20">
                                <div className="text-[10px] text-[#8E827C] font-black uppercase tracking-widest">Teams</div>
                                <div className="font-mono font-black text-2xl text-[#FF6B2C] mt-1">3</div>
                            </div>
                            <div className="rounded-2xl bg-[#0C0A09] border border-white/[0.03] py-4 transition-all hover:border-[#FF6B2C]/20">
                                <div className="text-[10px] text-[#8E827C] font-black uppercase tracking-widest">Awards</div>
                                <div className="font-mono font-black text-2xl text-[#FF6B2C] mt-1">4</div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-3">
                            <button
                                onClick={handleGithubClick}
                                aria-label="Visit GitHub profile"
                                className="h-10 w-full max-w-[130px] rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center gap-2 hover:border-[#FF6B2C]/40 hover:bg-white/[0.06] text-[#A39690] hover:text-white transition-all duration-150 border-none outline-none cursor-pointer font-black text-xs uppercase tracking-widest"
                            >
                                <GitBranch className="h-4 w-4" /> GitHub
                            </button>

                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="h-4 w-1 bg-[#FF6B2C] rounded-full" /> Team history
                        </h3>
                        <ul className="space-y-3 text-xs">
                            {[
                                { t: "NebulaForge", p: "2026 · Lead", border: "border-l-2 border-[#FF6B2C] pl-3" },
                                { t: "OrbitWave", p: "2025–2026 · Backend", border: "border-l-2 border-[#FFA800] pl-3" },
                                { t: "Pixel Drift", p: "2024–2025 · Member", border: "border-l-2 border-[#A39690] pl-3" },
                            ].map((h) => (
                                <li
                                    key={h.t}
                                    className={`flex items-center justify-between rounded-xl bg-[#0C0A09]/60 border border-white/[0.02] py-3.5 px-4 hover:bg-white/[0.03] hover:border-white/[0.06] transition-all duration-150 ${h.border}`}
                                >
                                    <span className="font-black text-sm text-white tracking-wide">{h.t}</span>
                                    <span className="text-[#A39690] font-bold">{h.p}</span>
                                </li>
                            ))}
                        </ul>
                    </GlassCard>
                </div>

                {/* Cột phải: Personal Info Form & Awards */}
                <div className="lg:col-span-2 space-y-6">

                    {/* PERSONAL INFORMATION (Quay lại 6 ô nhập chuẩn mẫu thiết kế) */}
                    <GlassCard className="p-8">
                        <div className="flex items-center justify-between mb-6 border-b border-white/[0.04] pb-4">
                            <h3 className="text-lg font-black text-white tracking-wide">Personal information</h3>
                            <Button size="sm" onClick={handleSave}>
                                <Save className="h-4 w-4 mr-1.5" /> Save changes
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                    {/* AWARDS & ACHIEVEMENTS */}
                    <GlassCard className="p-8">
                        <h3 className="text-lg font-black text-white tracking-wide mb-6">Awards & achievements</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {awards.map((a) => (
                                <div
                                    key={a.name}
                                    className="group relative overflow-hidden rounded-2xl border border-white/[0.05] bg-[#0C0A09]/80 p-5 hover:border-[#FF6B2C]/30 transition-all duration-200"
                                >
                                    <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-[#FF6B2C]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    <div className="relative flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${a.color} border flex items-center justify-center shadow-lg shrink-0`}>
                                            <a.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-black text-base text-white tracking-wide leading-snug">{a.name}</div>
                                            <div className="text-xs text-[#A39690] font-bold mt-1">{a.desc}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
        <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-wider text-[#A39690] font-black">
                {label}
            </Label>
            <Input
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                onChange={onChange}
                className="h-11 bg-[#0C0A09] border-white/[0.06] focus-visible:ring-1 focus-visible:ring-[#FF6B2C]/40 focus-visible:border-[#FF6B2C]/60 text-white font-bold text-sm rounded-xl transition-all placeholder:text-[#8E827C]/60"
            />
        </div>
    );
}