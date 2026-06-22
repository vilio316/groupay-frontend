"use client";
import React, { createContext, SetStateAction, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/lib/authClient";
import { useState } from "react";

interface NotifContextType {
  notifications: any[];
  updateNotis: React.Dispatch<SetStateAction<any[]>>;
  isLoading: boolean;
  isSuccess: boolean;
  unreadCount: number;
  updateUnread: React.Dispatch<SetStateAction<number>>;
  sendReadToDB: (id: string) => void;
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

  const queryClient = useQueryClient();

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
      const unreadNotis =
        notificationsResponse &&
        notificationsResponse.filter((notif: any) => notif.isRead === false);
      updateUnread(unreadNotis.length);
      updateNotis(notificationsResponse);
      return notificationsResponse;
    },
    staleTime: 1 * 60 * 60 * 100,
  });

  const { mutateAsync: sendReadToDB } = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`http://localhost:3000/notifications/item/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  return (
    <NotificationContext
      value={{
        notifications,
        isSuccess,
        isLoading,
        updateNotis,
        unreadCount,
        updateUnread,
        sendReadToDB,
      }}
    >
      {children}
    </NotificationContext>
  );
}
