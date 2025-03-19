import React from "react";
import LoginModal from "../modals/login-modal";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 px-4 sm:px-8 md:px-16 lg:px-24 bg-background/70">
      <nav className="container flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4 md:px-6">
        <div className="font-semibold text-lg sm:text-xl">PGSO</div>
        <LoginModal />
      </nav>
    </header>
  );
}
