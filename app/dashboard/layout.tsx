import { Metadata } from "next";
import React from "react";
import Sidebar from "./Sidebar";

export const metadata: Metadata = {
  title: "Your GrouPay Dashboard",
  description: "GrouPay Dashboard for User",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <div className="grid md:grid-cols-6 gap-x-2 md:p-4 h-screen">
      <div className="md:col-span-1 hidden md:grid md:p-2 h-[95vh] border-r-2 border-ink-mid">
        <Sidebar />
      </div>
      <div className="md:col-span-5 relative md:p-2 p-4 overflow-y-scroll custom-scrollbar">
        {children}
      </div>
    </div>
  );
}
