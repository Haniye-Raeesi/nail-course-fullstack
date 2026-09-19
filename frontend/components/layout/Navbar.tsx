"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X, UserRound, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { items } = useCart();

  const close = () => setOpen(false);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("auth-changed", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-changed", checkAuth);
    };
  }, []);

const handleLogout = () => {
  localStorage.removeItem("token");

  window.dispatchEvent(new Event("auth-changed"));

  setIsLoggedIn(false);
  setOpen(false);

  window.location.href = "/login";
};

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/70 bg-[#fbf8f4]/90 shadow-[0_10px_35px_rgba(57,39,29,.07)] backdrop-blur-xl">
        <div className="flex h-[68px] items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="leading-none">
            <div className="text-[17px] font-black tracking-[0.08em]">
              NAILCOURSE
            </div>

            <div className="mt-1 text-[7px] tracking-[0.35em] text-[#9b735a]">
              ACADEMY
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className="rounded-full px-4 py-2.5 text-xs font-bold text-[#8d6a55]"
            >
              صفحه اصلی
            </Link>

            <Link
              href="/courses"
              className="rounded-full px-4 py-2.5 text-xs text-[#655950] transition hover:bg-white hover:text-[#8d6a55]"
            >
              دوره‌ها
            </Link>

            <Link
              href="/#about"
              className="rounded-full px-4 py-2.5 text-xs text-[#655950] transition hover:bg-white hover:text-[#8d6a55]"
            >
              درباره ما
            </Link>

            <Link
              href="/#portfolio"
              className="rounded-full px-4 py-2.5 text-xs text-[#655950] transition hover:bg-white hover:text-[#8d6a55]"
            >
              نمونه‌کارها
            </Link>

            <Link
              href="/#about"
              className="rounded-full px-4 py-2.5 text-xs text-[#655950] transition hover:bg-white hover:text-[#8d6a55]"
            >
              مقالات
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 sm:flex">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="flex h-10 items-center gap-2 rounded-full px-4 text-xs font-medium text-[#655950] transition hover:bg-white"
                >
                  <UserRound className="h-4 w-4" />
                  ورود
                </Link>

                <Link
                  href="/register"
                  className="rounded-full bg-[#b78b72] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#8d6a55]"
                >
                  ثبت‌نام
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-10 items-center gap-2 rounded-full px-4 text-xs font-medium text-[#8d6a55] transition hover:bg-white"
              >
                <LogOut className="h-4 w-4" />
                خروج از حساب
              </button>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="سبد خرید"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#e4d9d0] bg-white text-[#211d1a]"
            >
              <ShoppingBag className="h-4 w-4" />

              {items.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8d6a55] px-1 text-[8px] text-white">
                  {items.length.toLocaleString("fa-IR")}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4d9d0] bg-white md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="border-t border-[#e9dfd7] px-4 pb-4 pt-3 md:hidden">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={close}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#655950] hover:bg-white"
              >
                صفحه اصلی
              </Link>

              <Link
                href="/courses"
                onClick={close}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#655950] hover:bg-white"
              >
                دوره‌ها
              </Link>

              <Link
                href="/#about"
                onClick={close}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#655950] hover:bg-white"
              >
                درباره ما
              </Link>

              <Link
                href="/#portfolio"
                onClick={close}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#655950] hover:bg-white"
              >
                نمونه‌کارها
              </Link>

              <Link
                href="/#about"
                onClick={close}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#655950] hover:bg-white"
              >
                آکادمی
              </Link>

              <Link
                href="/cart"
                onClick={close}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#655950] hover:bg-white"
              >
                سبد خرید
              </Link>

              {!isLoggedIn ? (
                <>
                  <Link
                    href="/login"
                    onClick={close}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-[#655950] hover:bg-white"
                  >
                    ورود
                  </Link>

                  <Link
                    href="/register"
                    onClick={close}
                    className="rounded-xl bg-[#b78b72] px-4 py-3 text-sm font-bold text-white hover:bg-[#8d6a55]"
                  >
                    ثبت‌نام
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-right text-sm font-bold text-[#8d6a55] hover:bg-white"
                >
                  <LogOut className="h-4 w-4" />
                  خروج از حساب
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
