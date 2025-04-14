import React from "react";
import LoginModal from "../modals/login-modal";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-6 z-50 px-4 sm:px-8 md:px-16 lg:px-24">
      <nav className="w-5/6 mx-auto bg-background/70 backdrop-blur-sm border border-border/50 flex items-center justify-between rounded-lg px-2.5 py-2">
        <Button variant={"ghost"} className="text-lg font-semibold">
          PGSO
        </Button>
        <LoginModal />
      </nav>
    </header>
  );
}
