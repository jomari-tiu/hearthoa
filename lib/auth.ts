"use client";

import { api } from "./api";

export const AUTH_COOKIE = "hh_token";

export type TCurrentUser = {
  id: string;
  email: string;
  name: string;
  role: "resident" | "admin";
  hoaId: string;
};

export async function loginRequest(email: string, password: string): Promise<TCurrentUser> {
  const res = await api.post<{ user: TCurrentUser }>("/auth/login", { email, password });
  return res.data.user;
}

export async function logoutRequest(): Promise<void> {
  await api.post("/auth/logout", {});
}

export async function fetchCurrentUser(): Promise<TCurrentUser | null> {
  try {
    const res = await api.get<TCurrentUser>("/auth/me");
    return res.data;
  } catch {
    return null;
  }
}
