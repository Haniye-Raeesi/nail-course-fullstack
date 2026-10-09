"use client";

import { useState } from "react";
import { Check, Copy, KeyRound, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";

type SpotPlayerLicenseResponse = {
  spotPlayerLicenseId: string;
  licenseKey: string;
  licenseUrl: string;
  isTest: boolean;
};

type Props = {
  courseId: string;
};

export default function SpotPlayerLicense({ courseId }: Props) {
  const [license, setLicense] = useState<SpotPlayerLicenseResponse | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function getLicense() {
    try {
      setLoading(true);
      setError("");

      const result = await apiFetch<SpotPlayerLicenseResponse>(
        `/SpotPlayer/my-license/${courseId}`,
      );

      setLicense(result);
    } catch (error) {
      console.error("SpotPlayer license error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "دریافت لایسنس با خطا مواجه شد.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyLicense() {
    if (!license?.licenseKey) return;

    try {
      await navigator.clipboard.writeText(license.licenseKey);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("کپی کردن لایسنس امکان‌پذیر نبود.");
    }
  }

  if (!license) {
    return (
      <div
        dir="rtl"
        className="rounded-2xl border border-[#e8ddd5] bg-[#fdfaf7] p-5"
      >
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f3e9e2] text-[#8d6a55]">
            <KeyRound className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-black text-[#2c2521]">لایسنس SpotPlayer</h3>

            <p className="mt-1 text-sm leading-6 text-[#716760]">
              برای مشاهده آموزش‌ها در نرم‌افزار SpotPlayer، لایسنس دوره خود را
              دریافت کنید.
            </p>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={getLicense}
          disabled={loading}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#b78b72] px-6 py-3 text-sm font-black text-white transition hover:bg-[#8d6a55] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <KeyRound className="h-4 w-4" />

          {loading ? "در حال دریافت..." : "دریافت لایسنس"}
        </button>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="rounded-2xl border border-[#e8ddd5] bg-[#fdfaf7] p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#f3e9e2] text-[#8d6a55]">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-black">لایسنس آماده است</h3>

            <p className="mt-1 text-xs text-[#716760]">لایسنس مخصوص حساب شما</p>
          </div>
        </div>

        {license.isTest && (
          <span className="rounded-full bg-[#eadbd0] px-3 py-1 text-xs font-black text-[#8d6a55]">
            تست
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-bold text-[#716760]">License Key</p>

        <div className="break-all rounded-xl border border-[#e2d7cf] bg-white p-4 font-mono text-xs leading-6 text-[#2c2521]">
          {license.licenseKey}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyLicense}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b78b72] px-5 py-3 text-sm font-black text-white transition hover:bg-[#8d6a55]"
        >
          {copied ? (
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

      <div className="mt-5 rounded-xl bg-[#f3e9e2] p-4 text-sm leading-7 text-[#716760]">
        <p className="font-black text-[#8d6a55]">نحوه استفاده</p>

        <ol className="mt-2 space-y-1">
          <li>۱. SpotPlayer را متناسب با سیستم‌عامل خود نصب کنید.</li>
          <li>۲. نرم‌افزار را باز کنید.</li>
          <li>۳. License Key بالا را وارد کنید.</li>
          <li>۴. دوره شما در SpotPlayer فعال می‌شود.</li>
        </ol>
      </div>
    </div>
  );
}
