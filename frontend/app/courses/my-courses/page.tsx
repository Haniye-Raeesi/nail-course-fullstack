"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  KeyRound,
  Loader2,
  PlayCircle,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import SpotPlayerLicense from "@/components/learning/SpotPlayerLicense";

type MyCourse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnailUrl?: string | null;
  progress: number;
  enrolledAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCourses() {
      try {
        const result = await apiFetch<MyCourse[]>("/Courses/enrolled");

        if (active) {
          setCourses(result);
        }
      } catch (error) {
        console.error("My courses error:", error);

        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "دریافت دوره‌های شما با خطا مواجه شد.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#f8f4ef] px-5 py-24">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 text-[#8d6a55]">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-bold">در حال دریافت دوره‌های شما...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#f8f4ef] px-5 py-24">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black">دریافت دوره‌ها ناموفق بود</h1>

          <p className="mt-4 text-[#716760]">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8f4ef] pb-20 text-[#2c2521]">
      <div className="mx-auto max-w-6xl px-5 pt-10 md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-black text-[#8d6a55]">
              آموزش‌های من
            </span>

            <h1 className="mt-2 text-3xl font-black md:text-4xl">
              دوره‌های من
            </h1>

            <p className="mt-3 text-[#716760]">
              دوره‌هایی که خریداری کرده‌اید از اینجا در دسترس هستند.
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dfd1c8] bg-white px-5 py-3 text-sm font-black text-[#8d6a55] transition hover:bg-[#f3e9e2]"
          >
            مشاهده همه دوره‌ها
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-[#e8ddd5] bg-white p-12 text-center shadow-[0_20px_60px_rgba(62,43,32,.06)]">
            <BookOpen className="mx-auto h-12 w-12 text-[#b78b72]" />

            <h2 className="mt-5 text-xl font-black">
              هنوز دوره‌ای خریداری نکرده‌اید
            </h2>

            <p className="mt-3 text-[#716760]">
              از بین دوره‌های آموزشی، دوره موردنظر خود را انتخاب کنید.
            </p>

            <Link
              href="/courses"
              className="mt-6 inline-flex rounded-full bg-[#b78b72] px-6 py-3 text-sm font-black text-white hover:bg-[#8d6a55]"
            >
              مشاهده دوره‌ها
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            {courses.map((course) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-[2rem] border border-[#e8ddd5] bg-white shadow-[0_25px_70px_rgba(62,43,32,.07)]"
              >
                <div className="grid lg:grid-cols-[280px_1fr]">
                  <div className="relative min-h-[220px] overflow-hidden bg-[#eadfd7]">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full min-h-[220px] place-items-center text-[#8d6a55]">
                        <BookOpen className="h-14 w-14" />
                      </div>
                    )}
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#f3e9e2] px-3 py-1 text-xs font-black text-[#8d6a55]">
                        {course.category.name}
                      </span>

                      <span className="rounded-full bg-[#edf5ed] px-3 py-1 text-xs font-black text-green-700">
                        دسترسی فعال
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-black md:text-3xl">
                      {course.title}
                    </h2>

                    <p className="mt-3 max-w-3xl text-sm leading-8 text-[#716760]">
                      {course.description}
                    </p>

                    <div className="mt-6">
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span className="text-[#716760]">پیشرفت دوره</span>

                        <span className="text-[#8d6a55]">
                          {course.progress}%
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eee5df]">
                        <div
                          className="h-full rounded-full bg-[#b78b72]"
                          style={{
                            width: `${Math.min(
                              Math.max(course.progress, 0),
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`/learn/${course.slug}/30000000-0000-0000-0000-000000000001`}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b78b72] px-6 py-3 text-sm font-black text-white transition hover:bg-[#8d6a55]"
                      >
                        <PlayCircle className="h-4 w-4" />
                        ادامه یادگیری
                      </Link>

                      <Link
                        href={`/courses/${course.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dfd1c8] px-6 py-3 text-sm font-black text-[#8d6a55] transition hover:bg-[#f8f4ef]"
                      >
                        مشاهده دوره
                      </Link>
                    </div>

                    <div className="mt-7 border-t border-[#eee5df] pt-7">
                      <div className="mb-4 flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-[#8d6a55]" />

                        <h3 className="font-black">دسترسی SpotPlayer</h3>
                      </div>

                      <SpotPlayerLicense courseId={course.id} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
