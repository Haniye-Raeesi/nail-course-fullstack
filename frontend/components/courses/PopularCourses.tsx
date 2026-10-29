"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { Course } from "@/data/courses";
import CourseCard from "./CourseCard";

type ApiCourse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnailUrl?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  lessonsCount: number;
  durationInMinutes: number;
};

function formatDuration(minutes: number) {
  if (!minutes || minutes <= 0) return "بدون زمان";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) return `${remainingMinutes} دقیقه`;
  if (!remainingMinutes) return `${hours} ساعت`;

  return `${hours} ساعت و ${remainingMinutes} دقیقه`;
}

export default function PopularCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCourses() {
      try {
        const data = await apiFetch<ApiCourse[]>("/courses");

        const mappedCourses: Course[] = data.map((course, index) => ({
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description ?? "",
          price: course.price,
          category: course.category?.name ?? "آموزش‌های تخصصی ناخن",
          level: "حرفه‌ای",
          lessons: course.lessonsCount ?? 0,
          duration: formatDuration(course.durationInMinutes),
          rating: 5,
          students: 0,
          featured: index === 0,
   image: `/images/generated/courses/course-${index + 1}.jpg`,
        }));

        if (active) setCourses(mappedCourses.slice(0, 4));
      } catch (err) {
        console.error("Failed to load popular courses:", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCourses();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-bold text-pink-500">
            محبوب‌ترین دوره‌ها
          </span>

          <h2 className="mt-2 text-2xl font-black text-[#211b1d] sm:text-3xl">
            دوره‌ای که هنرجوها بیشتر دوست دارند
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-7 text-gray-500">
            بهترین دوره‌های NailCourse را بر اساس محبوبیت و رضایت هنرجویان انتخاب کرده‌ایم.
          </p>
        </div>

        <Link
          href="/courses"
          className="group flex w-fit items-center text-xs font-bold text-pink-600"
        >
          مشاهده همه دوره‌ها
          <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-gray-500">
          در حال دریافت دوره‌ها...
        </p>
      ) : error ? (
        <p className="py-10 text-center text-sm text-red-600">
          دریافت دوره‌ها ناموفق بود. اتصال API را بررسی کن.
        </p>
      ) : courses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-gray-500">
          هنوز دوره‌ای برای نمایش منتشر نشده است.
        </p>
      )}
    </section>
  );
}
