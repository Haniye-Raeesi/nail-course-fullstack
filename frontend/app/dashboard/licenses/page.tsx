"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Copy,
  Check,
  KeyRound,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  progress: number;
  enrolledAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

type License = {
  spotPlayerLicenseId: string;
  licenseKey: string;
  licenseUrl: string;
  isTest: boolean;
};

type LicenseItem = {
  course: Course;
  license: License | null;
};

export default function LicensesPage() {
  const [items, setItems] = useState<LicenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [copiedId, setCopiedId] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function loadLicenses() {
      try {
        setLoading(true);
        setError("");

        const courses = await apiFetch<Course[]>(
          "/Courses/enrolled"
        );

        const results = await Promise.all(
          courses.map(async (course) => {
            try {
              const license =
                await apiFetch<License>(
                  `/SpotPlayer/my-license/${course.id}`
                );

              return {
                course,
                license,
              };
            } catch {
              return {
                course,
                license: null,
              };
            }
          })
        );

        setItems(results);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "دریافت اطلاعات لایسنس‌ها با خطا مواجه شد."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLicenses();
  }, []);

  async function copyLicense(
    license: License
  ) {
    try {
      await navigator.clipboard.writeText(
        license.licenseKey
      );

      setCopiedId(license.spotPlayerLicenseId);

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch {
      setError("کپی کردن لایسنس امکان‌پذیر نبود.");
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f8f4f0] px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#8d6a55] shadow-sm transition hover:bg-[#f3e9e2]"
              >
                <ArrowRight className="h-5 w-5" />
              </Link>

              <div>
                <h1 className="text-2xl font-black text-[#2c2521] sm:text-3xl">
                  لایسنس‌های من
                </h1>

                <p className="mt-1 text-sm text-[#716760]">
                  لایسنس دوره‌های خریداری‌شده برای استفاده در SpotPlayer
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl border border-[#e8ddd5] bg-white p-10 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eadbd0] border-t-[#b78b72]" />

            <p className="mt-4 font-bold text-[#716760]">
              در حال دریافت لایسنس‌ها...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && items.length === 0 && (
          <div className="rounded-3xl border border-[#e8ddd5] bg-white p-10 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#f3e9e2] text-[#8d6a55]">
              <KeyRound className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-xl font-black text-[#2c2521]">
              هنوز لایسنسی ندارید
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#716760]">
              پس از خرید و تکمیل پرداخت دوره، لایسنس
              SpotPlayer برای شما ایجاد می‌شود.
            </p>

            <Link
              href="/course/my-courses"
              className="mt-6 inline-flex rounded-full bg-[#b78b72] px-6 py-3 text-sm font-black text-white transition hover:bg-[#8d6a55]"
            >
              مشاهده دوره‌ها
            </Link>
          </div>
        )}

        {/* Licenses */}
        {!loading && !error && items.length > 0 && (
          <div className="grid gap-6">
            {items.map(({ course, license }) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-3xl border border-[#e8ddd5] bg-white shadow-sm"
              >
                {/* Course header */}
                <div className="border-b border-[#eee5df] bg-[#fdfaf7] p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#f3e9e2] px-3 py-1 text-xs font-black text-[#8d6a55]">
                        <ShieldCheck className="h-4 w-4" />
                        لایسنس SpotPlayer
                      </div>

                      <h2 className="text-xl font-black text-[#2c2521]">
                        {course.title}
                      </h2>

                      <p className="mt-2 text-sm text-[#716760]">
                        {course.description}
                      </p>
                    </div>

                    <Link
                      href={`/learn/${course.slug}/30000000-0000-0000-0000-000000000001`}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#d9c8bc] px-5 py-3 text-sm font-black text-[#8d6a55] transition hover:bg-[#f3e9e2]"
                    >
                      مشاهده دوره
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* License */}
                <div className="p-6">
                  {license ? (
                    <>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-black text-[#2c2521]">
                            لایسنس آماده استفاده است
                          </h3>

                          <p className="mt-1 text-xs text-[#716760]">
                            این لایسنس به حساب کاربری شما اختصاص داده شده است.
                          </p>
                        </div>

                        {license.isTest && (
                          <span className="w-fit rounded-full bg-[#eadbd0] px-3 py-1 text-xs font-black text-[#8d6a55]">
                            نسخه تست
                          </span>
                        )}
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-[#716760]">
                            License Key
                          </span>

                          <span className="text-xs text-[#9a8c84]">
                            SpotPlayer
                          </span>
                        </div>

                        <div className="break-all rounded-2xl border border-[#e2d7cf] bg-[#faf8f6] p-4 font-mono text-xs leading-6 text-[#2c2521]">
                          {license.licenseKey}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() =>
                            copyLicense(license)
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b78b72] px-6 py-3 text-sm font-black text-white transition hover:bg-[#8d6a55]"
                        >
                          {copiedId ===
                          license.spotPlayerLicenseId ? (
                            <>
                              <Check className="h-4 w-4" />
                              کپی شد
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              کپی لایسنس
                            </>
                          )}
                        </button>
                      </div>

                      <div className="mt-5 rounded-2xl bg-[#f3e9e2] p-5">
                        <h4 className="font-black text-[#8d6a55]">
                          نحوه استفاده در SpotPlayer
                        </h4>

                        <ol className="mt-3 space-y-2 text-sm leading-7 text-[#716760]">
                          <li>
                            ۱. نرم‌افزار SpotPlayer را روی سیستم خود نصب کنید.
                          </li>

                          <li>
                            ۲. نرم‌افزار SpotPlayer را باز کنید.
                          </li>

                          <li>
                            ۳. License Key بالا را وارد کنید.
                          </li>

                          <li>
                            ۴. دوره به حساب SpotPlayer شما اضافه می‌شود.
                          </li>
                        </ol>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-[#eadfd8] bg-[#fdfaf7] p-5">
                      <div className="flex items-start gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f3e9e2] text-[#8d6a55]">
                          <KeyRound className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="font-black text-[#2c2521]">
                            لایسنس هنوز در دسترس نیست
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-[#716760]">
                            برای این دوره هنوز لایسنس فعالی پیدا نشد.
                            اگر پرداخت شما به‌تازگی تکمیل شده، کمی بعد دوباره بررسی کنید.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}