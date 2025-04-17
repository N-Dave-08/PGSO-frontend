import { useState, useEffect } from "react";
import { secureStorage } from "@/lib/utils/encryption";
import { LoginUser } from "@/types/auth";
import { UserRole } from "@/lib/auth/roles";

export interface AuthState {
  isAuthenticated: boolean;
  user: LoginUser | null;
  role: UserRole | null;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    role: null,
    isLoading: true,
  });

  const login = async (
    token: string,
    userData: LoginUser,
    sessionCode: string,
    role: UserRole
  ) => {
    try {
      await secureStorage.set("token", token);
      await secureStorage.set("user", userData);
      await secureStorage.set("sessionCode", sessionCode);
      await secureStorage.set("role", role);

      setAuthState({
        isAuthenticated: true,
        user: userData,
        role: role,
        isLoading: false,
      });

      window.dispatchEvent(new Event("authChange"));
    } catch (error) {
      console.error("Error in login function:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await secureStorage.remove("token");
      await secureStorage.remove("user");
      await secureStorage.remove("sessionCode");
      await secureStorage.remove("role");

      setAuthState({
        isAuthenticated: false,
        user: null,
        role: null,
        isLoading: false,
      });

      window.dispatchEvent(new Event("authChange"));
    } catch (error) {
      console.error("Error in logout function:", error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<LoginUser>) => {
    try {
      const currentUser = await secureStorage.get("user");

      if (!currentUser) {
        throw new Error("User data not found in storage");
      }

      const updatedUser = { ...currentUser, ...userData };

      await secureStorage.set("user", updatedUser);

      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
      }));

      window.dispatchEvent(new Event("authChange"));

      return updatedUser;
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const [token, userData, role] = await Promise.all([
          secureStorage.get("token"),
          secureStorage.get("user"),
          secureStorage.get("role"),
        ]);

        setAuthState({
          isAuthenticated: !!token,
          user: userData,
          role: role,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          role: null,
          isLoading: false,
        });
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
    ...authState,
    login,
    logout,
    updateUser,
  };
}
