"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type OrderItem = {
  courseId: string;
  courseTitle: string;
  price: number;
};

type Order = {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  paidAt?: string | null;
  items: OrderItem[];
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

function getStatus(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
      return {
        label: "پرداخت‌شده",
        className: "bg-green-50 text-green-700",
        icon: CheckCircle2,
      };

    case "pending":
      return {
        label: "در انتظار پرداخت",
        className: "bg-amber-50 text-amber-700",
        icon: Clock3,
      };

    case "failed":
      return {
        label: "ناموفق",
        className: "bg-red-50 text-red-700",
        icon: XCircle,
      };

    case "cancelled":
      return {
        label: "لغوشده",
        className: "bg-gray-100 text-gray-600",
        icon: XCircle,
      };

    default:
      return {
        label: status,
        className: "bg-[#f3e6df] text-[#8d6a55]",
        icon: Clock3,
      };
  }
}

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const result = await apiFetch<Order[]>("/orders");

        setOrders(result);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "دریافت سفارش‌ها با خطا مواجه شد.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-[calc(100vh-80px)] bg-[#fbf8f4] px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-9 w-56 rounded-xl bg-[#eadfd7]" />
            <div className="mt-3 h-5 w-80 rounded-lg bg-[#eee5df]" />

            <div className="mt-8 space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="h-40 rounded-3xl bg-white" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-[calc(100vh-80px)] bg-[#fbf8f4] px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold text-[#b78b72]">پنل کاربری</p>

            <h1 className="text-3xl font-black text-[#211d1a] sm:text-4xl">
              سفارش‌های من
            </h1>

            <p className="mt-3 text-sm leading-7 text-[#75685f]">
              تاریخچه خرید دوره‌ها و وضعیت پرداخت‌های شما
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 self-start rounded-full border border-[#e4d9d0] bg-white px-5 py-3 text-xs font-black text-[#655950] transition hover:border-[#b78b72] hover:text-[#8d6a55]"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به داشبورد
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
            <p className="font-black">خطا در دریافت سفارش‌ها</p>

            <p className="mt-2">{error}</p>
          </div>
        )}

        {/* Empty */}
        {orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#ddcfc5] bg-white px-6 py-16 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f3e6df] text-[#8d6a55]">
              <ShoppingBag className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-lg font-black text-[#211d1a]">
              هنوز سفارشی ثبت نکرده‌اید
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#8b7d74]">
              سفارش‌های شما پس از خرید دوره در این قسمت نمایش داده می‌شوند.
            </p>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-6 rounded-2xl bg-[#b78b72] px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#8d6a55]"
            >
              مشاهده دوره‌ها
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const status = getStatus(order.status);
              const StatusIcon = status.icon;

              return (
                <article
                  key={order.id}
                  className="rounded-3xl border border-[#eadfd7] bg-white p-5 shadow-[0_12px_35px_rgba(57,39,29,.04)] sm:p-6"
                >
                  {/* Order top */}
                  <div className="flex flex-col gap-4 border-b border-[#eee5df] pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#8b7d74]">
                        شماره سفارش
                      </p>

                      <p className="mt-1 break-all font-mono text-xs font-bold text-[#211d1a]">
                        {order.id}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs text-[#8b7d74]">
                        {formatDate(order.createdAt)}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${status.className}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Courses */}
                  <div className="py-5">
                    <p className="mb-3 text-xs font-bold text-[#8b7d74]">
                      دوره‌های سفارش
                    </p>

                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.courseId}
                          className="flex items-center justify-between gap-4 rounded-2xl bg-[#fbf8f4] px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f3e6df] text-[#8d6a55]">
                              <ShoppingBag className="h-4 w-4" />
                            </div>

                            <span className="text-sm font-black text-[#211d1a]">
                              {item.courseTitle}
                            </span>
                          </div>

                          <span className="shrink-0 text-xs font-bold text-[#8d6a55]">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col gap-3 border-t border-[#eee5df] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs text-[#8b7d74]">مبلغ نهایی</p>

                      <p className="mt-1 text-lg font-black text-[#211d1a]">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>

                    {order.paidAt && (
                      <p className="text-xs font-bold text-green-700">
                        پرداخت در {formatDate(order.paidAt)}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
