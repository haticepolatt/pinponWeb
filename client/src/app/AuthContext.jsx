import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, tokenStore } from "../api/http";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/auth/refresh", { method: "POST" })
      .then((data) => {
        tokenStore.setAccessToken(data.accessToken);
        setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      async login(payload) {
        const data = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        tokenStore.setAccessToken(data.accessToken);
        setUser(data.user);
        return data;
      },
      async register(payload) {
        const data = await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        tokenStore.setAccessToken(data.accessToken);
        setUser(data.user);
        return data;
      },
      async logout() {
        await apiFetch("/auth/logout", { method: "POST" });
        tokenStore.setAccessToken(null);
        setUser(null);
      }
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
