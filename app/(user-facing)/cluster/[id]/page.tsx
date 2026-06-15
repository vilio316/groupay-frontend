import ClusterDetailsClient, {
  clusterDetailsType,
} from "./ClusterDetailsClient";
import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";

export default async function ClusterPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  async function fetchCluster() {
    "use cache";
    cacheLife("hours");
    cacheTag(`cluster_${id}`);
    const clusterDetailsRequest = await fetch(
      `http://localhost:3000/clusters/${id}`,
      {
        credentials: "include",
      },
    );
    const clusterDetailsResponse: clusterDetailsType =
      await clusterDetailsRequest.json();
    return clusterDetailsResponse;
  }

  const clusterDetailsResponse = await fetchCluster();
  return <ClusterDetailsClient detailsObject={clusterDetailsResponse} />;
}
