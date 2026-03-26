import type { AuthResponse, CartItem } from "@/lib/types";

const AUTH_KEY = "bytebridgex.auth";
const CART_KEY = "bytebridgex.cart";

export function readAuthStorage(): AuthResponse | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthResponse;
  } catch {
    return null;
  }
}

export function writeAuthStorage(value: AuthResponse | null) {
  if (typeof window === "undefined") {
    return;
  }
  if (!value) {
    window.localStorage.removeItem(AUTH_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(value));
}

export function readCartStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(CART_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as CartItem[];
  } catch {
    return [];
  }
}

export function writeCartStorage(value: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(CART_KEY, JSON.stringify(value));
}
