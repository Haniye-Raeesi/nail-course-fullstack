import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Award,
  Heart,
  Sparkles,
  Video,
  Clock3,
} from "lucide-react";

export const metadata = {
  title: "درباره ما | NailCourse",
  description:
    "با آکادمی NailCourse، مسیر آموزش تخصصی طراحی و کاشت ناخن را بشناسید.",
};

const features = [
  {
    icon: BookOpen,
    title: "آموزش مرحله‌به‌مرحله",
    description:
      "از یادگیری اصول اولیه تا اجرای تکنیک‌های تخصصی، با مسیر آموزشی منظم پیش برو.",
  },
  {
    icon: Video,
    title: "آموزش تصویری دقیق",
    description:
      "جزئیات اجرای تکنیک‌ها را در ویدئوهای آموزشی دنبال کن و آموخته‌هایت را تمرین کن.",
  },
  {
    icon: Clock3,
    title: "یادگیری با زمان‌بندی دلخواه",
    description:
      "در هر زمان به دوره‌های خودت دسترسی داشته باش و متناسب با برنامه‌ات یاد بگیر.",
  },
  {
    icon: Award,
    title: "تمرکز بر مهارت عملی",
    description:
      "هدف ما کمک به تبدیل آموخته‌ها به مهارت‌هایی کاربردی برای اجرای بهتر است.",
  },
];

export default function AboutPage() {
  return (
    <main dir="rtl" className="overflow-hidden bg-[#fbf8f4] text-[#211d1a]">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pt-16 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#efe4da] px-6 py-14 sm:px-12 sm:py-20 lg:px-16">
          <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-[#b78b72]/15 blur-3xl" />
          <div className="absolute -bottom-24 right-1/3 h-64 w-64 rounded-full bg-white/60 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#8d6a55]">
              <Sparkles className="h-4 w-4" />
              ABOUT NAILCOURSE
            </span>

            <h1 className="mt-5 text-4xl font-black leading-relaxed sm:text-5xl lg:text-6xl">
              اینجا، مسیر حرفه‌ای شدن
              <span className="block text-[#8d6a55]">
                از یادگیری آغاز می‌شود.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#6d625b] sm:text-base">
              NailCourse فضایی برای یادگیری تخصصی طراحی و کاشت ناخن است؛ جایی که
              می‌توانی با آموزش‌های تصویری و تمرین مستمر، قدم‌به‌قدم مهارت‌های
              خودت را توسعه بدهی.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-full bg-[#b78b72] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#8d6a55]"
              >
                مشاهده دوره‌ها
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-[#cdb9aa] bg-white/60 px-6 py-3.5 text-sm font-bold text-[#655950] transition hover:bg-white"
              >
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-16">
        <div className="relative min-h-[300px] overflow-hidden rounded-[2rem] bg-[#eee3d9] sm:min-h-[420px]">
          <Image
            src="/images/generated/gel.jpg"
            alt="فضای آموزش و اجرای تکنیک‌های ناخن"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/60 bg-white/85 p-4 backdrop-blur-md sm:inset-x-6 sm:bottom-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f0e5dc] text-[#8d6a55]">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <p className="font-black">یادگیری با علاقه و تمرین</p>
                <p className="mt-1 text-xs text-[#83776f]">
                  هر مهارت، با قدم‌های کوچک ساخته می‌شود.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold tracking-widest text-[#9b735a]">
            OUR STORY
          </span>
          <h2 className="mt-3 text-3xl font-black leading-relaxed sm:text-4xl">
            درباره آکادمی
            <span className="text-[#8d6a55]"> NailCourse</span>
          </h2>

          <p className="mt-5 text-sm leading-8 text-[#74675e] sm:text-base">
            یادگیری یک هنر تخصصی فقط به دیدن نتیجه نهایی محدود نمی‌شود. شناخت
            ابزارها، درک مراحل اجرا و تمرین درست، بخش مهمی از مسیر پیشرفت هستند.
          </p>

          <p className="mt-4 text-sm leading-8 text-[#74675e] sm:text-base">
            در NailCourse تلاش می‌کنیم آموزش‌ها ساختارمند و قابل دنبال‌کردن
            باشند تا هنرجو بتواند متناسب با سطح خود یاد بگیرد، تمرین کند و
            مهارت‌هایش را به‌مرور ارتقا دهد.
          </p>

          <div className="mt-7 h-1 w-20 rounded-full bg-[#b78b72]" />
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#f2ebe3] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold tracking-widest text-[#9b735a]">
              OUR APPROACH
            </span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              تجربه یادگیری در آکادمی
            </h2>
            <p className="mt-4 text-sm leading-8 text-[#83776f]">
              فضایی برای یادگیری منظم، تمرین مستمر و حرکت به‌سوی مهارت بیشتر.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-[1.5rem] border border-[#e7d9ce] bg-white/80 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#8d6a55]/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2e6dc] text-[#8d6a55]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#83776f]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] border border-[#e8ddd4] bg-white p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:p-10">
          <div className="relative min-h-[300px] overflow-hidden rounded-[1.5rem] bg-[#eee3d9] sm:min-h-[380px]">
            <Image
              src="/images/generated/instructor.jpg"
              alt="مدرس آکادمی NailCourse"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

          <div className="py-3 lg:py-8">
            <span className="text-xs font-bold tracking-widest text-[#9b735a]">
              MEET THE INSTRUCTOR
            </span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              مدرس آکادمی
            </h2>
            <h3 className="mt-3 text-xl font-bold text-[#8d6a55]">
              نیلوفر محلاتی
            </h3>
            <p className="mt-5 text-sm leading-8 text-[#74675e] sm:text-base">
              رویکرد آموزشی آکادمی بر توضیح مرحله‌به‌مرحله تکنیک‌ها و کمک به
              هنرجو برای درک بهتر فرایند اجرا متمرکز است. هدف این است که
              یادگیری، فراتر از تماشای ویدئو باشد و با تمرین به مهارت عملی تبدیل
              شود.
            </p>

            <Link
              href="/courses"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#b78b72] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#8d6a55]"
            >
              شروع یادگیری
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-[#e9dfd5] px-6 py-12 text-center sm:px-10 sm:py-16">
          <Sparkles className="mx-auto h-7 w-7 text-[#8d6a55]" />
          <h2 className="mt-5 text-2xl font-black sm:text-3xl">
            آماده‌ای مسیر یادگیری را شروع کنی؟
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-[#74675e]">
            دوره‌ها را بررسی کن و آموزش متناسب با مسیر پیشرفتت را انتخاب کن.
          </p>
          <Link
            href="/courses"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#b78b72] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#8d6a55]"
          >
            دیدن دوره‌های آموزشی
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
