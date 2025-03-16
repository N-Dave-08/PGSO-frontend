"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosed, Mail, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/types";
import { rateLimit, secureStorage } from "@/lib/utils/encryption";
import api from "@/lib/api/axios";
// import { User } from "@/types";
// interface UserData {
//   id: number;
//   name: string;
//   role: string;
//   [key: string]: any; // For any additional properties that might be present
// }

// Rate limiting constants
const RATE_LIMIT_KEY = "login_ratelimit";
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// User data sanitization
const sanitizeUserData = (userData: LoginResponse["user"], role: string) => {
  const [firstName, ...lastNameParts] = userData.name.split(" ");
  return {
    id: userData.id,
    first_name: firstName || "",
    last_name: lastNameParts.join(" ") || "",
    email: userData.email,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export default function LoginModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing lockout
    const checkLockout = async () => {
      const isLocked = await rateLimit.checkLimit(
        RATE_LIMIT_KEY,
        MAX_LOGIN_ATTEMPTS,
        LOCKOUT_DURATION
      );
      if (isLocked) {
        setError("Too many login attempts. Please try again later.");
      }
    };
    checkLockout();
  }, []);

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

    // Check rate limit
    const isLocked = await rateLimit.checkLimit(
      RATE_LIMIT_KEY,
      MAX_LOGIN_ATTEMPTS,
      LOCKOUT_DURATION
    );
    if (isLocked) {
      const minutesLeft = Math.ceil(LOCKOUT_DURATION / 60000);
      setError(
        `Too many login attempts. Please try again in ${minutesLeft} minutes.`
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<LoginResponse>("/login", {
        email,
        password,
      });

      const { token, user, role, sessionCode } = response.data;

      // Clear rate limiting on successful login
      await rateLimit.clearAttempts(RATE_LIMIT_KEY);

      // Sanitize and store user data securely
      const sanitizedUser = sanitizeUserData(user, role);
      await secureStorage.set("user", sanitizedUser);
      await secureStorage.set("token", token);
      await secureStorage.set("sessionCode", sessionCode);

      // Keep a minimal version in localStorage for compatibility
      localStorage.setItem("role", role);

      // Clear sensitive form data
      setEmail("");
      setPassword("");
      setOpen(false);

      // Trigger auth change event
      window.dispatchEvent(new Event("authChange"));

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      await rateLimit.recordAttempt(RATE_LIMIT_KEY);

      if (error instanceof Error) {
        setError(error.message || "Failed to login. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }

      // Check if max attempts reached after recording
      const isNowLocked = await rateLimit.checkLimit(
        RATE_LIMIT_KEY,
        MAX_LOGIN_ATTEMPTS,
        LOCKOUT_DURATION
      );
      if (isNowLocked) {
        setError("Too many failed attempts. Please try again in 15 minutes.");
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>
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
                className="absolute right-3 top-3 h-4 w-4 text-gray-500"
              >
                {isShowPassword ? <EyeClosed /> : <Eye />}
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
      </DialogContent>
    </Dialog>
  );
}
