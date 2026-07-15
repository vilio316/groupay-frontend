import { clusterDetailsType } from "../ClusterDetailsClient";
import { Suspense } from "react";
import MembersClient from "./MembersClient";
import { ListSkeleton } from "@/app/components/Spinner";

export default async function MembersPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const clusterRequest = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const clusterResponse: clusterDetailsType = await clusterRequest.json();
  const { members } = clusterResponse;

  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-3">
          <ListSkeleton rows={5} />
        </div>
      }
    >
      <MembersClient members={members.reverse()} />
    </Suspense>
  );
}
