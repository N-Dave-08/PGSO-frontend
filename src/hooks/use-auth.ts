import { useState, useEffect } from "react";
import { secureStorage } from "@/lib/utils/encryption";
import { LoginUser } from "@/types/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (
    token: string,
    userData: LoginUser,
    sessionCode: string,
    role: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  user: LoginUser | null;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<LoginUser | null>(null);

  const login = async (
    token: string,
    userData: LoginUser,
    sessionCode: string,
    role: string
  ) => {
    try {
      await secureStorage.set("token", token);
      await secureStorage.set("user", userData);
      await secureStorage.set("sessionCode", sessionCode);
      await secureStorage.set("role", role);

      setIsAuthenticated(true);
      setUser(userData);
      window.dispatchEvent(new Event("authChange"));

      await secureStorage.get("token");
    } catch (error) {
      console.error("Error in login function:", error);
      throw error;
    }
  };

  const logout = async () => {
    await secureStorage.remove("token");
    await secureStorage.remove("user");
    await secureStorage.remove("sessionCode");
    await secureStorage.remove("role");
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await secureStorage.get("token");
        const userData = await secureStorage.get("user");

        setIsAuthenticated(!!token);
        setUser(userData);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
}
