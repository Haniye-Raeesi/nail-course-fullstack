"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, Star } from "lucide-react";
import type { Course } from "@/data/courses";

type Props = { course: Course };

export default function FeaturedCourse({ course }: Props) {
  return (
    <section className="relative mb-14 overflow-hidden rounded-[32px] border border-[#e7dcd3] bg-[#f7f1ec] p-6 shadow-[0_28px_80px_rgba(75,52,40,.09)] md:p-10">
      <div className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-[#d8c1b3]/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-[#efe1d7]/60 blur-3xl" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <div className="order-2 lg:order-1">
          <div className="nc-badge mb-5 w-fit gap-2 rounded-full px-4 py-2">
            <Sparkles className="h-4 w-4" />
            انتخاب ویژه NailCourse
          </div>

          <h2 className="text-3xl font-black leading-tight text-[#211d1a] md:text-5xl">{course.title}</h2>
          <p className="mt-5 max-w-xl text-sm leading-8 text-[#756961] md:text-base">{course.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-[#756961]">
            <div className="flex items-center gap-2 font-black text-[#211d1a]"><Star className="h-5 w-5 fill-[#b78b72] text-[#b78b72]" />{course.rating}</div>
            <span>{course.students.toLocaleString("fa-IR")} هنرجو</span>
            <span>{course.lessons.toLocaleString("fa-IR")} جلسه</span>
          </div>

          <Link href={`/courses/${course.id}`} className="nc-button mt-8 rounded-2xl px-7 py-4">
            مشاهده جزئیات دوره <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        <div className="order-1 flex justify-center [perspective:1200px] lg:order-2">
          <div className="relative w-full max-w-[500px] transition-transform duration-700 hover:[transform:rotateY(-5deg)_rotateX(2deg)]">
            <div className="absolute -inset-5 rounded-[40px] bg-[#b78b72]/15 blur-3xl" />
            <div className="relative rounded-[30px] border border-white/80 bg-white/65 p-3 shadow-[0_30px_70px_rgba(75,52,40,.16)] backdrop-blur-xl">
              <div className="relative aspect-[1.08/1] overflow-hidden rounded-[24px] bg-[#e9ddd4]">
                <Image src={course.image} alt={course.title} fill sizes="(max-width: 1024px) 90vw, 500px" className="object-cover object-center transition duration-700 hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#241b21]/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 right-5 left-5">
                  <span className="text-xs font-bold text-[#ead5c7]">NailCourse Premium</span>
                  <h3 className="mt-2 text-xl font-black text-white">{course.title}</h3>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 top-8 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl">
              <div className="text-[10px] text-[#9a8d84]">امتیاز دوره</div>
              <div className="mt-1 flex items-center gap-1 font-black text-[#211d1a]"><Star className="h-4 w-4 fill-[#b78b72] text-[#b78b72]" />{course.rating}</div>
            </div>

            {course.discount && (
              <div className="absolute -bottom-3 -left-3 rounded-2xl bg-[#211d1a] px-5 py-3 text-sm font-black text-white shadow-xl">{course.discount}% تخفیف</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
