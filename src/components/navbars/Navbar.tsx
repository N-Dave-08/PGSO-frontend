import React from "react";
import { Button } from "@/components/ui/button";
import LoginModal from "@/components/modals/login-modal";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/70">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="font-semibold">PGSO</div>
        <nav className="hidden md:flex gap-6">
          <LoginModal />
        </nav>
      </div>
    </header>
  );
}
