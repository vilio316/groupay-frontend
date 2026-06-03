import PlanPage from "./PlanDetailsClient";

export default async function PlanDetailsPage({
  params,
}: {
  params: Promise<{
    planID: string;
  }>;
}) {
  const { planID } = await params;
  const planDetailsRequest = await fetch(
    `http://localhost:3000/clusters/5aca43fe-f812-4ebe-88ec-027520a29346/plans/${planID}`,
  );
  const planDetailsResponse = await planDetailsRequest.json();
  return <PlanPage planObj={planDetailsResponse} />;
}
