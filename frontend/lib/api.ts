const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5281/api";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers ?? {}),
    },
  });

  // JWT منقضی یا نامعتبر شده است
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");

      // اگر قبلاً در صفحه login نیستیم
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?expired=true";
      }
    }

    throw new Error(
      "جلسه ورود شما منقضی شده است. لطفاً دوباره وارد شوید."
    );
  }

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      text || `Request failed: ${response.status}`
    );
  }

  return response.json();
}