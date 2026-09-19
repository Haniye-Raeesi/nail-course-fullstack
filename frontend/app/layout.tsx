import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { CartProvider } from "@/context/CartContext";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: {
    default: "NailCourse | آموزش حرفه‌ای ناخن",
    template: "%s | NailCourse",
  },
  description:
    "آموزش حرفه‌ای کاشت، طراحی و مهارت‌های تخصصی ناخن",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.variable}>
  <CartProvider>
    <MainLayout>{children}</MainLayout>
  </CartProvider>
</body>
    </html>
  );
}