import MembersClient from "../../../members/MembersClient";
import { PlanDetails } from "../../../ClusterDetailsClient";

export default async function MembersPage({
  params,
}: {
  params: Promise<{
    id: string;
    planID: string;
  }>;
}) {
  const { id, planID } = await params;
  const planRequest = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/${id}/plans/${planID}`,
    {
      credentials: "include",
    },
  );
  const planResponse: PlanDetails = await planRequest.json();
  const { members: planMembers } = planResponse;
  return <MembersClient members={planMembers} />;
}
