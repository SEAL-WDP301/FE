"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

interface CountdownTimerProps {
    targetDate: string;
}

export function CountdownTimer({
    targetDate,
}: CountdownTimerProps) {

    const calculateTimeLeft = () => {
        const difference =
            new Date(targetDate).getTime() - new Date().getTime();

        if (difference <= 0) {
            return {
                days: "00",
                hours: "00",
                minutes: "00",
                seconds: "00",
            };
        }

        const days = Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        );

        const minutes = Math.floor(
            (difference / 1000 / 60) % 60
        );

        const seconds = Math.floor(
            (difference / 1000) % 60
        );

        return {
            days: String(days).padStart(2, "0"),
            hours: String(hours).padStart(2, "0"),
            minutes: String(minutes).padStart(2, "0"),
            seconds: String(seconds).padStart(2, "0"),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const timerItems = [
        {
            label: "DAYS",
            value: timeLeft.days,
        },
        {
            label: "HOURS",
            value: timeLeft.hours,
        },
        {
            label: "MINS",
            value: timeLeft.minutes,
        },
        {
            label: "SECS",
            value: timeLeft.seconds,
        },
    ];

    return (
        <div className="rounded-b-3xl border-t border-white/10 bg-gradient-to-b from-orange-500/[0.03] to-transparent p-6">

            {/* Header */}
            <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-2 text-lg text-[#b8aaa2]">
                    <Clock3 className="h-5 w-5 text-orange-500" />

                    <span>
                        Round 2 closes in
                    </span>
                </div>

                <div className="rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-sm font-semibold text-orange-400">
                    Qualified
                </div>
            </div>

            {/* Timer */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                {timerItems.map((item) => (
                    <div
                        key={item.label}
                        className="rounded-xl bg-black/40 border border-border px-3 py-2.5 text-center"
                    >
                        <div className="text-2xl md:text-3xl font-bold tabular-nums gradient-text text-orange-500">
                            {item.value}
                        </div>

                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}