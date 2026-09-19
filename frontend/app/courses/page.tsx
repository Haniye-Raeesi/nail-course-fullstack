"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import CourseCard from "@/components/courses/CourseCard";
import CourseFilters from "@/components/courses/CourseFilters";
import FeaturedCourse from "@/components/courses/FeaturedCourse";
import { apiFetch } from "@/lib/api";
import type { Course } from "@/data/courses";

type ApiCourse = {
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

  lessonsCount: number;
  durationInMinutes: number;
};

function formatDuration(totalMinutes: number) {
  if (!totalMinutes || totalMinutes <= 0) {
    return "بدون زمان";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} دقیقه`;
  }

  if (minutes === 0) {
    return `${hours} ساعت`;
  }

  return `${hours} ساعت و ${minutes} دقیقه`;
}
export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("همه");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCourses() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch<ApiCourse[]>("/courses");
        const mappedCourses: Course[] = data.map((course, index) => ({
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,

          price: course.price,

          category: course.category?.name ?? "آموزش‌های تخصصی ناخن",

          level: "حرفه‌ای",

          lessons: course.lessonsCount,

          duration: formatDuration(course.durationInMinutes),

          rating: 5,

          students: 0,

          featured: index === 0,

          image: `/images/generated/courses/course-${index + 1}.jpg`,
        }));

        if (active) {
          setCourses(mappedCourses);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);

        if (active) {
          setError(
            "دریافت دوره‌ها با مشکل مواجه شد. لطفاً اتصال API را بررسی کنید.",
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

  const featuredCourse = useMemo(() => {
    return courses.find((course) => course.featured) ?? courses[0] ?? null;
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const category = course.category;

      const categoryMatch =
        activeCategory === "همه" || category === activeCategory;

      const searchMatch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [courses, search, activeCategory]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="nc-section pt-14 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="nc-badge px-4 py-2">NailCourse Academy</span>

          <h1 className="mt-5 text-4xl font-black leading-tight text-gray-900 md:text-6xl">
            دوره‌های
            <span className="nc-gradient-text mr-2">حرفه‌ای ناخن</span>
          </h1>

          <p className="mt-5 text-sm leading-8 text-gray-500 md:text-base">
            مهارت‌های حرفه‌ای ناخن را با دوره‌های تخصصی و کاربردی یاد بگیر و
            مسیر حرفه‌ای خودت را شروع کن.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="nc-section py-12">
        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eadbd1] border-t-[#b78b72]" />

            <p className="mt-5 text-sm font-bold text-gray-500">
              در حال دریافت دوره‌ها...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mx-auto max-w-2xl rounded-3xl border border-red-100 bg-red-50 px-6 py-10 text-center">
            <div className="text-lg font-black text-red-800">
              دریافت دوره‌ها ناموفق بود
            </div>

            <p className="mt-3 text-sm leading-7 text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="
                mt-6
                rounded-full
                bg-[#b78b72]
                px-6
                py-3
                text-sm
                font-black
                text-white
                transition
                hover:bg-[#8d6a55]
              "
            >
              تلاش دوباره
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && courses.length > 0 && (
          <>
            {/* Featured */}
            {featuredCourse && <FeaturedCourse course={featuredCourse} />}

            {/* Search */}
            <div className="mx-auto mb-8 max-w-3xl">
              <div className="relative">
                <Search
                  className="
                    absolute
                    right-5
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    text-[#b78b72]
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجوی دوره، طراحی ناخن، ژل پولیش..."
                  className="
                    h-16
                    w-full
                    rounded-2xl
                    border
                    border-[#e6dcd4]
                    bg-white/70
                    pr-14
                    pl-5
                    text-gray-800
                    shadow-[0_15px_40px_rgba(75,52,40,.06)]
                    outline-none
                    backdrop-blur-xl
                    transition
                    placeholder:text-gray-400
                    focus:border-[#b78b72]
                    focus:ring-4
                    focus:ring-[#efe1d7]
                  "
                />
              </div>
            </div>

            {/* Filters */}
            <div className="mb-10">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700">
                <SlidersHorizontal className="h-5 w-5 text-[#8d6a55]" />
                دسته‌بندی دوره‌ها
              </div>

              <CourseFilters
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </div>

            {/* Title */}
            <div className="mb-7 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  همه دوره‌ها
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  بهترین دوره‌ها برای پیشرفت حرفه‌ای
                </p>
              </div>

              <div className="nc-badge px-3 py-2">
                {filteredCourses.length.toLocaleString("fa-IR")} دوره
              </div>
            </div>

            {/* Courses */}
            {filteredCourses.length > 0 ? (
              <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="nc-card py-20 text-center">
                <div className="text-xl font-black text-gray-800">
                  دوره‌ای پیدا نشد
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  عبارت جستجو یا دسته‌بندی دیگری را امتحان کنید.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("همه");
                  }}
                  className="
                    mt-6
                    rounded-full
                    bg-[#b78b72]
                    px-6
                    py-3
                    text-sm
                    font-black
                    text-white
                    transition
                    hover:bg-[#8d6a55]
                  "
                >
                  نمایش همه دوره‌ها
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty API */}
        {!loading && !error && courses.length === 0 && (
          <div className="nc-card py-20 text-center">
            <div className="text-xl font-black text-gray-800">
              هنوز دوره‌ای منتشر نشده است
            </div>

            <p className="mt-2 text-sm text-gray-500">
              به‌زودی دوره‌های آموزشی در این بخش قرار می‌گیرند.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
