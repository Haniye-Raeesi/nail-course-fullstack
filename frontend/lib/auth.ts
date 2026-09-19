import { LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth";
import { apiFetch } from "./api";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  localStorage.setItem("token", result.token);
  window.dispatchEvent(new Event("auth-changed"));

  return result;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  localStorage.setItem("token", result.token);
  window.dispatchEvent(new Event("auth-changed"));

  return result;
}
export function logout() {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("auth-changed"));
}
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function hasTeacherRole() {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    const role =
      payload.role ??
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return (
      role === "Teacher" ||
      role === "Admin" ||
      (Array.isArray(role) &&
        (role.includes("Teacher") || role.includes("Admin")))
    );
  } catch {
    return false;
  }
}
