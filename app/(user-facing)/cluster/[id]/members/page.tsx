import { soraClass } from "@/app/fonts";
import Link from "next/link";
import { clusterDetailsType, ClusterMember } from "../ClusterDetailsClient";
import { Suspense } from "react";
import { useSession } from "@/lib/authClient";
import { MemberCard } from "@/app/components/MemberCard";

export default async function MembersPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const clusterRequest = await fetch(`http://localhost:3000/clusters/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const clusterResponse: clusterDetailsType = await clusterRequest.json();
  const { members } = clusterResponse;

  return (
    <Suspense fallback="Loading...">
      <div className="mx-auto my-4">
        <div className="grid grid-cols-5 items-center p-1">
          <p
            className={`my-4 text-2xl ${soraClass} font-bold text-green col-span-4`}
          >
            <Link href="/cluster/234">ClusterName</Link> / Members
          </p>
          <span className="col-span-1 rounded-xl text-center justify-self-end text-red hover:bg-red hover:text-white p-2 hover:scale-105 transition-all">
            Exit Cluster
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
    </Suspense>
  );
}
