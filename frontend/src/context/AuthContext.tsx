import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, TokenKey, UnauthorizedEvent, UserKey } from "../api/Client";
import { AuthResult, User } from "../types/Models";

interface AuthContextValue {
  User: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, storeName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(UserKey);
    return raw && localStorage.getItem(TokenKey) ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);

  const persist = useCallback((result: AuthResult) => {
    localStorage.setItem(TokenKey, result.Token);
    localStorage.setItem(UserKey, JSON.stringify(result.User));
    setUser(result.User);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TokenKey);
    localStorage.removeItem(UserKey);
    setUser(null);
  }, []);

  useEffect(() => {
    window.addEventListener(UnauthorizedEvent, logout);
    return () => window.removeEventListener(UnauthorizedEvent, logout);
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      User: user,
      login: async (email, password) => persist(await api.login({ Email: email, Password: password })),
      register: async (name, storeName, email, password) =>
        persist(await api.register({ Name: name, StoreName: storeName, Email: email, Password: password })),
      logout,
    }),
    [user, persist, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return context;
}
