"use client";
import ClusterClient from "./ClusterClient";
import { useMyClusters } from "@/app/hooks/queryHooks";
import { PageSkeleton } from "@/app/components/Spinner";

export default function ClustersPage() {
  const { clusterResponse, isLoading, isSuccess } = useMyClusters();

  return (
    <>
      {isSuccess && clusterResponse && (
        <ClusterClient clusterObj={clusterResponse} />
      )}
      {isLoading && <PageSkeleton />}
    </>
  );
}
