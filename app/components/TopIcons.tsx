"use client";
import Link from "next/link";
import { BellIcon, UserIcon } from "@phosphor-icons/react";
import { useNotifications } from "../NotificationsProvider";

export default function TopNav() {
  const { unreadCount } = useNotifications();

  return (
    <div className="flex w-full items-center p-2 gap-x-4 justify-end top-icons">
      <Link href="/notifications" className="relative flex justify-self-end">
        <BellIcon className="flex w-8 h-8 fill-green" />
        <div
          className="absolute w-4 h-4 px-0.5
                   text-center -top-1 right-0 rounded-full bg-aqua text-[10px]"
        >
          {unreadCount}
        </div>
      </Link>
      <Link href="/profile">
        <UserIcon className="flex w-8 h-8 fill-green" />
      </Link>
    </div>
  );
}
