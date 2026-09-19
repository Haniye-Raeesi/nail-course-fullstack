const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5281/api";

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
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || `Request failed: ${response.status}`
    );
  }

  return response.json();
}