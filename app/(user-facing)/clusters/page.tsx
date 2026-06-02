import { Suspense } from "react";
import ClusterClient from "./ClusterClient";

export default async function ClustersPage() {
  const clusterRequest = await fetch("http://localhost:3000/clusters", {
    credentials: "include",
  });
  const clusterResponse = await clusterRequest.json();

  return (
    <Suspense fallback={"Loading..."}>
      <ClusterClient clusterObj={clusterResponse} />
    </Suspense>
  );
}
