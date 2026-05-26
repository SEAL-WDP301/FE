import Link from "next/link";
import { Button } from "@/components/ui/button";
import Countdown from "./Countdown";

export default function Sidebar() {
    return (
        <aside className="lg:sticky lg:top-8 self-start space-y-6">
            {/* Live Countdown Component */}
            <Countdown />

            {/* Khối thông số chi tiết */}
            <div className="bg-[#141210] border border-white/[0.04] rounded-[24px] p-6 space-y-4 text-sm font-medium">
                <div className="flex justify-between items-center pb-3 border-b border-white/[0.04]">
                    <span className="text-[#A39690]">Status</span>
                    <span className="text-[#FF6B2C] font-bold flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B2C] animate-ping" /> Registration Open
                    </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/[0.04]">
                    <span className="text-[#A39690]">Format</span>
                    <span className="text-white font-semibold">Hybrid (Online + FPTU HCMC)</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/[0.04]">
                    <span className="text-[#A39690]">Registered Teams</span>
                    <span className="text-white font-mono font-bold">2,644 participants</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/[0.04]">
                    <span className="text-[#A39690]">Hackathon Judges</span>
                    <span className="text-white font-semibold">Reddit Official Panel</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[#A39690]">Language</span>
                    <span className="text-white font-semibold">English / Vietnamese</span>
                </div>
            </div>

            {/* Cặp nút kêu gọi hành động (Call to Action) */}
            <div className="space-y-3">
                <Button
                    asChild
                    variant="eventCta"
                    size="eventCta"
                    className="w-full font-bold"
                >
                  <Link
                    href="/register"
                  >
                    Join hackathon →
                  </Link>
                </Button>
                <Button variant="eventOutline" size="eventCta" className="w-full font-semibold">
                    Join Discord & r/Devvit Support
                </Button>
            </div>
        </aside>
    );
}
