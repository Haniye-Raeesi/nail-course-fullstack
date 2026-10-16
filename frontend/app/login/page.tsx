"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const expired = searchParams.get("expired") === "true";

    const savedMessage = sessionStorage.getItem("auth-message");

    if (expired || savedMessage) {
      setNotice(
        savedMessage || "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.",
      );

      sessionStorage.removeItem("auth-message");
    }
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login({ email, password });

      sessionStorage.removeItem("auth-message");
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "خطای ناشناخته‌ای هنگام ورود رخ داد.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#fbf8f4] px-6 py-16"
    >
      <div className="w-full max-w-md rounded-3xl border border-[#eadfd7] bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-[#211d1a]">ورود</h1>

          <p className="mt-3 text-sm text-[#75685f]">
            وارد حساب NailCourse خود شوید
          </p>
        </div>

        {notice && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-[#ead7a0] bg-[#fff9e9] p-4 text-sm leading-7 text-[#795d26]"
          >
            {notice}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#51453d]">
              ایمیل
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-[#e4d9d0] px-4 py-3 outline-none transition focus:border-[#b78b72]"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#51453d]">
              رمز عبور
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-[#e4d9d0] px-4 py-3 outline-none transition focus:border-[#b78b72]"
              placeholder="رمز عبور"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#b78b72] py-3.5 font-bold text-white transition hover:bg-[#8d6a55] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "در حال ورود..." : "ورود به حساب"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#75685f]">
          حساب کاربری ندارید؟{" "}
          <Link
            href="/register"
            className="font-semibold text-[#8d6a55] hover:text-[#b78b72]"
          >
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </main>
  );
}
