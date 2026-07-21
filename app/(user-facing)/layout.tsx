"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { redirect } from "next/navigation";
import { BellIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import Sidebar from "./dashboard/Sidebar";
import MobileNav from "../components/MobileNavigationBar";
import { Suspense } from "react";

gsap.registerPlugin(useGSAP);
import { useNotifications } from "../NotificationsProvider";
import { useSession } from "@/lib/authClient";

export default function DashboardClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const topIconsRef = useRef<HTMLDivElement>(null);

  const { unreadCount } = useNotifications();
  const {} = useSession();
  useGSAP(() => {
    gsap.from(sidebarRef.current, {
      x: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.from(contentRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out",
    });

    gsap.from(topIconsRef.current?.children || [], {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.15,
      delay: 0.4,
      ease: "back.out(1.7)",
    });
  }, []);

  useEffect(() => {
    const badge = document.querySelector(".notification-badge");
    if (badge) {
      gsap.to(badge, {
        scale: 1.2,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "sine.inOut",
      });
    }
  }, [unreadCount]);
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <span className="w-8 h-8 rounded-full animate-spin border-3 border-green border-t-transparent" />
        </div>
      }
    >
      <div className="flex h-screen overflow-hidden bg-white ">
        <aside
          ref={sidebarRef}
          className="hidden md:flex md:flex-col w-64 h-full sticky top-0 bg-whiteborder-r border-gray-200 shadow-lg z-20 "
        >
          <Sidebar />
        </aside>

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <div
            ref={topIconsRef}
            className="flex items-center justify-end gap-4  p-4  dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700"
          >
            <Link
              href="/notifications"
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <BellIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              {unreadCount > 0 && (
                <span className="notification-badge absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link
              href="/profile"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <UserIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </Link>
          </div>

          <div
            ref={contentRef}
            className="flex-1 ml-5 overflow-y-auto p-2 md:p-6 bg-white"
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <span className="w-6 h-6 rounded-full animate-spin border-2 border-green border-t-transparent" />
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </div>

        <MobileNav />
      </div>
    </Suspense>
  );
}
