import { clusterDetailsType } from "../ClusterDetailsClient";
import { Suspense } from "react";
import MembersClient from "./MembersClient";

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
      <MembersClient members={members} />
    </Suspense>
  );
}
