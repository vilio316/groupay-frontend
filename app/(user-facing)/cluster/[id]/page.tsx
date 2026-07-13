"use client";
import ClusterDetailsClient from "./ClusterDetailsClient";
import { useParams } from "next/navigation";
import { useClusterDetails } from "@/app/hooks/queryHooks";
import { BalanceSkeleton, CardSkeleton, ListSkeleton } from "@/app/components/Spinner";

export default function ClusterPage() {
  const { id } = useParams();

  const { isSuccess, isLoading, clusterDetailsResponse } = useClusterDetails(
    String(id),
  );
  return (
    <>
      {isSuccess && clusterDetailsResponse && (
        <ClusterDetailsClient detailsObject={clusterDetailsResponse} />
      )}
      {isLoading && (
        <div className="p-4 space-y-6">
          <div className="flex gap-4 items-center">
            <div className="h-8 bg-mist/20 rounded animate-pulse w-1/3" />
            <div className="h-6 bg-mist/10 rounded animate-pulse w-1/6 ml-auto" />
          </div>
          <BalanceSkeleton />
          <div className="border border-card-border rounded-xl p-4 space-y-3">
            <div className="h-4 bg-mist/20 rounded animate-pulse w-1/4" />
            <div className="h-3 bg-mist/10 rounded animate-pulse w-full" />
            <div className="h-3 bg-mist/10 rounded animate-pulse w-3/4" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1"><CardSkeleton /></div>
            <div className="flex-1"><CardSkeleton /></div>
          </div>
          <ListSkeleton rows={3} />
        </div>
      )}
    </>
  );
}
