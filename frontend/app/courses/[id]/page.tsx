"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Lock,
  PlayCircle,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

type Lesson = {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  durationInMinutes: number;
  isFree: boolean;
};

type CourseDetails = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnailUrl?: string | null;
  isPublished: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  lessons: Lesson[];
};
type CourseAccess = {
  courseId: string;
  isEnrolled: boolean;
  canAccessPaidLessons: boolean;
  progress: number;
};

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR");
}

function formatDuration(minutes: number) {
  if (!minutes || minutes <= 0) {
    return "بدون زمان";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} دقیقه`;
  }

  if (remainingMinutes === 0) {
    return `${hours} ساعت`;
  }

  return `${hours} ساعت و ${remainingMinutes} دقیقه`;
}
export default function CourseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [access, setAccess] = useState<CourseAccess | null>(null);
  const [accessLoading, setAccessLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        setError("");

        const { id } = await params;

        console.log("Course ID:", id);

        const data = await apiFetch<CourseDetails>(`/courses/${id}`);

        console.log("Course data:", data);

        setCourse(data);
      } catch (err) {
        console.error("Failed to load course:", err);

        setError(
          "دریافت اطلاعات دوره با مشکل مواجه شد. لطفاً اتصال API را بررسی کنید.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [params]);
  useEffect(() => {
    async function loadAccess() {
      try {
        setAccessLoading(true);

        const { id } = await params;

        const data = await apiFetch<CourseAccess>(`/courses/${id}/access`);

        setAccess(data);
      } catch (err) {
        console.error("Failed to load course access:", err);

        // کاربر مهمان یا کاربری که لاگین نیست
        setAccess({
          courseId: "",
          isEnrolled: false,
          canAccessPaidLessons: false,
          progress: 0,
        });
      } finally {
        setAccessLoading(false);
      }
    }

    loadAccess();
  }, [params]);
  if (loading) {
    return (
      <main className="min-h-screen px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="h-10 w-48 animate-pulse rounded-xl bg-[#eee5de]" />
          <div className="mt-8 h-72 animate-pulse rounded-[2rem] bg-[#eee5de]" />
          <div className="mt-8 h-40 animate-pulse rounded-[2rem] bg-[#eee5de]" />
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-black text-[#211d1a]">دوره پیدا نشد</h1>

          <p className="mt-3 text-sm text-[#857970]">
            {error || "این دوره وجود ندارد یا منتشر نشده است."}
          </p>

          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#b78b72] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#8d6a55]"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به دوره‌ها
          </Link>
        </div>
      </main>
    );
  }

  const totalMinutes = course.lessons.reduce(
    (total, lesson) => total + lesson.durationInMinutes,
    0,
  );

  const freeLessons = course.lessons.filter((lesson) => lesson.isFree);

  const firstLesson = [...course.lessons].sort((a, b) => a.order - b.order)[0];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="nc-section pt-10 md:pt-16">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#8d6a55] transition hover:text-[#b78b72]"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به دوره‌ها
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
            {/* Course information */}
            <div className="rounded-[2rem] border border-[#e8ded6] bg-white p-7 shadow-[0_18px_55px_rgba(75,52,40,.06)] md:p-10">
              <span className="inline-flex rounded-full bg-[#f1e5dd] px-4 py-2 text-xs font-black text-[#8d6a55]">
                {course.category?.name ?? "آموزش‌های تخصصی ناخن"}
              </span>

              <h1 className="mt-5 text-3xl font-black leading-[1.7] text-[#211d1a] md:text-5xl">
                {course.title}
              </h1>

              <p className="mt-5 text-sm leading-8 text-[#857970] md:text-base">
                {course.description}
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-[#faf6f3] p-4">
                  <BookOpen className="h-5 w-5 text-[#b78b72]" />
                  <div className="mt-2 text-lg font-black text-[#211d1a]">
                    {course.lessons.length.toLocaleString("fa-IR")}
                  </div>
                  <div className="text-xs text-[#91847b]">جلسه آموزشی</div>
                </div>

                <div className="rounded-2xl bg-[#faf6f3] p-4">
                  <Clock3 className="h-5 w-5 text-[#b78b72]" />
                  <div className="mt-2 text-lg font-black text-[#211d1a]">
                    {formatDuration(totalMinutes)}
                  </div>
                  <div className="text-xs text-[#91847b]">مدت دوره</div>
                </div>

                <div className="rounded-2xl bg-[#faf6f3] p-4">
                  <CheckCircle2 className="h-5 w-5 text-[#b78b72]" />
                  <div className="mt-2 text-lg font-black text-[#211d1a]">
                    {freeLessons.length.toLocaleString("fa-IR")}
                  </div>
                  <div className="text-xs text-[#91847b]">جلسه رایگان</div>
                </div>
              </div>
            </div>

            {/* Purchase card */}
            <div className="rounded-[2rem] border border-[#e8ded6] bg-[#b78b72] p-7 text-white shadow-[0_20px_60px_rgba(141,106,85,.2)] md:p-9">
              <div className="flex h-full flex-col">
                <div>
                  <span className="text-xs font-bold text-white/75">
                    سرمایه‌گذاری روی مهارت
                  </span>

                  <div className="mt-4 text-3xl font-black">
                    {formatPrice(course.price)}
                    <span className="mr-2 text-sm font-normal text-white/80">
                      تومان
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-10">
                  {access?.isEnrolled && (
                    <div className="mt-6 rounded-2xl bg-white/15 p-4">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>پیشرفت دوره</span>
                        <span>
                          {Number(access.progress).toLocaleString("fa-IR")}٪
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                        <div
                          className="h-full rounded-full bg-white transition-all"
                          style={{
                            width: `${Math.min(
                              Math.max(Number(access.progress), 0),
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {access?.isEnrolled ? (
                    <Link
                      href={
                        firstLesson
                          ? `/learn/${course.slug}/${firstLesson.id}`
                          : "#"
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-[#8d6a55] transition hover:bg-[#f7eee8]"
                    >
                      ادامه یادگیری
                      <PlayCircle className="h-5 w-5" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-[#8d6a55] transition hover:bg-[#f7eee8]"
                    >
                      خرید دوره
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section className="nc-section py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7">
            <span className="text-xs font-black text-[#b78b72]">
              سرفصل دوره
            </span>

            <h2 className="mt-2 text-2xl font-black text-[#211d1a] md:text-3xl">
              جلسات آموزشی
            </h2>
          </div>

          <div className="space-y-3">
            {[...course.lessons]
              .sort((a, b) => a.order - b.order)
              .map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 rounded-2xl border border-[#e8ded6] bg-white p-4 shadow-[0_8px_30px_rgba(75,52,40,.035)] transition hover:border-[#d6c1b3]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1e5dd] text-sm font-black text-[#8d6a55]">
                    {(index + 1).toLocaleString("fa-IR")}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-black text-[#211d1a] md:text-base">
                      {lesson.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-3 text-[11px] text-[#91847b]">
                      <span className="flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {formatDuration(lesson.durationInMinutes)}
                      </span>

                      {lesson.isFree && (
                        <span className="font-bold text-[#8d6a55]">رایگان</span>
                      )}
                    </div>
                  </div>

                  {lesson.isFree || access?.canAccessPaidLessons ? (
                    <Link
                      href={`/learn/${course.slug}/${lesson.id}`}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#b78b72] px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-[#8d6a55]"
                    >
                      مشاهده
                      <PlayCircle className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="hidden text-[10px] font-bold text-[#91847b] sm:inline">
                        ویژه اعضا
                      </span>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5efeb] text-[#8d6a55]">
                        <Lock className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
