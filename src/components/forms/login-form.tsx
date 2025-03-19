"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosed, Mail, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/types";
import { secureStorage } from "@/lib/utils/encryption";
import api from "@/lib/api/axios";
import { useAuth } from "@/hooks/use-auth";

// User data sanitization
const sanitizeUserData = (userData: LoginResponse["user"], role: string) => {
  const [firstName, ...lastNameParts] = userData.name.split(" ");
  return {
    id: userData.id,
    first_name: firstName || "",
    last_name: lastNameParts.join(" ") || "",
    email: userData.email,
    profile_img: userData.profile_img,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Input validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting login with:", { email }); // Log the request

      const response = await api.post<LoginResponse>("/login", {
        email,
        password,
      });

      console.log("Raw response:", response); // Log the entire response
      console.log("Response data:", response.data); // Log the response data

      // Validate response data
      if (!response.data) {
        throw new Error("No response data received");
      }

      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "Login failed");
      }

      const { token, user, role, sessionCode } = response.data;

      // Validate required fields
      if (!token || !user || !role || !sessionCode) {
        console.error("Missing required fields:", {
          token,
          user,
          role,
          sessionCode,
        });
        throw new Error("Invalid response format: missing required fields");
      }

      // Validate user object
      if (!user.id || !user.email || !user.name) {
        console.error("Invalid user object:", user);
        throw new Error("Invalid user data received");
      }

      // Sanitize and store user data securely
      const sanitizedUser = sanitizeUserData(user, role);
      console.log("Sanitized user:", sanitizedUser); // Log sanitized data

      // Use the auth hook for login instead of directly managing storage
      await login(token, sanitizedUser, sessionCode, role);

      // Clear sensitive form data
      setEmail("");
      setPassword("");

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Failed to login. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.trim());
    setError(null);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };
  return (
    <form onSubmit={handleLogin} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="pl-10"
            placeholder="Enter your email"
            disabled={isLoading}
          />
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={isShowPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            className="pl-10 pr-10"
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <button
            type="button"
            onClick={() => setIsShowPassword(!isShowPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            aria-label={isShowPassword ? "Hide password" : "Show password"}
          >
            {isShowPassword ? (
              <EyeClosed className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
