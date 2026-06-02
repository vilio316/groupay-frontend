import ClusterDetailsClient from "./ClusterDetailsClient";
import { Suspense } from "react";

export default async function ClusterPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const clusterDetailsRequest = await fetch(
    `http://localhost:3000/clusters/${id}`,
    {
      credentials: "include",
    },
  );
  const clusterDetailsResponse = await clusterDetailsRequest.json();

  return (
    <Suspense fallback={"Loading cluster details..."}>
      <ClusterDetailsClient detailsObject={clusterDetailsResponse} />{" "}
    </Suspense>
  );
}
