"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Clock3,
  Headphones,
  Sparkles,
  Star,
  Users,
  Video,
} from "lucide-react";

import { courses } from "@/data/courses";
import CourseCard from "@/components/courses/CourseCard";

const portfolio = [
  ["/images/generated/portfolio/work-1.jpg", "کاشت ظریف و طبیعی"],
  ["/images/generated/portfolio/work-2.jpg", "طراحی هنری"],
  ["/images/generated/portfolio/work-3.jpg", "ژل و متریال"],
  ["/images/generated/portfolio/work-4.jpg", "طراحی ترند"],
  ["/images/generated/portfolio/work-5.jpg", "مراقبت حرفه‌ای"],
  ["/images/generated/portfolio/work-6.jpg", "نگاه حرفه‌ای به کسب‌وکار"],
] as const;

const benefits = [
  { icon: BookOpen, title: "مسیر آموزشی مشخص", text: "از مبانی تا تکنیک‌های حرفه‌ای، قدم‌به‌قدم." },
  { icon: Video, title: "ویدئوهای باکیفیت", text: "جزئیات اجرای تکنیک‌ها را واضح و دقیق ببین." },
  { icon: Award, title: "آموزش پروژه‌محور", text: "یادگیری با تمرین و اجرای واقعی ماندگار می‌شود." },
  { icon: Clock3, title: "یادگیری با سرعت خودت", text: "هر زمان که بخواهی درس‌ها را ادامه بده." },
];

const testimonials = [
  ["سارا محمدی", "دوره طراحی ناخن", "توضیحات دوره خیلی منظم بود و بالاخره توانستم تکنیک‌هایی را که برایم سخت بود اجرا کنم."],
  ["مریم رضایی", "دوره کاشت ناخن", "دوره‌ها هم از نظر کیفیت تصویر و هم از نظر ترتیب آموزش واقعاً حرفه‌ای طراحی شده‌اند."],
  ["نگار کریمی", "دوره ژل و طراحی", "پشتیبانی ویدئوها عالی بود و بعد از تمرین توانستم نمونه‌کارهای حرفه‌ای‌تری بسازم."],
];

export default function HomePage() {
  const featured = courses.slice(0, 4);

  return (
    <main dir="rtl" className="overflow-hidden bg-[#fbf8f4] text-[#211d1a]">
      {/* HERO */}
      <section className="mx-auto max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
        <div className="relative isolate min-h-[620px] overflow-hidden rounded-[2rem] bg-[#e9dfd5] shadow-[0_30px_90px_rgba(57,39,29,0.12)] sm:min-h-[680px] lg:min-h-[720px] lg:rounded-[2.75rem]">
          <Image
            src="/images/generated/hero.jpg"
            alt="نمونه طراحی حرفه‌ای ناخن"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#f9f4ee]/98 via-[#f9f4ee]/88 to-transparent lg:from-[#f9f4ee]/95 lg:via-[#f9f4ee]/72 lg:to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(183,139,114,.18),transparent_30%)]" />

          <div className="relative z-10 flex min-h-[620px] items-center px-7 py-16 sm:min-h-[680px] sm:px-12 lg:min-h-[720px] lg:px-20">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] text-[#9b735a]">
                <Sparkles className="h-3.5 w-3.5" />
                NAIL ART ACADEMY
              </span>

              <h1 className="mt-5 text-4xl font-black leading-[1.25] tracking-tight sm:text-5xl lg:text-[4.4rem]">
                هنر ناخن را
                <br />
                <span className="text-[#8d6a55]">حرفه‌ای یاد بگیر.</span>
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-8 text-[#6d625b] sm:text-base">
                آموزش تخصصی طراحی و اجرای ناخن، از پایه تا سطح حرفه‌ای؛ با مسیر یادگیری ساختاریافته و تمرین‌های واقعی.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/courses" className="group inline-flex items-center gap-3 rounded-full bg-[#b78b72] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#8d6a55]">
                  مشاهده دوره‌ها
                  <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                </Link>
                <a href="#about" className="inline-flex items-center gap-2 rounded-full border border-[#bca28f] bg-white/50 px-6 py-3.5 text-sm font-bold text-[#4d423b] backdrop-blur-sm transition hover:bg-white">
                  درباره آکادمی
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-8 border-t border-[#8d6a55]/15 pt-6">
                <div><strong className="block text-lg font-black">۴.۹/۵</strong><span className="text-xs text-[#85776d]">رضایت هنرجویان</span></div>
                <div><strong className="block text-lg font-black">+۵۰۰</strong><span className="text-xs text-[#85776d]">هنرجوی فعال</span></div>
                <div><strong className="block text-lg font-black">۱۰+</strong><span className="text-xs text-[#85776d]">دوره تخصصی</span></div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-7 left-7 hidden rounded-2xl border border-white/60 bg-white/75 px-4 py-3 shadow-xl backdrop-blur-xl sm:block lg:left-12">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#211d1a] text-white"><Users className="h-4 w-4" /></div>
              <div><div className="text-sm font-black">+۵۰۰</div><div className="text-[10px] text-[#82766d]">هنرجوی فعال</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-2xl border border-[#e9e0d8] bg-white/80 sm:grid-cols-4">
          {[
            [Award, "آموزش تخصصی", "محتوای کاربردی"],
            [BookOpen, "پروژه‌محور", "تمرین واقعی"],
            [Video, "دسترسی آنلاین", "هر زمان و هرجا"],
            [Headphones, "پشتیبانی آموزشی", "همراه مسیر یادگیری"],
          ].map(([Icon, title, text], index) => {
            const I = Icon as typeof Award;
            return <div key={String(title)} className={`flex items-center gap-3 p-5 ${index ? "border-t sm:border-r sm:border-t-0" : ""} border-[#e9e0d8]`}>
              <I className="h-5 w-5 shrink-0 text-[#9b735a]" />
              <div><div className="text-xs font-black">{title as string}</div><div className="mt-1 text-[10px] text-[#93877f]">{text as string}</div></div>
            </div>;
          })}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#9b735a]">FEATURED COURSES</span>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">دوره‌های منتخب</h2>
            <p className="mt-2 text-sm text-[#83776f]">مسیر یادگیری خودت را از اینجا شروع کن.</p>
          </div>
          <Link href="/courses" className="hidden items-center gap-2 text-xs font-bold text-[#8d6a55] sm:flex">مشاهده همه دوره‌ها <ArrowLeft className="h-4 w-4" /></Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((course) => <CourseCard key={course.id} course={course} />)}
        </div>
      </section>

      {/* WHY */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] border border-[#e8ddd4] bg-[#f2ebe3] lg:grid-cols-[.8fr_1.2fr]">
          <div className="relative min-h-[280px] lg:min-h-full">
            <Image src="/images/generated/gel.jpg" alt="ابزار و اجرای حرفه‌ای ناخن" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
          </div>
          <div className="p-7 sm:p-10 lg:p-12">
            <span className="text-[11px] font-bold tracking-widest text-[#9b735a]">WHY NAILCOURSE</span>
            <h2 className="mt-3 text-3xl font-black">چرا NailCourse؟</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {benefits.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d6c2b1] bg-white/70 text-[#8d6a55]"><Icon className="h-4 w-4" /></div>
                <div><h3 className="text-sm font-black">{title}</h3><p className="mt-1 text-xs leading-6 text-[#81746b]">{text}</p></div>
              </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING JOURNEY */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-[11px] font-bold tracking-widest text-[#9b735a]">LEARNING JOURNEY</span>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">مسیر یادگیری</h2>
          <p className="mt-2 text-sm text-[#83776f]">قدم‌به‌قدم تا اجرای حرفه‌ای.</p>
        </div>
        <div className="mt-9 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {["شروع", "مقدماتی", "تکنیک‌های پایه", "طراحی حرفه‌ای", "تمرین و پروژه", "سطح حرفه‌ای"].map((step, i) => <div key={step} className="relative rounded-2xl border border-[#e9dfd7] bg-white p-5 text-center shadow-sm">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#f0e5dc] text-xs font-black text-[#8d6a55]">{String(i + 1).padStart(2, "۰")}</span>
            <div className="mt-3 text-xs font-black">{step}</div>
            {i < 5 && <ArrowLeft className="absolute -left-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-[#c5aa96] lg:block" />}
          </div>)}
        </div>
      </section>

      {/* INSTRUCTOR */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 rounded-[2rem] border border-[#e8ddd4] bg-white p-5 sm:p-8 lg:grid-cols-[.75fr_1.25fr] lg:p-10">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#e9dfd5]">
            <Image src="/images/generated/instructor.jpg" alt="مدرس NailCourse" fill sizes="(max-width: 1024px) 100vw, 35vw" className="object-cover" />
          </div>
          <div className="lg:pr-5">
            <span className="text-[11px] font-bold tracking-widest text-[#9b735a]">ABOUT THE INSTRUCTOR</span>
            <h2 className="mt-2 text-3xl font-black">نیلوفر محلاتی</h2>
            <p className="mt-2 text-sm font-bold text-[#6d6058]">متخصص آموزش و اجرای حرفه‌ای طراحی و تکنیک‌های ناخن</p>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#83776f]">با تمرکز بر آموزش مرحله‌به‌مرحله، تلاش می‌کنیم یادگیری فقط به تماشای ویدئو محدود نشود؛ بلکه هر درس به مهارتی قابل اجرا تبدیل شود.</p>
            <Link href="#about" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#b78b72] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#8d6a55]">بیشتر درباره مدرس <ArrowLeft className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between">
          <div><span className="text-[11px] font-bold tracking-widest text-[#9b735a]">PORTFOLIO</span><h2 className="mt-2 text-2xl font-black sm:text-3xl">نمونه‌کارها</h2><p className="mt-2 text-sm text-[#83776f]">بخشی از تکنیک‌ها و استایل‌هایی که در دوره‌ها یاد می‌گیری.</p></div>
          <Link href="#portfolio" className="hidden items-center gap-2 text-xs font-bold text-[#8d6a55] sm:flex">مشاهده گالری <ArrowLeft className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {portfolio.map(([src, alt]) => <div key={src} className="group relative aspect-square overflow-hidden rounded-2xl bg-[#eee5de]"><Image src={src} alt={alt} fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-x-2 bottom-2 translate-y-2 rounded-xl bg-black/45 px-2 py-2 text-center text-[10px] font-bold text-white opacity-0 backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100">{alt}</div></div>)}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center"><span className="text-[11px] font-bold tracking-widest text-[#9b735a]">STUDENT STORIES</span><h2 className="mt-2 text-2xl font-black sm:text-3xl">تجربه هنرجوها</h2><p className="mt-2 text-sm text-[#83776f]">چیزی که هنرجوها درباره مسیر یادگیری می‌گویند.</p></div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map(([name, course, text]) => <article key={name} className="rounded-[1.5rem] border border-[#e9dfd7] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between"><div className="text-xs font-black">{name}</div><div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-[#b78b72] text-[#b78b72]" />)}</div></div>
            <div className="mt-1 text-[10px] text-[#a0938a]">{course}</div>
            <p className="mt-5 text-xs leading-7 text-[#6f6259]">«{text}»</p>
          </article>)}
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 divide-x divide-[#e7ddd4] overflow-hidden rounded-2xl border border-[#e7ddd4] bg-white sm:grid-cols-4">
          {[['۴.۹/۵','رضایت هنرجویان'], ['۱۰+','دوره تخصصی'], ['۲۰+','ساعت آموزش'], ['۵۰۰+','هنرجوی فعال']].map(([value,label]) => <div key={label} className="px-4 py-6 text-center first:border-0"><div className="text-xl font-black">{value}</div><div className="mt-1 text-[10px] text-[#8f8177]">{label}</div></div>)}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#211d1a] px-6 py-12 text-center text-white sm:px-10">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url('/images/generated/trendy.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-[#211d1a]/75" />
          <div className="relative">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#dfc5b2]">START YOUR JOURNEY</span>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">آماده‌ای مهارتت را حرفه‌ای کنی؟</h2>
            <p className="mx-auto mt-3 max-w-lg text-xs leading-7 text-white/65">مسیر یادگیری خودت را با یک دوره مناسب شروع کن.</p>
            <Link href="/courses" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-black text-[#211d1a] transition hover:bg-[#ead6c6]">مشاهده دوره‌ها <ArrowLeft className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* accessibility anchor target */}
      <div id="contact" className="h-0" aria-hidden="true" />
    </main>
  );
}
