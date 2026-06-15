import { cacheLife } from "next/cache";
import PlanPage from "./PlanDetailsClient";
import { Suspense } from "react";
import { cacheTag } from "next/cache";

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
    cacheTag(`plan_${planID}`);
    const planDetailsRequest = await fetch(
      `http://localhost:3000/clusters/${id}/plans/${planID}`,
    );
    const planDetailsResponse = await planDetailsRequest.json();
    return planDetailsResponse;
  }

  const planResponse = await fetchPlan();

  return (
    <Suspense fallback="Fetching Plan Details">
      <PlanPage planObj={planResponse} />{" "}
    </Suspense>
  );
}
