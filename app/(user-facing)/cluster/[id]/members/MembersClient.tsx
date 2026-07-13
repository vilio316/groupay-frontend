"use client";

import { soraClass } from "@/app/fonts";
import { ClusterMember } from "../ClusterDetailsClient";
import { MemberCard } from "@/app/components/MemberCard";
import { usePathname } from "next/navigation";
import { SignOut } from "@phosphor-icons/react";
import { useSession } from "@/lib/authClient";
import { useMemo } from "react";

export default function MembersClient({
  members,
}: {
  members: ClusterMember[];
}) {
  const pathname = usePathname();
  const { data } = useSession();

  const sortedMembers = useMemo(() => {
    if (!data?.user.id) return members;
    return [...members].sort((a, b) => {
      if (a.user.id === data.user.id) return -1;
      if (b.user.id === data.user.id) return 1;
      return 0;
    });
  }, [members, data?.user.id]);

  return (
    <div className="min-h-full">
      <div className="bg-white border border-card-border rounded-xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`${soraClass} text-xl font-bold text-forest`}>
            {pathname.includes("plan") ? "Plan" : "Cluster"} Members
          </h1>
          <button className="h-11 px-5 flex items-center gap-2 rounded-[9999px] border border-card-border text-ink-mid text-xs font-semibold uppercase tracking-wider hover:bg-[rgba(229,55,58,0.08)] hover:text-red hover:border-red transition-all">
            <SignOut className="w-4 h-4" weight="bold" />
            Exit {pathname.includes("plan") ? "Plan" : "Cluster"}
          </button>
        </div>

        <div className="mb-5">
          <input
            type="text"
            className="h-12 w-full px-4 rounded-xl border border-card-border bg-white outline-none transition-all placeholder:text-mist focus:border-green focus:ring-2 focus:ring-green/20 text-sm text-ink"
            placeholder="Search by name or email..."
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-[9999px] text-xs font-semibold bg-partial-bg text-partial-text">
            {members.length} {members.length === 1 ? "member" : "members"}
          </span>
        </div>

        <div className="space-y-1">
          {sortedMembers.map((memberObj) => (
            <MemberCard member={memberObj} key={memberObj.id} />
          ))}
          {members.length === 0 && (
            <p className="text-sm text-ink-mid text-center py-8">
              No members to display.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
