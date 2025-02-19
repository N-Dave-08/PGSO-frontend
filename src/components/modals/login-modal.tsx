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

// Rate limiting constants
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

interface LoginResponse {
  isSuccess: boolean;
  user: {
    id: number;
    email: string;
    name: string;
  };
  token: string;
  sessionCode: string;
  role: string;
  message: string;
}

export default function LoginModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing lockout
    const storedLockout = localStorage.getItem("loginLockout");
    if (storedLockout) {
      const lockoutTime = parseInt(storedLockout);
      if (lockoutTime > Date.now()) {
        setLockoutUntil(lockoutTime);
      } else {
        localStorage.removeItem("loginLockout");
        setLoginAttempts(0);
      }
    }
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if user is locked out
    if (lockoutUntil && lockoutUntil > Date.now()) {
      const minutesLeft = Math.ceil((lockoutUntil - Date.now()) / 60000);
      setError(
        `Too many login attempts. Please try again in ${minutesLeft} minutes.`
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://server.pgso.bpc-bsis4d.com/public/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            deviceInfo: {
              userAgent: window.navigator.userAgent,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              timestamp: new Date().toISOString(),
            },
          }),
        }
      );

      const data: LoginResponse = await response.json();

      if (!data.isSuccess) {
        // Handle failed login attempt
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          const lockoutTime = Date.now() + LOCKOUT_TIME;
          setLockoutUntil(lockoutTime);
          localStorage.setItem("loginLockout", lockoutTime.toString());
          throw new Error(
            `Too many failed attempts. Please try again in 15 minutes.`
          );
        }

        throw new Error(data.message || "Login failed");
      }

      // Reset login attempts on successful login
      setLoginAttempts(0);
      localStorage.removeItem("loginLockout");

      // Store auth data
      try {
        // Store token
        const encryptedToken = btoa(data.token);
        localStorage.setItem("token", encryptedToken);

        // Store session code
        localStorage.setItem("sessionCode", data.sessionCode);

        // Store role
        localStorage.setItem("role", data.role);

        // Store minimal user data
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
          })
        );

        // Clear sensitive data from memory
        setPassword("");

        // Dispatch auth change event
        window.dispatchEvent(new Event("authChange"));

        router.push("/dashboard");
        setOpen(false);
      } catch (error) {
        console.error("Error storing credentials");
        throw new Error("Failed to complete login process");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Log In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log In</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="size-4 opacity-40 absolute top-1/2 left-3 -translate-y-1/2" />
              <Input
                name="email"
                id="email"
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                className="pl-10"
                required
                autoComplete="email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="size-4 opacity-40 absolute top-1/2 left-3 -translate-y-1/2" />
              <Input
                name="password"
                id="password"
                type={`${isShowPassword ? "text" : "password"}`}
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                className="pl-10"
                required
                autoComplete="current-password"
              />
              <div
                onClick={handlePassword}
                className="absolute top-1/2 right-3 -translate-y-1/2 hover:cursor-pointer"
              >
                {isShowPassword ? (
                  <Eye className="size-4" />
                ) : (
                  <EyeClosed className="size-4" />
                )}
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            {!isLoading ? (
              <Button
                variant="secondary"
                type="submit"
                disabled={!!lockoutUntil && lockoutUntil > Date.now()}
              >
                Log In
              </Button>
            ) : (
              <Button variant="secondary" disabled>
                <Loader2 className="animate-spin" />
                Please wait
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
