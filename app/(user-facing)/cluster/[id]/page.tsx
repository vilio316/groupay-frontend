"use client";
import ClusterDetailsClient, {
  clusterDetailsType,
} from "./ClusterDetailsClient";
import { useParams } from "next/navigation";
import { useClusterDetails } from "@/app/hooks/queryHooks";

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
      {isLoading && <p>Loading...</p>}
    </>
  );
}
