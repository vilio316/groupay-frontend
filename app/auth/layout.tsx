import { AppOfferings } from "./AppOfferings";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid md:grid-cols-2 min-h-screen gap-x-4">
      <AppOfferings />
      {children}
    </div>
  );
}
