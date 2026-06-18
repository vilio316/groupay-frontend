"use client";
import React, { createContext, SetStateAction, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/authClient";
import { useState } from "react";

interface NotifContextType {
  notifications: any[];
  updateNotis: React.Dispatch<SetStateAction<any[]>>;
  isLoading: boolean;
  isSuccess: boolean;
  unreadCount?: number;
  updateUnread: React.Dispatch<SetStateAction<number>>;
}

const NotificationContext = createContext<NotifContextType>(
  {} as NotifContextType,
);

export const useNotifications = () => useContext(NotificationContext);

export default function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifs, updateNotis] = useState<any[]>([]);
  const [unreadCount, updateUnread] = useState(0);

  const {
    data: notifications,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["notifications"],
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
      const uppedNotis =
        notificationsResponse &&
        notificationsResponse.map((notif: any) => ({
          ...notif,
          isRead: false,
        }));
      updateNotis(uppedNotis);
      updateUnread(uppedNotis.length);
      return notificationsResponse;
    },
    staleTime: 1 * 60 * 60 * 100,
  });

  return (
    <NotificationContext
      value={{
        notifications: notifs,
        isSuccess,
        isLoading,
        updateNotis,
        unreadCount,
        updateUnread,
      }}
    >
      {children}
    </NotificationContext>
  );
}
