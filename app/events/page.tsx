"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Banner from "./components/Banner";
import TabsContent from "./components/TabsContent";
import Sidebar from "./components/Sidebar";

export default function EventPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "prizes" | "criteria" | "submit">("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "prizes", label: "Prizes" },
    { id: "criteria", label: "Judging Criteria" },
    { id: "submit", label: "How to Submit" },
  ] as const;

  return (

    <div className="relative min-h-screen w-full overflow-x-hidden text-[#F4F2F1] bg-[#120F0E] pt-0 pb-16 px-4 sm:px-12 lg:px-16 font-sans antialiased tracking-tight">

      {/* Khối Banner phía trên */}
      <div className="mx-auto max-w-[1400px] w-full">
        <Banner />
      </div>


      <div className="mx-auto max-w-[1400px] mt-6 md:mt-12 grid gap-6 md:gap-12 grid-cols-1 lg:grid-cols-[1fr_420px] items-start w-full">


        <main className="space-y-6 md:space-y-10 w-full min-w-0">

          <div className="flex items-center border-b border-white/[0.06] overflow-x-auto whitespace-nowrap scrollbar-none sticky top-0 bg-[#120F0E]/95 backdrop-blur-md z-20 py-3 md:pb-4 gap-2 md:gap-4 w-full">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "eventTabActive" : "eventTab"}
                size="eventTab"
                // Thu nhỏ font-size một chút trên mobile (text-sm md:text-base) để các tab vừa vặn tầm mắt
                className="font-black duration-150 text-sm md:text-base flex-shrink-0"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Nội dung động của Tab */}
          <div className="w-full min-w-0">
            <TabsContent activeTab={activeTab} />
          </div>

        </main>

        {/* Cột phải: Sidebar (Countdown + Thông số) */}
        {/* Khi ở mobile, khối này sẽ tự động xếp hàng rơi xuống dưới cùng của cột trái nhờ cơ chế Grid hệ thống */}
        <div className="w-full">
          <Sidebar />
        </div>

      </div>
    </div>
  );
}