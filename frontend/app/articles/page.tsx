
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "مقالات آموزشی | NailCourse",
  description:
    "راهنماهای آموزشی برای یادگیری اصول مراقبت، آماده‌سازی و طراحی ناخن.",
};

const articles = [
  {
    id: "tools",
    number: "01",
    category: "ابزار و تجهیزات",
    title: "برای شروع طراحی ناخن به چه ابزارهایی نیاز داریم؟",
    excerpt:
      "با ابزارهای پایه آشنا شو و یاد بگیر برای شروع مسیر حرفه‌ای، چه وسایلی اولویت دارند.",
    readTime: "۴ دقیقه",
  },
  {
    id: "preparation",
    number: "02",
    category: "تکنیک‌های پایه",
    title: "چرا آماده‌سازی صحیح ناخن اهمیت دارد؟",
    excerpt:
      "با مراحل اولیه آماده‌سازی ناخن و نقش اجرای صحیح آن در کیفیت نتیجه آشنا شو.",
    readTime: "۵ دقیقه",
  },
  {
    id: "durability",
    number: "03",
    category: "مراقبت از ناخن",
    title: "چطور به ماندگاری بهتر طراحی ناخن کمک کنیم؟",
    excerpt:
      "نکات مهم مربوط به اجرای اصولی، مراقبت پس از کار و کاهش آسیب به ناخن طبیعی.",
    readTime: "۵ دقیقه",
  },
];

const guides = [
  {
    id: "tools",
    number: "۰۱",
    category: "ابزار و تجهیزات",
    title: "برای شروع طراحی ناخن به چه ابزارهایی نیاز داریم؟",
    paragraphs: [
      "برای شروع یادگیری طراحی ناخن، لازم نیست تمام ابزارهای موجود در بازار را تهیه کنی. بهتر است ابتدا وسایل پایه و متناسب با دوره آموزشی خود را بشناسی و به‌تدریج تجهیزات تخصصی‌تر را اضافه کنی.",
      "ابزارهای موردنیاز بسته به تکنیک انتخابی متفاوت‌اند؛ با این حال، شناخت ابزارهای آماده‌سازی ناخن، سوهان مناسب، وسایل بهداشتی و مواد مصرفی استاندارد از قدم‌های اولیه یادگیری است.",
      "هنگام خرید، به کیفیت، کاربرد و دستورالعمل استفاده از هر وسیله توجه کن. ابزار مناسب زمانی بیشترین فایده را دارد که روش صحیح و ایمن استفاده از آن را نیز یاد گرفته باشی.",
    ],
  },
  {
    id: "preparation",
    number: "۰۲",
    category: "تکنیک‌های پایه",
    title: "چرا آماده‌سازی صحیح ناخن اهمیت دارد؟",
    paragraphs: [
      "آماده‌سازی ناخن یکی از مراحل مهم پیش از اجرای بسیاری از تکنیک‌های کاشت و طراحی است. اجرای نادرست این مرحله می‌تواند کیفیت نهایی کار را کاهش دهد و به ناخن طبیعی آسیب برساند.",
      "در این مرحله باید وضعیت ناخن بررسی شود، بهداشت رعایت شود و ابزارها متناسب با روش کار انتخاب شوند. هر مرحله باید با دقت و بدون فشار یا سایش بیش از حد انجام شود.",
      "برای یادگیری بهتر، مراحل را به‌ترتیب در یک آموزش معتبر دنبال کن و پیش از استفاده از مواد تخصصی، با محدودیت‌ها و نکات ایمنی آن‌ها آشنا شو.",
    ],
  },
  {
    id: "durability",
    number: "۰۳",
    category: "مراقبت از ناخن",
    title: "چطور به ماندگاری بهتر طراحی ناخن کمک کنیم؟",
    paragraphs: [
      "ماندگاری نتیجه به عوامل مختلفی مانند آماده‌سازی صحیح، کیفیت مواد، روش اجرا و مراقبت‌های پس از کار بستگی دارد. هیچ روش واحدی برای تضمین ماندگاری یکسان در همه افراد وجود ندارد.",
      "رعایت دستورالعمل مواد مصرفی، جلوگیری از تماس غیرضروری با مواد شیمیایی و استفاده از دستکش مناسب هنگام انجام کارهای خانگی می‌تواند به مراقبت بهتر کمک کند.",
      "اگر ناخن دچار درد، تغییر رنگ غیرعادی یا التهاب شد، بهتر است کار روی آن متوقف شود و در صورت تداوم علائم از متخصص سلامت کمک بگیری. برای برداشتن مواد نیز از کندن یا تراشیدن خشن سطح ناخن خودداری کن.",
    ],
  },
];

export default function ArticlesPage() {
  return (
    <main
      dir="rtl"
      className="overflow-hidden bg-[#fbf8f4] text-[#211d1a]"
    >
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pt-16 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#efe4da] px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#b78b72]/15 blur-3xl" />

          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#8d6a55]">
              <Sparkles className="h-4 w-4" />
              NAILCOURSE JOURNAL
            </span>

            <h1 className="mt-5 text-4xl font-black leading-relaxed sm:text-5xl">
              یاد بگیر،
              <span className="block text-[#8d6a55]">
                تمرین کن و پیشرفت کن.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-8 text-[#6d625b] sm:text-base">
              راهنماهای آموزشی و نکات کاربردی برای آشنایی با ابزارها،
              تکنیک‌های پایه و مراقبت اصولی از ناخن.
            </p>

            <Link
              href="/courses"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#b78b72] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#8d6a55]"
            >
              مشاهده دوره‌های آموزشی
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-[#9b735a]">
            LATEST GUIDES
          </span>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">
            راهنماهای آموزشی
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#83776f]">
            موضوع موردنظرت را انتخاب کن و مطلب کامل را بخوان.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <a
              key={article.id}
              href={`#${article.id}`}
              className="group flex h-full flex-col rounded-[1.5rem] border border-[#e8ddd4] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#cdb9aa] hover:shadow-xl hover:shadow-[#8d6a55]/5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2e6dc] text-sm font-black text-[#8d6a55]">
                  {article.number}
                </span>
                <BookOpen className="h-5 w-5 text-[#b78b72]" />
              </div>

              <span className="mt-6 text-xs font-bold text-[#9b735a]">
                {article.category}
              </span>

              <h3 className="mt-3 text-lg font-black leading-8 transition group-hover:text-[#8d6a55]">
                {article.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-7 text-[#83776f]">
                {article.excerpt}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-[#eee5de] pt-4">
                <span className="flex items-center gap-2 text-xs text-[#93877f]">
                  <Clock3 className="h-4 w-4" />
                  {article.readTime}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#8d6a55]">
                  مطالعه مطلب
                  <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold tracking-widest text-[#9b735a]">
            LEARNING NOTES
          </span>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">
            مطالعه مقالات
          </h2>
        </div>

        <div className="space-y-6">
          {guides.map((guide) => (
            <article
              id={guide.id}
              key={guide.id}
              className="scroll-mt-32 rounded-[1.5rem] border border-[#e8ddd4] bg-white p-6 sm:p-9"
            >
              <span className="text-xs font-bold text-[#9b735a]">
                مقاله {guide.number} · {guide.category}
              </span>

              <h2 className="mt-3 text-xl font-black leading-9 sm:text-2xl">
                {guide.title}
              </h2>

              <div className="mt-5 space-y-4">
                {guide.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-sm leading-8 text-[#74675e] sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <a
                href="#top"
                className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#8d6a55] hover:text-[#b78b72]"
              >
                بازگشت به ابتدای صفحه
                <ArrowLeft className="h-4 w-4 rotate-90" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-[#efe4da] px-6 py-10 text-center sm:px-10 sm:py-14">
          <h2 className="text-2xl font-black sm:text-3xl">
            وقت یادگیری یک مهارت تازه است؟
          </h2>
          <p className="mt-4 text-sm leading-8 text-[#74675e]">
            دوره‌های NailCourse را بررسی کن و مسیر آموزشی مناسب خودت را انتخاب کن.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#b78b72] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#8d6a55]"
          >
            دیدن دوره‌ها
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
