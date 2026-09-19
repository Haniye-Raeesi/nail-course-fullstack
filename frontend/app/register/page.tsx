"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register({ name, email, password });
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setError("ثبت‌نام انجام نشد. اطلاعات را بررسی کنید.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 px-6 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black">ساخت حساب</h1>
          <p className="mt-3 text-sm text-gray-500">
            برای شروع یادگیری ثبت‌نام کنید
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              نام
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500"
              placeholder="نام شما"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              ایمیل
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500"
              placeholder="حداقل ۶ کاراکتر"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gray-950 py-3.5 font-semibold text-white hover:bg-pink-600 disabled:opacity-50"
          >
            {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          قبلاً حساب ساخته‌اید؟{" "}
          <Link href="/login" className="font-semibold text-pink-600">
            ورود
          </Link>
        </p>
      </div>
    </main>
  );
}