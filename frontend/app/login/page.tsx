"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login({
        email,
        password,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      setError(
        "ورود انجام نشد. ایمیل و رمز عبور را بررسی کنید."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 px-6 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-gray-950">
            ورود
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            وارد حساب NailCourse خود شوید
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              ایمیل
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-500"
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
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-500"
              placeholder="رمز عبور"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gray-950 py-3.5 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "در حال ورود..." : "ورود به حساب"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          حساب کاربری ندارید؟{" "}
          <Link
            href="/register"
            className="font-semibold text-pink-600 hover:text-pink-700"
          >
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </main>
  );
}