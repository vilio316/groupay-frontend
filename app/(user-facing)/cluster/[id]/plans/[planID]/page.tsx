"use client";
import PlanPage from "./PlanDetailsClient";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function PlanDetailsPage() {
  const { id, planID } = useParams();
  async function fetchPlan() {
    const planDetailsRequest = await fetch(
      `http://localhost:3000/clusters/${id}/plans/${planID}`,
    );
    const planDetailsResponse = await planDetailsRequest.json();
    return planDetailsResponse;
  }

  const {
    data: planResponse,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["plan", planID],
    queryFn: fetchPlan,
    staleTime: 1 * 60 * 60 * 1000,
  });

  return (
    <>
      {isSuccess && <PlanPage planObj={planResponse} />}
      {isLoading && <p>Loading...</p>}
    </>
  );
}
