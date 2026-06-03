"use client";
import ClusterClient from "./ClusterClient";
import { useSession } from "@/lib/authClient";
import { request } from "http";
import { useEffect, useState } from "react";

export default function ClustersPage() {
  const { data } = useSession();
  const [clusterResponse, updateClustResp] = useState<any[]>([]);

  async function fetchClust(id: string) {
    const request = await fetch(`http://localhost:3000/clusters/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    return response;
  }

  useEffect(() => {
    async function eleba() {
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
      await Promise.all(
        fetchedClustIds.map((clust: any) => fetchClust(clust)),
      ).then((values) => updateClustResp(values));
    }
    eleba();
  }, [data]);

  return (
    <>
      <ClusterClient clusterObj={clusterResponse} />
    </>
  );
}
