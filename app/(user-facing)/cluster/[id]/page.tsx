"use client";
import ClusterDetailsClient, {
  clusterDetailsType,
} from "./ClusterDetailsClient";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function ClusterPage() {
  const { id } = useParams();
  async function fetchCluster() {
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

  const {
    data: clusterDetailsResponse,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["cluster", id],
    queryFn: fetchCluster,
    staleTime: 1 * 60 * 60 * 1000,
  });

  return (
    <>
      {isSuccess && (
        <ClusterDetailsClient detailsObject={clusterDetailsResponse} />
      )}
      {isLoading && <p>Loading...</p>}
    </>
  );
}
