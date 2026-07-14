"use client";

import { soraClass } from "@/app/fonts";
import { useSession } from "@/lib/authClient";
import {
  BellSimpleSlashIcon,
  BellSimpleIcon,
  UserPlusIcon,
  HandDepositIcon,
  BellSimpleRingingIcon,
} from "@phosphor-icons/react";
import { useNotifications } from "@/app/NotificationsProvider";

export function makeDate(date: string) {
  const dateVal = new Date(date);
  return dateVal.toLocaleString();
}

function relativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function notificationIcon(type: string) {
  switch (type) {
    case "join":
      return UserPlusIcon;
    case "payment":
    case "contribute":
      return HandDepositIcon;
    default:
      return BellSimpleIcon;
  }
}

export function NotificationComponent({
  notif,
}: {
  notif: {
    id: string;
    message: string;
    createdAt: string;
    isRead: boolean;
    type?: string;
  };
}) {
  const { id, message, createdAt, isRead, type } = notif;
  const { sendReadToDB } = useNotifications();
  const Icon = notificationIcon(type || "default");

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
        isRead
          ? "bg-white border-card-border opacity-80 hover:opacity-100"
          : "bg-white border-green/30 shadow-card hover:shadow-md"
      }`}
      onClick={() => {
        sendReadToDB(id);
      }}
    >
      <div
        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isRead ? "bg-mist/20 text-mist" : "bg-green/10 text-green"
        }`}
      >
        <Icon className="w-5 h-5" weight={isRead ? "regular" : "fill"} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${
            isRead ? "text-ink-mid" : "text-forest font-semibold"
          }`}
        >
          {message}
        </p>
        <p className="text-[11px] text-ink-mid/70 mt-1">
          {relativeTime(createdAt)}
        </p>
      </div>
      {!isRead && (
        <div className="shrink-0 self-center">
          <span className="block w-2 h-2 rounded-full bg-green" />
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const { notifications, isSuccess, isLoading } = useNotifications();

  return (
    <div className="min-h-full">
      <div className="flex items-center gap-3 mb-6">
        <BellSimpleRingingIcon className="w-7 h-7 text-green" weight="fill" />
        <p className={`font-bold ${soraClass} text-green text-3xl`}>
          Notifications
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-white border border-card-border animate-pulse p-4"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-mist/20 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-mist/20 rounded w-3/4" />
                  <div className="h-2 bg-mist/10 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isSuccess && notifications && notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notif: any) => (
            <NotificationComponent key={notif.id} notif={notif} />
          ))}
        </div>
      )}

      {isSuccess && notifications && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center mb-5">
            <BellSimpleSlashIcon
              className="w-10 h-10 text-green"
              weight="duotone"
            />
          </div>
          <p className="font-bold text-2xl text-forest mb-2">All Caught Up</p>
          <p className="text-ink-mid max-w-xs">
            You have no notifications right now. We'll let you know when
            something new comes in.
          </p>
        </div>
      )}
    </div>
  );
}
