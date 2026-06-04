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
  const planDetailsRequest = await fetch(
    `http://localhost:3000/clusters/${id}/plans/${planID}`,
  );
  const planDetailsResponse = await planDetailsRequest.json();
  return <PlanPage planObj={planDetailsResponse} />;
}
