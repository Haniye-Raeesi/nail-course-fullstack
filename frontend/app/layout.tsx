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
  metadataBase: new URL("http://localhost:3000"),

  title: {
    default: "NailCourse | آموزش حرفه‌ای ناخن",
    template: "%s | NailCourse",
  },

  description:
    "NailCourse پلتفرم آموزش حرفه‌ای ناخن، کاشت، طراحی و مهارت‌های تخصصی ناخن.",

  keywords: [
    "آموزش ناخن",
    "آموزش کاشت ناخن",
    "آموزش طراحی ناخن",
    "دوره آموزش ناخن",
    "NailCourse",
  ],

  authors: [
    {
      name: "NailCourse",
    },
  ],

  creator: "NailCourse",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "NailCourse",
    title: "NailCourse | آموزش حرفه‌ای ناخن",
    description:
      "آموزش حرفه‌ای کاشت، طراحی و مهارت‌های تخصصی ناخن",
  },

  twitter: {
    card: "summary_large_image",
    title: "NailCourse | آموزش حرفه‌ای ناخن",
    description:
      "آموزش حرفه‌ای کاشت، طراحی و مهارت‌های تخصصی ناخن",
  },
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