import { Metadata } from "next";
import React from "react";
import Sidebar from "./dashboard/Sidebar";
import { BellIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Your GrouPay Dashboard",
  description: "GrouPay Dashboard for User",
  icons: {
    icon: "/family.jpg",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <div className="grid md:grid-cols-6 gap-x-2 md:p-4 h-screen">
      <div className="md:col-span-1 hidden md:grid md:p-2 h-[95vh] border-r-2 border-ink-mid/25 text-ink">
        <Sidebar />
      </div>
      <div className="grid md:col-span-5 relative p-4 md:p-0 overflow-y-scroll min-h-screen custom-scrollbar items-center">
        <div className="h-full">
          <div className="flex w-full items-center p-2 gap-x-4 justify-end top-icons">
            <p className="w-3/4"></p>
            <Link href="/notifications" className="relative">
              <BellIcon className="flex w-8 h-8 fill-green" />
              <div
                className="absolute w-4 h-4 px-0.5
                   text-center -top-1 right-0 rounded-full bg-aqua text-[10px]"
              >
                9+
              </div>
            </Link>
            <Link href="/profile">
              <UserIcon className="flex w-8 h-8 fill-green" />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
