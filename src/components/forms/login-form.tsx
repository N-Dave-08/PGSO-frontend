"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosed, Mail, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/types";
import { secureStorage } from "@/lib/utils/encryption";
import api, { handleApiError } from "@/lib/api/axios";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { UserRole } from "@/lib/auth/roles";
// Constants for validation and rate limiting
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// User data sanitization
const sanitizeUserData = (userData: LoginResponse["user"], role: string) => {
  return {
    id: userData.id,
    email: userData.email,
    first_name: userData.first_name,
    last_name: userData.last_name,
    profile: userData.avatar || "",
    age: userData.age || "",
    gender: userData.gender || "",
    number: userData.number || 0,
  };
};

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const isLocked = (): boolean => {
    return Boolean(lockoutUntil && Date.now() < lockoutUntil);
  };

  const validateForm = (data: LoginFormData): string | null => {
    try {
      loginSchema.parse(data);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0].message;
      }
      return "An unexpected error occurred during validation";
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check for lockout
    if (isLocked()) {
      const remainingMinutes = Math.ceil(
        ((lockoutUntil || 0) - Date.now()) / 60000
      );
      setError(
        `Too many login attempts. Please try again in ${remainingMinutes} minutes.`
      );
      return;
    }

    // Validate form data using Zod
    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<LoginResponse>("/login", formData);

      // Reset login attempts on successful login
      setLoginAttempts(0);
      setLockoutUntil(null);

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
        throw new Error("Invalid response format: missing required fields");
      }

      // Validate user object
      if (!user.id || !user.email || !user.first_name || !user.last_name) {
        throw new Error("Invalid user data received");
      }

      // Sanitize and store user data securely
      const sanitizedUser = sanitizeUserData(user, role);

      // Use the auth hook for login
      await login(token, sanitizedUser, sessionCode, role as UserRole);

      // Clear sensitive form data
      setFormData({ email: "", password: "" });

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      // Check if should lockout
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION;
        setLockoutUntil(lockoutTime);
        setError(
          `Too many failed login attempts. Please try again in 15 minutes.`
        );
      } else {
        // Use the handleApiError utility for better error messages
        const errorMessage = handleApiError(error);
        setError(errorMessage.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "email" ? value.trim() : value,
    }));
    setError(null);
  };

  return (
    <form onSubmit={handleLogin} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="pl-10"
            placeholder="Enter your email"
            disabled={isLoading || isLocked()}
          />
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={isShowPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            className="pl-10 pr-10"
            placeholder="Enter your password"
            disabled={isLoading || isLocked()}
          />
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <button
            type="button"
            onClick={() => setIsShowPassword(!isShowPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            aria-label={isShowPassword ? "Hide password" : "Show password"}
            disabled={isLoading || isLocked()}
          >
            {isShowPassword ? (
              <EyeClosed className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={isLoading || isLocked()}>
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
