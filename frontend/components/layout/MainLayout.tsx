import Link from "next/link";
import Navbar from "./Navbar";

// Next.js Link navigation is client-side (SPA-style) so route changes avoid full document reloads.
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{children}</main>
      <footer className="border-t border-[#e5dcd4] bg-[#211d1a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_.8fr_.8fr]">
            <div>
              <Link href="/" className="text-xl font-black tracking-wide">NAILCOURSE</Link>
              <div className="mt-1 text-[9px] tracking-[0.28em] text-[#bfa28d]">ACADEMY</div>
              <p className="mt-5 max-w-sm text-xs leading-7 text-white/55">آکادمی تخصصی آموزش ناخن؛ جایی برای یادگیری، خلق و ساختن یک مسیر حرفه‌ای.</p>
            </div>
            <div><h3 className="text-sm font-black">لینک‌های سریع</h3><div className="mt-4 flex flex-col gap-3 text-xs text-white/55"><Link href="/courses">دوره‌ها</Link><Link href="/#about">درباره ما</Link><Link href="/#portfolio">نمونه‌کارها</Link><Link href="/cart">سبد خرید</Link></div></div>
            <div><h3 className="text-sm font-black">ارتباط با ما</h3><div className="mt-4 flex flex-col gap-3 text-xs text-white/55"><span>Instagram</span><span>Telegram</span><span>info@nailcourse.ir</span></div></div>
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-[10px] text-white/35 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 NailCourse. تمامی حقوق محفوظ است.</span><span>قوانین و مقررات · حریم خصوصی</span></div>
        </div>
      </footer>
    </div>
  );
}
