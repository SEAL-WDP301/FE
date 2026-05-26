"use client";

import { useEffect, useState } from "react";

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; s: number } | null>(null);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);

        // Tính toán mốc thời gian đích cố định hoàn toàn ở phía Client
        const target = new Date();
        target.setDate(target.getDate() + 6); // Khớp với 06 ngày của ảnh mẫu
        target.setHours(target.getHours() + 23);
        target.setMinutes(target.getMinutes() + 44);
        const targetTime = target.getTime();

        const calculateTime = () => {
            const now = Date.now();
            const ms = Math.max(0, targetTime - now);
            const d = Math.floor(ms / 86400000);
            const h = Math.floor((ms / 3600000) % 24);
            const s = Math.floor((ms / 1000) % 60);
            setTimeLeft({ d, h, s });
        };

        // Chạy lần đầu tiên ngay lập tức ở client
        calculateTime();

        // Thiết lập bộ đếm giây
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Nếu chưa mounted (hoặc đang SSR ở Server), hiển thị Skeleton giữ chỗ trùng khớp hoàn hảo cấu trúc DOM
    if (!mounted || !timeLeft) {
        return (
            <div className="relative bg-[#1D1714]/50 border border-white/[0.04] rounded-[28px] p-6 shadow-xl overflow-hidden h-[154px] flex flex-col justify-between">
                <div className="text-xs uppercase tracking-[0.2em] text-[#FF6B2C]/40 font-black">
                    KICKOFF IN
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 rounded-2xl bg-[#120F0E]/80 border border-white/[0.02] animate-pulse" />
                    <div className="h-16 rounded-2xl bg-[#120F0E]/80 border border-white/[0.02] animate-pulse" />
                    <div className="h-16 rounded-2xl bg-[#120F0E]/80 border border-white/[0.02] animate-pulse" />
                </div>
            </div>
        );
    }

    const timeUnits = [
        { label: "DAZE", val: timeLeft.d },
        { label: "HOURS", val: timeLeft.h },
        { label: "SEC", val: timeLeft.s }
    ];

    return (
        <div className="relative bg-[#1D1714]/50 border border-white/[0.04] rounded-[28px] p-6 shadow-xl overflow-hidden">
            {/* Vệt cam mờ nhẹ góc trái */}
            <div className="absolute -inset-x-10 -top-10 h-28 bg-[#FF6B2C]/5 blur-[60px] pointer-events-none" />

            <div className="relative">
                <div className="text-xs uppercase tracking-[0.2em] text-[#FF6B2C] font-black">
                    KICKOFF IN
                </div>

                {/* Lưới 3 cột thời gian dẹt phẳng, bo góc tròn sang trọng */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                    {timeUnits.map((item) => (
                        <div key={item.label} className="text-center rounded-2xl bg-[#120F0E]/80 border border-white/[0.02] py-4 px-2">
                            <div className="text-3xl font-black text-[#FF6B2C] tracking-tight font-mono">
                                {String(item.val).padStart(2, "0")}
                            </div>
                            <div className="text-[10px] font-black tracking-wider text-[#A39690] mt-1">
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}