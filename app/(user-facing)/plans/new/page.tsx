import { cacheLife } from "next/cache";
import PlanCreationClient from "./PlanCreationClient";

export interface ClusterResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  desc: string;
  accountNumber: string;
  accountBalance: number;
}

export default async function CreatePlan() {
  "use cache";
  cacheLife("hours");
  const fetchClustersRequest = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters`,
    {
      credentials: "include",
    },
  );
  const clustersResponse: ClusterResponse[] = await fetchClustersRequest.json();
  return <PlanCreationClient clusters={clustersResponse} />;
}
