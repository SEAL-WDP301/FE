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
    // Đổi toàn bộ màu nền sang Đen gỗ ấm đặc trưng: bg-[#120F0E] 
    // Thay đổi toàn bộ font chữ mặc định thành font-bold/font-black dầy cộm
    <div className="relative min-h-screen text-[#F4F2F1] bg-[#120F0E] py-16 px-6 sm:px-12 lg:px-16 font-sans antialiased tracking-tight">
      
      {/* Khối Banner phía trên - Cho rộng tối đa max-w-[1400px] */}
      <div className="mx-auto max-w-[1400px]">
        <Banner />
      </div>

      {/* Grid nội dung chính bung rộng tối đa (max-w-[1400px]) và tăng khoảng cách gap-12 */}
      <div className="mx-auto max-w-[1400px] mt-12 grid gap-12 lg:grid-cols-[1fr_420px] items-start">

        {/* Cột trái: Tab Bar & Chi tiết nội dung */}
        <main className="space-y-10 w-full">

          {/* Thanh Tab Navigation - Size chữ đẩy lên text-lg, font-black siêu dày */}
          <div className="flex border-b border-white/[0.06] overflow-x-auto scrollbar-none sticky top-0 bg-[#120F0E]/95 backdrop-blur-md z-20 pb-4 gap-4">
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