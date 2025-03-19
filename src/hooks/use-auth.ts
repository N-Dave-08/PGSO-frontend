import { useState, useEffect } from "react";
import { secureStorage } from "@/lib/utils/encryption";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_img: string | null;
  role: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (
    token: string,
    userData: User,
    sessionCode: string,
    role: string
  ) => {
    await secureStorage.set("token", token);
    await secureStorage.set("user", userData);
    await secureStorage.set("sessionCode", sessionCode);
    localStorage.setItem("role", role);
    setIsAuthenticated(true);
    setUser(userData);
    window.dispatchEvent(new Event("authChange"));
  };

  const logout = async () => {
    await secureStorage.remove("token");
    await secureStorage.remove("user");
    await secureStorage.remove("sessionCode");
    localStorage.removeItem("role");
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
