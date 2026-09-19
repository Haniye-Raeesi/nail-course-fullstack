import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock3, Star, Users } from "lucide-react";
import type { Course } from "@/data/courses";

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR");
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-[#e8ded6] bg-white shadow-[0_16px_45px_rgba(75,52,40,.055)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(75,52,40,.11)]">
      <Link href={`/courses/${course.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#eee5de]">
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover object-center transition duration-700 group-hover:scale-[1.045]"
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#211d1a]/50 to-transparent" />
          {course.badge && (
            <span className="absolute right-4 top-4 rounded-full border border-white/60 bg-white/90 px-3.5 py-1.5 text-[10px] font-black text-[#4b3b32] shadow-sm backdrop-blur">
              {course.badge}
            </span>
          )}
          <span className="absolute bottom-4 right-4 rounded-full border border-white/50 bg-white/90 px-3.5 py-1.5 text-[10px] font-bold text-[#4b3b32] backdrop-blur">
            {course.level}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold text-[#9b735a]">{course.category}</span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-[#665950]">
            <Star className="h-3.5 w-3.5 fill-[#b78b72] text-[#b78b72]" />
            {course.rating}
          </span>
        </div>

        <h3 className="mt-3 min-h-[52px] text-[17px] font-black leading-7 text-[#211d1a]">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[48px] text-xs leading-6 text-[#857970]">
          {course.description}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-[#eee6df] pt-4 text-[10px] text-[#9b9088]">
          <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{course.duration}</span>
          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{course.students.toLocaleString("fa-IR")}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <div>
            <div className="text-lg font-black text-[#211d1a]">
              {formatPrice(course.price)} <span className="text-[9px] font-normal text-[#91847b]">تومان</span>
            </div>
            {course.oldPrice && (
              <div className="mt-1 text-[10px] text-[#aaa099] line-through">{formatPrice(course.oldPrice)} تومان</div>
            )}
          </div>
          <Link href={`/courses/${course.id}`} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#b78b72] px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-[#8d6a55]">
            مشاهده دوره <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
