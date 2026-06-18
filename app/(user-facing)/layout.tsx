import { Metadata } from "next";
import React from "react";
import Sidebar from "./dashboard/Sidebar";
import { BellIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import MobileNav from "../components/MobileNavigationBar";
export const metadata: Metadata = {
  title: "Your GrouPay Dashboard",
  description: "GrouPay Dashboard for User",
  icons: {
    icon: "/family.jpg",
  },
};

import { Suspense } from "react";
import TopNav from "../components/TopIcons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-x-2 md:p-4 p-2 h-screen">
      <div className="md:col-span-1 hidden md:grid md:p-2 h-[95vh] border-r-2 border-ink-mid/25 text-ink">
        <Sidebar />
      </div>
      <MobileNav />
      <div className="grid md:col-span-3 lg:col-span-5 relative p-2 md:p-0 overflow-y-scroll min-h-screen items-center">
        <div className="h-full my-2 md:p-2">
          <TopNav />
          <Suspense fallback="Loading...">{children}</Suspense>
        </div>
      </div>
    </div>
  );
}
