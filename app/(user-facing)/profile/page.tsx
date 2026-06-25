"use client";

import { soraClass } from "@/app/fonts";
import { getSession, signOut } from "@/lib/authClient";
import { SignOutIcon } from "@phosphor-icons/react/dist/ssr";
import { redirect } from "next/navigation";
import { useSession } from "@/lib/authClient";
import { useEffect } from "react";
import Link from "next/link";
import { PencilSimpleLineIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useMyUserData } from "@/app/hooks/queryHooks";

export default function ProfilePage() {
  const session = useSession();
  const { userDetails, isLoading, isSuccess } = useMyUserData();

  return (
    <div className="p-3 h-full">
      <div className="flex gap-x-2 items-center">
        <p
          className={`text-3xl ${soraClass} md:w-3/5 w-4/5 font-bold text-green my-3`}
        >
          Your Profile
        </p>
        <button
          className="flex gap-x-4 md:hidden shrink-0 items-center text-red border-red border p-2 hover:text-white hover:bg-red transition-all rounded-xl my-4"
          onClick={async () => {
            await signOut({
              fetchOptions: {
                onSuccess: () => redirect("/auth/sign-in"),
              },
            });
          }}
        >
          <SignOutIcon className="h-6 w-6 " />
          Log Out
        </button>
      </div>
      <div className="w-full flex justify-end">
        <Link
          className="border p-2 border-green text-green rounded-xl hover:bg-green hover:text-white flex gap-x-2 hover:scale-105 transition-all"
          href="/profile/edit"
        >
          <PencilSimpleLineIcon className="text-2xl" />
          <span className="uppercase">Edit Profile Details</span>
        </Link>
      </div>
      <div className="flex gap-4 items-center p-4 border border-card-border rounded-xl shadow-sm shadow-green/40 my-3">
        <div>
          <img
            className="rounded-full md:h-28 md:w-28 w-24 h-24 object-cover border border-green"
            src={`${session.data?.user.image ? session.data.user.image : "/family.jpg"} `}
          />
        </div>
        {isSuccess && userDetails && (
          <div>
            <p className="text-xl font-bold">
              {userDetails ? userDetails.name : "User Names"}
            </p>
            <p className="text-ink-mid font-semibold">
              @{userDetails ? userDetails.email.split("@")[0] : ""}
            </p>
            <p>
              Member in {userDetails.clusters.length} Clusters, including{" "}
              <span className="font-semibold text-green">mostActive </span>
            </p>
          </div>
        )}
        {isLoading && <p>Loading...</p>}
      </div>
      <div
        className={`p-3 border-2 border-card-border my-2 rounded-xl ${soraClass} font-bold h-75`}
        id="settings"
      >
        <p>Settings</p>
      </div>
      <div className="md:flex w-full items-center justify-center hidden ">
        <button
          className="flex gap-x-4 items-center text-red border-red border p-2 hover:text-white hover:bg-red transition-all rounded-xl my-4"
          onClick={async () => {
            await signOut({
              fetchOptions: {
                onSuccess: () => redirect("/auth/sign-in"),
              },
            });
          }}
        >
          <SignOutIcon className="h-6 w-6 " />
          Log Out
        </button>
      </div>
    </div>
  );
}
