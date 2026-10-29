"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { apiFetch } from "@/lib/api";

function SandboxPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId");
  const authority = searchParams.get("authority");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!orderId || !authority || loading) return;

    setLoading(true);
    setError("");

    try {
      await apiFetch(
        `/payments/verify/${orderId}?authority=${encodeURIComponent(authority)}`,
      );

      router.push("/");
    } catch (error) {
      console.error("Payment verification error:", error);

      setError(
        error instanceof Error ? error.message : "تأیید پرداخت ناموفق بود.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#f8f3ef] p-5"
    >
      <section className="w-full max-w-md rounded-3xl border border-[#e8ded6] bg-white p-8 text-center shadow-lg">
        <h1 className="text-2xl font-black text-[#4b3b32]">پرداخت آزمایشی</h1>

        <p className="mt-4 text-sm leading-7 text-[#857970]">
          این صفحه صرفاً برای آزمایش فرایند خرید دوره طراحی شده است و پرداخت
          واقعی انجام نمی‌دهد.
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handlePayment}
          disabled={loading || !orderId || !authority}
          className="mt-6 w-full rounded-2xl bg-[#b78b72] px-6 py-4 font-bold text-white transition hover:bg-[#8d6a55] disabled:opacity-60"
        >
          {loading ? "در حال بررسی..." : "تأیید پرداخت آزمایشی"}
        </button>
      </section>
    </main>
  );
}

export default function SandboxPaymentPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">در حال بارگذاری...</div>}
    >
      <SandboxPaymentContent />
    </Suspense>
  );
}
