"use client";

import { soraClass } from "@/app/fonts";
import { getSession, useSession } from "@/lib/authClient";
import { BellSimpleSlashIcon, BellSimpleIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useNotifications } from "@/app/NotificationsProvider";

export function makeDate(date: string) {
  const dateVal = new Date(date);
  return dateVal.toLocaleString();
}

export function NotificationComponent({
  notif,
}: {
  notif: {
    id: string;
    message: string;
    createdAt: string;
    isRead: boolean;
  };
}) {
  const { id, message, createdAt, isRead } = notif;
  const { updateNotis, notifications, updateUnread, sendReadToDB } =
    useNotifications();

  const markAsRead = async (id: string) => {
    sendReadToDB(id);
  };

  return (
    <div
      className={`my-2 rounded-2xl  ${isRead ? `border-card-border border` : `border-teal border-2`} flex items-center gap-x-3 p-2`}
      onClick={() => {
        markAsRead(id);
      }}
    >
      <BellSimpleIcon />
      <div>
        <p key={id} className="my-2 p-1 ">
          {message}
        </p>
        <p className="text-[10px]">{makeDate(notif.createdAt)}</p>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { notifications, isSuccess, isLoading } = useNotifications();
  console.log(notifications);

  return (
    <div className="grid h-full">
      <div>
        <p className={`font-bold ${soraClass} text-green text-3xl my-3`}>
          Your Notifications
        </p>
        {isSuccess &&
          notifications &&
          notifications.length > 0 &&
          notifications.map((notif: any) => (
            <NotificationComponent key={notif.id} notif={notif} />
          ))}

        {isSuccess && notifications && notifications.length == 0 && (
          <div className="m-4 p-4 text-center border-2 border-card-border rounded-xl grid">
            <div className="grid justify-center">
              <BellSimpleSlashIcon
                className="h-16 w-16 fill-green"
                weight="duotone"
              />
            </div>
            <p className="font-semibold text-2xl p-1 my-2">
              No Recent Notifications
            </p>
            <p className="text-xl">
              Your most recent notifications will show up here
            </p>
          </div>
        )}

        {isLoading && <p>Loading your notifications...</p>}
      </div>
    </div>
  );
}
