"use client";
import { useSession } from "@/lib/authClient";
import { ClusterMember } from "../(user-facing)/cluster/[id]/ClusterDetailsClient";

export function MemberCard({ member }: { member: ClusterMember }) {
  const { data } = useSession();
  const isYou = data?.user.id === member.user.id;
  return (
    <div
      className={`${isYou ? "bg-green/40" : ""} flex gap-x-4 items-center hover:bg-aqua/20 rounded-xl p-2 my-3 group`}
    >
      <div className="p-1">
        <img
          className="w-12 h-12 rounded-full object-cover user-display-img border border-aqua"
          src="/family.jpg"
        />
      </div>
      <div className="w-[80%]">
        <p>{member.user.name === data?.user.name ? "You" : data?.user.name}</p>
        <p>@{member.user.email.split("@")[0]} | userStatus</p>
      </div>
    </div>
  );
}
