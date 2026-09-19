"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  LogOut,
  PlayCircle,
} from "lucide-react";
import { courses } from "@/data/courses";
import { getLessons } from "@/data/lessons";
import { apiFetch } from "@/lib/api";
import { logout, hasTeacherRole } from "@/lib/auth";

type EnrollmentItem = {
  progress?: number;
  course?: {
    slug: string;
    title: string;
    thumbnailUrl?: string | null;
  };
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<EnrollmentItem[]>([]);

  useEffect(() => {
    apiFetch<EnrollmentItem[]>("/enrollments")
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const display = items.length
    ? items
        .filter((item) => item.course)
        .map((item) => ({
          slug: item.course!.slug,
          title: item.course!.title,
          image: item.course!.thumbnailUrl,
          progress: Number(item.progress ?? 0),
        }))
    : courses.slice(0, 2).map((course) => {
        const lessons = getLessons(course.slug);

        const progress =
          lessons.length > 0
            ? Math.round(
                (lessons.filter((lesson) => lesson.completed).length /
                  lessons.length) *
                  100
              )
            : 0;

        return {
          slug: course.slug,
          title: course.title,
          image: course.image,
          progress,
        };
      });

  if (loading) {
    return (
      <main
        dir="rtl"
        className="nc-section grid min-h-[70vh] place-items-center"
      >
        <div className="text-sm font-bold text-[#8d6a55]">
          در حال بارگذاری داشبورد...
        </div>
      </main>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <main
      dir="rtl"
      className="min-h-[calc(100vh-80px)] bg-[#fbf8f4] px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold text-[#b78b72]">
              پنل کاربری
            </p>

            <h1 className="text-3xl font-black text-[#211d1a] sm:text-4xl">
              داشبورد من
            </h1>

            <p className="mt-3 text-sm leading-7 text-[#75685f]">
              دوره‌های آموزشی و میزان پیشرفت یادگیری شما
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {hasTeacherRole() && (
              <button
                type="button"
                onClick={() => router.push("/teacher")}
                className="rounded-full bg-[#b78b72] px-5 py-3 text-xs font-black text-white transition hover:bg-[#8d6a55]"
              >
                پنل مدرس
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-[#e4d9d0] bg-white px-5 py-3 text-xs font-bold text-[#655950] transition hover:border-[#b78b72] hover:text-[#8d6a55]"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-[#eadfd7] bg-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3e6df] text-[#8d6a55]">
              <BookOpen className="h-5 w-5" />
            </div>

            <p className="text-xs font-bold text-[#8b7d74]">
              دوره‌های من
            </p>

            <p className="mt-2 text-3xl font-black text-[#211d1a]">
              {display.length.toLocaleString("fa-IR")}
            </p>
          </div>

          <div className="rounded-3xl border border-[#eadfd7] bg-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3e6df] text-[#8d6a55]">
              <PlayCircle className="h-5 w-5" />
            </div>

            <p className="text-xs font-bold text-[#8b7d74]">
              در حال یادگیری
            </p>

            <p className="mt-2 text-3xl font-black text-[#211d1a]">
              {display.filter((item) => item.progress < 100).length.toLocaleString(
                "fa-IR"
              )}
            </p>
          </div>

          <div className="rounded-3xl border border-[#eadfd7] bg-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3e6df] text-[#8d6a55]">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <p className="text-xs font-bold text-[#8b7d74]">
              تکمیل‌شده
            </p>

            <p className="mt-2 text-3xl font-black text-[#211d1a]">
              {display.filter((item) => item.progress >= 100).length.toLocaleString(
                "fa-IR"
              )}
            </p>
          </div>
        </div>

        {/* Courses */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#211d1a]">
                دوره‌های من
              </h2>

              <p className="mt-1 text-xs text-[#8b7d74]">
                ادامه مسیر یادگیری شما
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/courses")}
              className="flex items-center gap-2 text-xs font-black text-[#8d6a55] transition hover:text-[#b78b72]"
            >
              مشاهده همه دوره‌ها
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>

          {display.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#ddcfc5] bg-white px-6 py-16 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f3e6df] text-[#8d6a55]">
                <BookOpen className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-black text-[#211d1a]">
                هنوز دوره‌ای ندارید
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#8b7d74]">
                بعد از ثبت‌نام در یک دوره، دوره‌های شما در این قسمت نمایش داده
                می‌شوند.
              </p>

              <button
                type="button"
                onClick={() => router.push("/courses")}
                className="mt-6 rounded-2xl bg-[#b78b72] px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#8d6a55]"
              >
                مشاهده دوره‌ها
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {display.map((course) => (
                <article
                  key={course.slug}
                  className="overflow-hidden rounded-3xl border border-[#eadfd7] bg-white shadow-[0_12px_35px_rgba(57,39,29,.05)]"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="h-52 w-full bg-[#f3e6df] sm:h-auto sm:w-48">
                      {course.image ? (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full min-h-48 place-items-center text-[#8d6a55]">
                          <BookOpen className="h-10 w-10" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-black leading-8 text-[#211d1a]">
                        {course.title}
                      </h3>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="font-bold text-[#75685f]">
                            پیشرفت دوره
                          </span>

                          <span className="font-black text-[#8d6a55]">
                            {course.progress.toLocaleString("fa-IR")}٪
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-[#eee5df]">
                          <div
                            className="h-full rounded-full bg-[#b78b72] transition-all"
                            style={{
                              width: `${Math.min(
                                Math.max(course.progress, 0),
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/courses/${course.slug}`)
                        }
                        className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#b78b72] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#8d6a55]"
                      >
                        ادامه یادگیری
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}