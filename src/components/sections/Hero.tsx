import React from "react";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/forms/login-form";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="relative z-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Title Section */}
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Provincial General{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 inline-block text-transparent bg-clip-text">
                  Services
                </span>{" "}
                Office
              </h1>
              <p className="text-xl text-muted-foreground md:text-2xl">
                Optimizing Government Services for Faster Request Processing
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
