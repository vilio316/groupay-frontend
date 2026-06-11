import { cacheLife } from "next/cache";
import PlanPage from "./PlanDetailsClient";

export default async function PlanDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
    planID: string;
  }>;
}) {
  const { id, planID } = await params;
  async function fetchPlan() {
    "use cache";
    cacheLife("hours");
    const planDetailsRequest = await fetch(
      `http://localhost:3000/clusters/${id}/plans/${planID}`,
    );
    const planDetailsResponse = await planDetailsRequest.json();
    return planDetailsResponse;
  }

  const planResponse = await fetchPlan();

  return <PlanPage planObj={planResponse} />;
}
