"use client";
import ClusterClient from "./ClusterClient";
import { getSession } from "@/lib/authClient";
import { useQuery } from "@tanstack/react-query";
import { clusterDetailsType } from "../cluster/[id]/ClusterDetailsClient";

export default function ClustersPage() {
  async function fetchClust(id: string) {
    const request = await fetch(`http://localhost:3000/clusters/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response: clusterDetailsType = await request.json();
    return response;
  }
  async function eleba() {
    const { data } = await getSession();
    const postReq = await fetch("http://localhost:3000/clusters/myClusters", {
      method: "POST",
      body: JSON.stringify({
        userId: data?.user.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const postRes = await postReq.json();
    const fetchedClustIds = postRes.map((clust: any) => clust.clusterId);
    const promise: clusterDetailsType[] = await Promise.all(
      fetchedClustIds.map((clust: any) => fetchClust(clust)),
    );
    return promise;
  }

  const {
    data: clusterResponse,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["userClusters"],
    queryFn: eleba,
    staleTime: 1 * 60 * 60 * 1000,
  });

  return (
    <>
      {isSuccess && <ClusterClient clusterObj={clusterResponse} />}
      {isLoading && <p>Getting Your Clusters...</p>}
    </>
  );
}
