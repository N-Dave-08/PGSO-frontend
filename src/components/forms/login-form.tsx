"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed, Mail, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/types";
import api, { handleApiError } from "@/lib/api/axios";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserRole } from "@/lib/auth/roles";
import { loginSchema, LoginFormData } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Constants for validation and rate limiting
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

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
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const isLocked = (): boolean => {
    return Boolean(lockoutUntil && Date.now() < lockoutUntil);
  };

  async function onSubmit(data: LoginFormData) {
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

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<LoginResponse>("/login", data);

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
      form.reset();

      // Role-based navigation
      if (role === "admin") {
        router.push("/dashboard");
      } else if (role === "personnel") {
        router.push("/tasks");
      } else {
        router.push("/requests");
      }
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
  }

  return (
    <div className="grid gap-4 py-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter your email"
                      className="pl-10"
                      disabled={isLoading || isLocked()}
                      {...field}
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={isShowPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      disabled={isLoading || isLocked()}
                      {...field}
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <button
                      type="button"
                      onClick={() => setIsShowPassword(!isShowPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                      aria-label={
                        isShowPassword ? "Hide password" : "Show password"
                      }
                      disabled={isLoading || isLocked()}
                    >
                      {isShowPassword ? (
                        <EyeClosed className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading || isLocked()}
            className="w-full"
          >
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
      </Form>
    </div>
  );
}
