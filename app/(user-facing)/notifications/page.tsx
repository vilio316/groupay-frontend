"use client";

import { soraClass } from "@/app/fonts";
import { getSession, useSession } from "@/lib/authClient";
import { BellSimpleSlashIcon, BellSimpleIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";

function makeDate(date: string) {
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
  };
}) {
  return (
    <div className="my-2 rounded-2xl border border-card-border flex items-center gap-x-3 p-2">
      <BellSimpleIcon />
      <div>
        <p key={notif.id} className="my-2 p-1 ">
          {notif.message}
        </p>
        <p className="text-[10px]">{makeDate(notif.createdAt)}</p>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { data } = useSession();

  const {
    data: notifications,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["notifications", data?.user.id],
    queryFn: async () => {
      const { data } = await getSession();
      const notificationsRequest = await fetch(
        `http://localhost:3000/notifications/${data?.user.id}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const notificationsResponse = await notificationsRequest.json();
      return notificationsResponse;
    },
    staleTime: 1 * 60 * 60 * 100,
  });

  return (
    <div className="grid h-full">
      <div>
        <p className={`font-bold ${soraClass} text-green text-3xl my-3`}>
          Your Notifications
        </p>
        {isSuccess &&
          notifications.length > 1 &&
          notifications.map((notif: any) => (
            <NotificationComponent key={notif.id} notif={notif} />
          ))}

        {isSuccess && notifications.length == 0 && (
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

        {isLoading && <p>Loading...</p>}
      </div>
    </div>
  );
}
