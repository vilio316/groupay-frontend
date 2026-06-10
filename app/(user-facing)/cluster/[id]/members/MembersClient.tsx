"use client";

import { soraClass } from "@/app/fonts";
import { ClusterMember } from "../ClusterDetailsClient";
import { MemberCard } from "@/app/components/MemberCard";
import { usePathname } from "next/navigation";

export default function MembersClient({
  members,
}: {
  members: ClusterMember[];
}) {
  const pathname = usePathname();
  return (
    <div className="mx-auto my-4 md:px-4 px-2">
      <div className="grid grid-cols-5 items-center p-1">
        <p
          className={`my-4 text-2xl ${soraClass} font-bold text-green col-span-4`}
        >
          Members
        </p>
        <span className="col-span-1 rounded-xl text-center justify-self-end text-red hover:bg-red hover:text-white p-2 hover:scale-105 transition-all">
          Exit {pathname.includes("plan") ? "Plan" : "Cluster"}
        </span>
      </div>
      <input
        type="text"
        className="text-xl border border-card-border focus:border-green transition-all indent-4 p-3 rounded-xl w-4/5 outline-none"
        placeholder="Search by GrouPay Tag..."
      />
      <p className={`text-xl p-2 ${soraClass}`}>
        <span>{members.length}</span> Members
      </p>
      <div>
        {members.map((memberObj) => (
          <MemberCard member={memberObj} key={memberObj.id} />
        ))}
      </div>
    </div>
  );
}
