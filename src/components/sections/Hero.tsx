import React from "react";
import LoginForm from "@/components/forms/login-form";

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 lg:px-24 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Title  */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Provincial General Service Office
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Optimizing Government Services for Faster Request Processing
            </p>
          </div>
          {/* Login Form */}
          <div className="mx-auto w-full max-w-sm space-y-2 bg-background p-4 rounded-lg shadow-lg">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Login</h2>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
}
