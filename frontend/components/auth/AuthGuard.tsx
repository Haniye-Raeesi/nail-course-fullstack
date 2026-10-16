
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function isTokenInvalid(token: string): boolean {
  try {
    const payload = token.split(".")[1];

    if (!payload) return true;

    const base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const claims = JSON.parse(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")),
    );

    // JWT exp is Unix time in seconds.
    return (
      typeof claims.exp !== "number" ||
      claims.exp <= Math.floor(Date.now() / 1000)
    );
  } catch {
    return true;
  }
}

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenInvalid(token)) {
      localStorage.removeItem("token");

      sessionStorage.setItem(
        "auth-message",
        "نشست شما منقضی شده است یا اعتبار ورود ندارید. لطفاً دوباره وارد شوید.",
      );

      window.dispatchEvent(new Event("auth-changed"));
      router.replace("/login?expired=true");
      return;
    }

    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return (
      <main
        dir="rtl"
        className="grid min-h-[50vh] place-items-center bg-[#fbf8f4]"
      >
        <p className="text-sm font-bold text-[#8d6a55]">
          در حال بررسی وضعیت ورود...
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
