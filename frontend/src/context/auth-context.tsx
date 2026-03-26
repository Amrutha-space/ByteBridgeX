"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { api } from "@/lib/api";
import { readAuthStorage, writeAuthStorage } from "@/lib/storage";
import type { AuthResponse, User, UserRole } from "@/lib/types";

type SignupPayload = {
  email: string;
  username: string;
  password: string;
  role: UserRole;
};

type AuthContextValue = {
  auth: AuthResponse | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = readAuthStorage();
    setAuth(storedAuth);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/login/", {
      email,
      password,
    });
    setAuth(response.data);
    writeAuthStorage(response.data);
  };

  const signup = async (payload: SignupPayload) => {
    await api.post("/auth/signup/", payload);
    await login(payload.email, payload.password);
  };

  const logout = () => {
    setAuth(null);
    writeAuthStorage(null);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        user: auth?.user ?? null,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
