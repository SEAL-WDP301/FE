"use client";

import { useEffect, useState } from "react";

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
                hours: "00",
                minutes: "00",
                seconds: "00",
            };
        }

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

    return (
        <div className="flex items-center gap-3 rounded-2xl border border-orange-500/20 bg-orange-500/5 px-4 py-3">
            <div className="flex flex-col leading-none">
                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Round Ends In
                </span>

                <div className="mt-1 flex items-center gap-2 text-lg font-bold text-white">
                    <span className="text-orange-400">
                        {timeLeft.hours}
                    </span>

                    <span className="text-muted-foreground">:</span>

                    <span className="text-orange-400">
                        {timeLeft.minutes}
                    </span>

                    <span className="text-muted-foreground">:</span>

                    <span className="text-orange-400">
                        {timeLeft.seconds}
                    </span>
                </div>
            </div>
        </div>
    );
}