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
    /* ĐÃ SỬA: 
      - Thêm w-full và overflow-x-hidden để khóa cứng không cho màn hình mobile bị xê dịch sang ngang.
      - Thay đổi py-16 thành py-0 (hoặc pt-0 pb-16) vì phần đỉnh đầu đã có Banner lo khoảng cách, tránh bị trống hoác.
      - Giảm padding ngang xuống px-4 trên mobile để tối ưu diện tích cho chữ.
    */
    <div className="relative min-h-screen w-full overflow-x-hidden text-[#F4F2F1] bg-[#120F0E] pt-0 pb-16 px-4 sm:px-12 lg:px-16 font-sans antialiased tracking-tight">

      {/* Khối Banner phía trên */}
      <div className="mx-auto max-w-[1400px] w-full">
        <Banner />
      </div>

      {/* Grid nội dung chính */}
      {/* ĐÃ SỬA: Thay đổi mt-12 thành mt-6 (trên mobile) và mt-12 (trên desktop). 
          Đổi gap-12 sang gap-6 trên mobile để các khối xếp dọc khít nhau đẹp hơn. */}
      <div className="mx-auto max-w-[1400px] mt-6 md:mt-12 grid gap-6 md:gap-12 grid-cols-1 lg:grid-cols-[1fr_420px] items-start w-full">

        {/* Cột trái: Tab Bar & Chi tiết nội dung */}
        {/* ĐÃ SỬA: Thêm min-w-0 để các nội dung text/card bên trong (ví dụ tab Overview) tự động co lại theo lề, không đâm thủng layout */}
        <main className="space-y-6 md:space-y-10 w-full min-w-0">

          {/* Thanh Tab Navigation */}
          {/* ĐÃ SỬA: 
              - whitespace-nowrap: Không cho chữ của tab bị tự động xuống dòng lỗi.
              - overflow-x-auto: Cho phép người dùng lấy ngón tay vuốt trượt ngang qua các tab (Prizes -> Criteria -> Submit) mượt mà trên điện thoại.
              - scrollbar-none: Ẩn thanh cuộn xấu xí của hệ thống để nhìn sạch sẽ như app di động.
          */}
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