"use client";
import PlanPage from "./PlanDetailsClient";
import { useParams } from "next/navigation";
import { usePlanDetails } from "@/app/hooks/queryHooks";

export default function PlanDetailsPage() {
  const { id, planID } = useParams();

  const { planResponse, isSuccess, isLoading } = usePlanDetails(
    String(id),
    String(planID),
  );

  return (
    <>
      {isSuccess && planResponse && <PlanPage planObj={planResponse} />}
      {isLoading && <p>Loading...</p>}
    </>
  );
}
