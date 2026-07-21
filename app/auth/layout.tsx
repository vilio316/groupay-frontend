import { AppOfferings } from "./AppOfferings";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid md:grid-cols-2 min-h-screen gap-x-4 bg-white dark:bg-[#0a1812] transition-colors">
      <AppOfferings />
      {children}
    </div>
  );
}
