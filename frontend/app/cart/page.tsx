"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart();

  if (items.length === 0) {
    return (
      <main className="nc-section py-20">
        <div className="nc-card mx-auto max-w-2xl p-12 text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-pink-50">
            <ShoppingBag className="h-9 w-9 text-pink-500" />
          </div>

          <h1 className="mt-6 text-2xl font-black text-gray-900">
            سبد خرید شما خالی است
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            دوره مورد علاقه‌ات را انتخاب کن و یادگیری را شروع کن.
          </p>

          <Link
            href="/courses"
            className="nc-button mt-7 rounded-2xl px-7 py-4"
          >
            مشاهده دوره‌ها
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="nc-section py-12">

      <Link
        href="/courses"
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-pink-500"
      >
        <ArrowRight className="h-4 w-4" />
        ادامه خرید
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">
          سبد خرید
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {items.length.toLocaleString("fa-IR")} دوره در سبد خرید شما
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">

        {/* Items */}
        <div className="space-y-4">

          {items.map((course) => (
            <div
              key={course.id}
              className="nc-card flex flex-col gap-5 p-4 sm:flex-row sm:items-center"
            >
              <img
                src={course.image}
                alt={course.title}
                className="h-32 w-full rounded-2xl object-cover sm:w-48"
              />

              <div className="flex-1">

                <span className="nc-badge px-3 py-1">
                  {course.category}
                </span>

                <h2 className="mt-3 text-lg font-black text-gray-900">
                  {course.title}
                </h2>

                <div className="mt-2 text-lg font-black text-pink-600">
                  {course.price.toLocaleString("fa-IR")}
                  <span className="mr-1 text-xs text-gray-400">
                    تومان
                  </span>
                </div>

              </div>

              <button
                type="button"
                onClick={() => removeFromCart(course.id)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100"
                aria-label="حذف دوره"
              >
                <Trash2 className="h-5 w-5" />
              </button>

            </div>
          ))}

          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-bold text-red-500 hover:text-red-600"
          >
            حذف همه دوره‌ها
          </button>

        </div>

        {/* Summary */}
        <aside className="nc-card h-fit p-6">

          <h2 className="text-xl font-black text-gray-900">
            خلاصه سفارش
          </h2>

          <div className="my-6 h-px bg-pink-100" />

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              تعداد دوره
            </span>

            <span className="font-bold text-gray-800">
              {items.length.toLocaleString("fa-IR")}
            </span>
          </div>

          <div className="mt-4 flex justify-between">
            <span className="font-bold text-gray-700">
              مبلغ نهایی
            </span>

            <span className="text-xl font-black text-pink-600">
              {totalPrice.toLocaleString("fa-IR")}
              <span className="mr-1 text-xs text-gray-400">
                تومان
              </span>
            </span>
          </div>

          <Link
            href="/checkout"
            className="nc-button mt-7 w-full rounded-2xl py-4"
          >
            ادامه و پرداخت
          </Link>

        </aside>
      </div>
    </main>
  );
}