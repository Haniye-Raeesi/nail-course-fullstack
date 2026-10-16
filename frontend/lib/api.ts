
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5281/api";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (response.status === 401) {
    const isAuthPage =
      typeof window !== "undefined" &&
      (window.location.pathname.startsWith("/login") ||
        window.location.pathname.startsWith("/register"));

    if (token && !isAuthPage && typeof window !== "undefined") {
      localStorage.removeItem("token");

      sessionStorage.setItem(
        "auth-message",
        "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.",
      );

      window.dispatchEvent(new Event("auth-changed"));
      window.location.replace("/login?expired=true");
    }

    const message = await response.text();

    throw new Error(
      token && !isAuthPage
        ? "نشست شما منقضی شده است. لطفاً دوباره وارد شوید."
        : message || "احراز هویت ناموفق بود.",
    );
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json();
}
