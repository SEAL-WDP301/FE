"use client";

import { useEffect, useMemo, useState } from "react";

export default function Countdown() {
    // 1. Khắc phục lỗi Hydration: Đặt mốc thời gian cố định dựa trên thời gian thực tế
    const targetDate = useMemo(() => {
        const date = new Date("2026-06-05T00:00:00+07:00"); // Đặt hẳn một ngày cố định cụ thể
        return date.getTime();
    }, []);

    // Không chạy Date.now() ngay khi khởi tạo để tránh lệch dữ liệu Server-Client
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        setNow(Date.now()); // Chỉ gán thời gian sau khi component đã mount lên trình duyệt
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Nếu chưa mount xong, hiện trạng thái loading nhẹ hoặc giữ layout cố định tương thích mượt với theme
    if (now === null) {
        return (
            <div className="relative border rounded-[28px] p-6 h-[120px] animate-pulse bg-card border-border/60 dark:bg-[#1D1714]/50 dark:border-white/[0.04]" />
        );
    }

    const ms = Math.max(0, targetDate - now);
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms / 3600000) % 24);
    const m = Math.floor((ms / 60000) % 60);
    const s = Math.floor((ms / 1000) % 60);

    const timeUnits = [
        { label: "DAZE", val: d },
        { label: "HOURS", val: h },
        { label: "MINS", val: m },
        { label: "SEC", val: s }
    ];

    return (
        /* ĐÃ SỬA: 
           - Chuyển đổi khung bọc ngoài sang bg-card và border-border để tự động thích ứng.
           - Giữ lại nền tối nguyên bản dark:bg-[#1D1714]/50 và dark:border-white/[0.04] khi gạt sang Dark Mode.
        */
        <div className="relative border rounded-[28px] p-4 md:p-6 shadow-xl overflow-hidden w-full bg-card border-border/60 dark:bg-[#1D1714]/50 dark:border-white/[0.04] transition-colors duration-300">
            {/* Vệt cam mờ nhẹ góc trái */}
            <div className="absolute -inset-x-10 -top-10 h-28 bg-[#FF6B2C]/5 blur-[60px] pointer-events-none" />

            <div className="relative">
                <div className="text-xs uppercase tracking-[0.2em] text-[#FF6B2C] font-black text-center md:text-left">
                    KICKOFF IN
                </div>

                {/* Lưới 4 cột ô số đếm */}
                <div className="mt-4 grid grid-cols-4 gap-2 md:gap-3">
                    {timeUnits.map((item) => (
                        <div
                            key={item.label}
                            /* ĐÃ SỬA: 
                               - Thay đổi ô số con sang bg-background để tự ăn theo màu trắng nhạt khi ở Light Mode.
                               - Trả về màu nền đen gỗ ấm dark:bg-[#120F0E]/80 khi gạt sang Dark Mode.
                               - Đổi border sang border-border/60 để tự chuyển đổi màu sắc viền tương phản thích hợp.
                            */
                            className="text-center rounded-2xl border py-3 md:py-4 px-1 md:px-2 bg-background border-border/60 dark:bg-[#120F0E]/80 dark:border-white/[0.02] transition-colors duration-300"
                        >
                            {/* Số đếm: Màu cam rực nổi bật trên cả nền sáng và nền tối */}
                            <div className="text-2xl md:text-3xl font-black text-[#FF6B2C] tracking-tight font-mono">
                                {String(item.val).padStart(2, "0")}
                            </div>
                            {/* Nhãn chữ: Tự động đổi màu chữ xám đậm ở Light Mode và xám mờ tinh tế ở Dark Mode */}
                            <div className="text-[8px] md:text-[10px] font-black tracking-wider text-muted-foreground dark:text-[#A39690] mt-1 uppercase transition-colors">
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}