import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { courses } from "@/data/courses";
import CourseCard from "./CourseCard";

export default function PopularCourses() {
  const popularCourses = courses.slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

      {/* Header */}

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

      {/* Courses */}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {popularCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
          />
        ))}

      </div>

    </section>
  );
}