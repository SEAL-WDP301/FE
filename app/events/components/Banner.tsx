"use client";

export default function Banner() {
    const handleBackToHome = () => {
        // Điều hướng bằng JavaScript an toàn cho Next.js Client Component
        if (typeof window !== "undefined") {
            window.location.href = "/";
        }
    };

    return (
        // Sử dụng breakout class để làm banner tràn viền vô cực 2 bên màn hình
        <section className="relative overflow-hidden border-b border-white/[0.03] rounded-none w-screen max-w-[100vw] left-1/2 -translate-x-1/2 bg-[#120F0E] mb-12 shadow-2xl py-16 sm:py-24 lg:py-28 px-6 sm:px-12 lg:px-20">

            {/* HIỆU ỨNG LƯỚI Ô CARO CHUYÊN NGHIỆP */}
            <div
                className="absolute inset-0 opacity-[0.25] pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
                    backgroundSize: '32px 32px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)',
                }}
            />

            {/* Đốm sáng cam tỏa mịn ở trung tâm nền */}
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[35rem] w-[70rem] bg-[#FF6B2C]/10 blur-[160px] animate-seal-pulse rounded-full pointer-events-none" />

            {/* BACKGROUND GRAPHICS: Đa giác 2 cánh */}
            {/* Cánh trái: Đa giác Cyan */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[350px] h-[300px] opacity-20 pointer-events-none hidden md:block">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#06b6d4] stroke-current stroke-[0.3] fill-none">
                    <polygon points="10,50 30,20 70,30 90,60 50,80" />
                    <line x1="10" y1="50" x2="70" y2="30" />
                    <line x1="30" y1="20" x2="50" y2="80" />
                    <line x1="30" y1="20" x2="90" y2="60" />
                </svg>
            </div>

            {/* Cánh phải: Đa giác Cam */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[300px] opacity-15 pointer-events-none hidden md:block">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#FF6B2C] stroke-current stroke-[0.3] fill-none">
                    <polygon points="90,50 70,80 30,70 10,40 50,20" />
                    <line x1="90" y1="50" x2="30" y2="70" />
                    <line x1="70" y1="80" x2="50" y2="20" />
                    <line x1="70" y1="80" x2="10" y2="40" />
                </svg>
            </div>

            {/* CONTENT CONTAINER */}
            <div className="relative z-10 mx-auto max-w-[1440px] w-full flex flex-col items-start">

                {/* ROW HEADER TRÊN */}
                <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">

                    {/* NÚT BACK TO HOME (Thiết kế dạng Button dẹt cứng cáp bằng thẻ <button>) */}
                    <button
                        onClick={handleBackToHome}
                        className="group inline-flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.12] px-4 py-2 text-xs font-black uppercase tracking-widest text-[#A39690] hover:text-white transition-all duration-200 active:scale-[0.98] cursor-pointer"
                    >
                        <span className="transform group-hover:-translate-x-0.5 transition-transform duration-150 text-sm leading-none">←</span>
                        <span>Back to home</span>
                    </button>

                    {/* Cặp Badges bên phải */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6B2C]/20 bg-[#FF6B2C]/5 px-3.5 py-1 text-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B2C] animate-pulse" />
                            <span className="text-[#FF6B2C] font-semibold tracking-wide uppercase">S.01 · SEAL Spring 2026</span>
                        </div>
                        <span className="px-3.5 py-1 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider uppercase">
                            7 days to deadline
                        </span>
                    </div>
                </div>

                {/* TIÊU ĐỀ KHỔNG LỒ 2 DÒNG */}
                <h1 className="text-5xl sm:text-7xl lg:text-[76px] xl:text-[84px] font-black text-white tracking-tighter leading-[1.05] flex flex-col gap-2">
                    <span>Build the future,</span>
                    <span className="text-[#FF6B2C]">in 48 hours.</span>
                </h1>

                {/* PHẦN TIỂU ĐỀ PHÂN LAYER */}
                <div className="mt-8 space-y-3 max-w-4xl">
                    <p className="text-xl sm:text-2xl font-extrabold text-[#F4F2F1] leading-snug">
                        SEAL Spring is the kickoff season of the 2026 league.
                    </p>
                    <p className="text-base sm:text-lg text-[#A39690] font-bold leading-relaxed">
                        Eight tracks, sixty-two mentors, 140Mđ in prizes — and one weekend you'll never forget.
                    </p>
                </div>

            </div>
        </section>
    );
}