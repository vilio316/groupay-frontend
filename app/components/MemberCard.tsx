"use client";
import { useSession } from "@/lib/authClient";
import { ClusterMember } from "../(user-facing)/cluster/[id]/ClusterDetailsClient";
import { CheckCircleIcon, CrownIcon } from "@phosphor-icons/react";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function MemberCard({ member }: { member: ClusterMember }) {
  const { data } = useSession();
  const isYou = data?.user.id === member.user.id;
  const isOwner = member.role === "owner";
  const name = member.user.name || "Unknown";
  const emailName = member.user.email.split("@")[0];
  const hasImage = !!member.user.image;

  return (
    <div
      className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all hover:bg-[rgba(84,222,253,0.1)] ${
        isYou ? "bg-[rgba(73,198,53,0.08)]" : ""
      }`}
    >
      <div className="shrink-0">
        {hasImage ? (
          <img
            className="w-11 h-11 rounded-full object-cover border-2 border-[rgba(84,222,253,0.4)]"
            src={member.user.image}
            alt={name}
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[#8bd7d2] flex items-center justify-center text-sm font-bold text-[#fffbfa] border-2 border-[rgba(84,222,253,0.4)]">
            {getInitials(name)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#0d2b1f] truncate">
          {isYou ? "You" : name}
        </p>
        <p className="text-xs text-[#4a5568] truncate">@{emailName}</p>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {isOwner && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[9999px] text-[11px] font-semibold bg-amber-100 text-amber-800">
            <CrownIcon className="w-3 h-3" weight="bold" />
            Owner
          </span>
        )}
        {isYou && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[9999px] text-[11px] font-semibold bg-[rgba(73,198,53,0.15)] text-[#1a6b0e]">
            <CheckCircleIcon className="w-3 h-3" weight="bold" />
            You
          </span>
        )}
      </div>
    </div>
  );
}
