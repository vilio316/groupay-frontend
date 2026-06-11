import { cacheLife } from "next/cache";
import PlanCreationClient from "./PlanCreationClient";

export default async function CreatePlan() {
  "use cache";
  cacheLife("hours");
  const fetchClustersRequest = await fetch("http://localhost:3000/clusters", {
    credentials: "include",
  });
  const clustersResponse = await fetchClustersRequest.json();
  return <PlanCreationClient clusters={clustersResponse} />;
}
