import { LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth";
import { apiFetch } from "./api";

type JwtPayload = {
  exp?: number;
  role?: string | string[];
  [key: string]: unknown;
};

function decodeToken(): JwtPayload | null {
  const token = getToken();

  if (!token) return null;

  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payload = JSON.parse(
      atob(base64)
    ) as JwtPayload;

    return payload;
  } catch {
    return null;
  }
}

function isTokenExpired(payload: JwtPayload) {
  if (!payload.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
}

function getRoles(payload: JwtPayload): string[] {
  const role =
    payload.role ??
    payload[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];

  if (Array.isArray(role)) {
    return role;
  }

  if (typeof role === "string") {
    return [role];
  }

  return [];
}

export async function login(
  data: LoginRequest
): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  localStorage.setItem("token", result.token);
  window.dispatchEvent(new Event("auth-changed"));

  return result;
}

export async function register(
  data: RegisterRequest
): Promise<AuthResponse> {
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
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

export function hasTeacherRole() {
  const payload = decodeToken();

  if (!payload || isTokenExpired(payload)) {
    return false;
  }

  const roles = getRoles(payload);

  return (
    roles.includes("Teacher") ||
    roles.includes("Admin")
  );
}

export function isLoggedIn() {
  const payload = decodeToken();

  if (!payload || isTokenExpired(payload)) {
    return false;
  }

  return true;
}