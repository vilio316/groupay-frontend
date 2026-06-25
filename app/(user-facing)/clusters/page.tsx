"use client";
import ClusterClient from "./ClusterClient";
import { useMyClusters } from "@/app/hooks/queryHooks";

export default function ClustersPage() {
  const { clusterResponse, isLoading, isSuccess } = useMyClusters();

  return (
    <>
      {isSuccess && clusterResponse && (
        <ClusterClient clusterObj={clusterResponse} />
      )}
      {isLoading && <p>Getting Your Clusters...</p>}
    </>
  );
}
