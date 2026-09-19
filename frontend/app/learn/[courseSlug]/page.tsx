"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Clock3, LockKeyhole, PlayCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Course = { id: string; title: string; slug: string; description: string; price: number; thumbnailUrl?: string | null };
type Lesson = { id: string; title: string; description?: string | null; order: number; durationInMinutes: number; isFree: boolean; videoId?: string | null };

export default function LearnCoursePage() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const courses = await apiFetch<Course[]>("/courses");
        const found = courses.find((x) => x.slug === courseSlug);
        if (!found) return;
        const items = await apiFetch<Lesson[]>(`/courses/${found.id}/lessons`);
        if (active) { setCourse(found); setLessons(items); }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [courseSlug]);

  const freeCount = useMemo(() => lessons.filter((x) => x.isFree).length, [lessons]);

  if (loading) return <main dir="rtl" className="min-h-screen bg-[#f8f4ef] px-5 py-24 text-center text-base">در حال بارگذاری دوره…</main>;
  if (!course) return <main dir="rtl" className="min-h-screen bg-[#f8f4ef] px-5 py-24 text-center"><h1 className="text-2xl font-black">دوره پیدا نشد</h1><Link href="/courses" className="mt-6 inline-flex rounded-full bg-[#b78b72] px-6 py-3 text-sm font-bold text-white">بازگشت به دوره‌ها</Link></main>;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8f4ef] pb-20 text-[#2c2521]">
      <div className="mx-auto max-w-7xl px-5 pt-8 md:px-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-base font-bold text-[#8d6a55]"><ArrowLeft className="h-4 w-4" /> داشبورد هنرجو</Link>
        <section className="mt-7 overflow-hidden rounded-[2rem] bg-[#8d6a55] p-7 text-white shadow-[0_25px_70px_rgba(40,30,25,.14)] md:p-10">
          <h1 className="text-3xl font-black leading-tight md:text-4xl">{course.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/80">{course.description}</p>
        </section>

        <section className="mt-8 grid gap-7 lg:grid-cols-[1fr_300px]">
          <div className="rounded-[1.75rem] border border-[#e8ddd5] bg-white p-6 md:p-8">
            <div className="flex items-end justify-between"><div><h2 className="text-2xl font-black">جلسات دوره</h2><p className="mt-2 text-sm text-[#81756d]">جلسات رایگان بدون خرید قابل مشاهده‌اند؛ جلسات پولی فقط با دسترسی فعال پخش می‌شوند.</p></div><span className="text-sm font-bold text-[#81756d]">{lessons.length} جلسه</span></div>
            <div className="mt-7 space-y-3">
              {lessons.map((lesson, i) => {
                const locked = !lesson.isFree && !lesson.videoId;
                return <Link key={lesson.id} href={locked ? `/courses/${course.id}` : `/learn/${courseSlug}/${lesson.id}`} className={`flex items-center gap-4 rounded-2xl border p-4 transition ${locked ? "border-[#eee5df] bg-[#faf8f6]" : "border-[#eee5df] bg-[#fffdfb] hover:-translate-y-0.5 hover:border-[#d8b8a7]"}`}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f0e3da] text-sm font-black text-[#956b57]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1"><span className="block text-base font-black text-[#403731]">{lesson.title}</span><span className="mt-1 block text-sm leading-6 text-[#81756d]">{lesson.description}</span></span>
                  <span className="hidden items-center gap-1.5 text-sm text-[#81756d] sm:flex"><Clock3 className="h-4 w-4" />{lesson.durationInMinutes} دقیقه</span>
                  {locked ? <LockKeyhole className="h-5 w-5 shrink-0 text-[#aaa09a]" /> : <PlayCircle className="h-5 w-5 shrink-0 text-[#8d6a55]" />}
                </Link>;
              })}
            </div>
          </div>
          <aside className="h-fit rounded-[1.75rem] border border-[#e8ddd5] bg-white p-6 lg:sticky lg:top-6">
            {course.thumbnailUrl ? <img src={course.thumbnailUrl} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" /> : <div className="aspect-[4/3] rounded-2xl bg-[#ead6c6]" />}
            <h3 className="mt-5 text-xl font-black">مسیر یادگیری</h3>
            <p className="mt-3 text-sm leading-7 text-[#81756d]">{freeCount} جلسه رایگان در این دوره قرار دارد. برای جلسات پولی باید خرید موفق و دسترسی فعال داشته باشید.</p>
          </aside>
        </section>
      </div>
    </main>
  );
}
