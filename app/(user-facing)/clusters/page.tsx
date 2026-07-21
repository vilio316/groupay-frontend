"use client";
import ClusterClient from "./ClusterClient";
import { useMyClusters } from "@/app/hooks/queryHooks";
import { PageSkeleton } from "@/app/components/Spinner";
import InlineError from "@/app/components/InlineError";

export default function ClustersPage() {
  const { clusterResponse, isLoading, isSuccess, myClustersError, refetchMyClusters } = useMyClusters();

  return (
    <>
      {myClustersError && (
        <InlineError
          message="Could not load your clusters"
          retry={refetchMyClusters}
        />
      )}
      {isSuccess && clusterResponse && (
        <ClusterClient clusterObj={clusterResponse} />
      )}
      {isLoading && <PageSkeleton />}
    </>
  );
}
