"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3, LockKeyhole } from "lucide-react";

import { apiFetch } from "@/lib/api";
import SpotPlayerFrame from "@/components/learning/SpotPlayerFrame";

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl?: string | null;
};

type LessonProgress = {
  watchedSeconds: number;
  durationSeconds: number;
  lastPositionSeconds: number;
  progressPercent: number;
};

type Lesson = {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  durationInMinutes: number;
  isFree: boolean;
  videoId?: string | null;
  isLocked: boolean;
  progress?: LessonProgress | null;
};

type LearningResponse = {
  course: Course;
  isEnrolled: boolean;
  canAccessPaidLessons: boolean;
  progress: number;
  selectedLessonId: string;
  selectedLessonAccess: boolean;
  lessons: Lesson[];
};

export default function LessonPage() {
  const { courseSlug, lessonId } = useParams<{
    courseSlug: string;
    lessonId: string;
  }>();

  const [data, setData] = useState<LearningResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadLearningPage() {
      try {
        const result = await apiFetch<LearningResponse>(
          `/learning/${courseSlug}/${lessonId}`,
        );

        if (active) {
          setData(result);
        }
      } catch (error) {
        console.error("Learning page error:", error);

        if (active) {
          setData(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadLearningPage();

    return () => {
      active = false;
    };
  }, [courseSlug, lessonId]);

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#f8f4ef] px-5 py-24 text-center"
      >
        در حال بارگذاری جلسه…
      </main>
    );
  }

  if (!data) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#f8f4ef] px-5 py-24 text-center"
      >
        <h1 className="text-2xl font-black">جلسه پیدا نشد</h1>
        <p className="mt-3 text-[#716760]">
          دسترسی به اطلاعات جلسه امکان‌پذیر نیست.
        </p>
      </main>
    );
  }

  const lesson = data.lessons.find((item) => item.id === lessonId);

  if (!lesson) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#f8f4ef] px-5 py-24 text-center"
      >
        <h1 className="text-2xl font-black">جلسه پیدا نشد</h1>
      </main>
    );
  }

  const index = data.lessons.findIndex((item) => item.id === lessonId);

  const previous = index > 0 ? data.lessons[index - 1] : null;

  const next =
    index >= 0 && index < data.lessons.length - 1
      ? data.lessons[index + 1]
      : null;

  const locked = lesson.isLocked || !data.selectedLessonAccess;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8f4ef] pb-20 text-[#2c2521]">
      <div className="mx-auto max-w-6xl px-5 pt-8 md:px-8">
        <Link
          href={`/courses/${data.course.id}`}
          className="inline-flex items-center gap-2 text-base font-bold text-[#8d6a55]"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به دوره
        </Link>

        <div className="mt-7 rounded-[2rem] border border-[#e8ddd5] bg-white p-5 shadow-[0_25px_70px_rgba(62,43,32,.08)] md:p-8">
          {locked ? (
            <div className="grid aspect-video place-items-center rounded-[1.5rem] bg-[#8d6a55] p-8 text-center text-white">
              <div>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/10">
                  <LockKeyhole className="h-8 w-8" />
                </div>

                <h1 className="mt-5 text-2xl font-black">این جلسه قفل است</h1>

                <p className="mt-3 text-sm leading-7 text-white/75">
                  برای تماشای این جلسه باید دسترسی فعال به دوره داشته باشید.
                </p>

                <Link
                  href={`/courses/${data.course.id}`}
                  className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-black text-[#8d6a55]"
                >
                  مشاهده صفحه دوره
                </Link>
              </div>
            </div>
          ) : (
            <SpotPlayerFrame videoId={lesson.videoId} lessonId={lesson.id} />
          )}

          <div className="mt-7">
            <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-[#8d6a55]">
              <span>جلسه {lesson.order}</span>

              <span className="h-1 w-1 rounded-full bg-[#d8c1b3]" />

              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" />
                {lesson.durationInMinutes} دقیقه
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-black md:text-4xl">
              {lesson.title}
            </h1>

            {lesson.description && (
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#716760]">
                {lesson.description}
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-[#eee5df] pt-6 sm:flex-row sm:justify-between">
            {previous ? (
              <Link
                href={`/learn/${courseSlug}/${previous.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e2d7cf] px-5 py-3 text-sm font-black text-[#554b45]"
              >
                <ArrowRight className="h-4 w-4" />
                جلسه قبلی
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link
                href={`/learn/${courseSlug}/${next.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b78b72] px-5 py-3 text-sm font-black text-white transition hover:bg-[#8d6a55]"
              >
                جلسه بعدی
                <ArrowLeft className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href={`/courses/${data.course.id}`}
                className="inline-flex items-center justify-center rounded-full bg-[#b78b72] px-5 py-3 text-sm font-black text-white transition hover:bg-[#8d6a55]"
              >
                پایان مسیر
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
