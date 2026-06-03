"use client";

import { useEffect, useMemo, useState } from "react";

export default function Countdown() {
    const targetDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 6); // Đặt mốc thời gian khớp với số 06 DAZE của ảnh mẫu
        date.setHours(date.getHours() + 23);
        date.setMinutes(date.getMinutes() + 44);
        return date.getTime();
    }, []);

    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const ms = Math.max(0, targetDate - now);
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms / 3600000) % 24);
    const s = Math.floor((ms / 1000) % 60);

    // Khớp chính xác 100% tên nhãn cách điệu của ảnh mẫu: "DAZE", "HOURS", "SEC"
    const timeUnits = [
        { label: "DAZE", val: d },
        { label: "HOURS", val: h },
        { label: "SEC", val: s }
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
