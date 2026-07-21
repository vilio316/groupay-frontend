"use client";
import PlanPage from "./PlanDetailsClient";
import { useParams } from "next/navigation";
import { usePlanDetails } from "@/app/hooks/queryHooks";
import { BalanceSkeleton, ListSkeleton } from "@/app/components/Spinner";
import InlineError from "@/app/components/InlineError";

export default function PlanDetailsPage() {
  const { id, planID } = useParams();

  const { planResponse, isSuccess, isLoading, planDetailsError, refetchPlan } = usePlanDetails(
    String(id),
    String(planID),
  );

  return (
    <>
      {planDetailsError && (
        <div className="p-4">
          <InlineError
            message="Could not load plan details"
            retry={refetchPlan}
          />
        </div>
      )}
      {isSuccess && planResponse && <PlanPage planObj={planResponse} />}
      {isLoading && (
        <div className="p-4 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-8 bg-mist/20 rounded animate-pulse w-1/3" />
            <div className="h-6 bg-mist/10 rounded animate-pulse w-1/6 ml-auto" />
          </div>
          <div className="border border-card-border rounded-xl p-6 space-y-4">
            <div className="h-5 bg-mist/20 rounded animate-pulse w-1/4" />
            <BalanceSkeleton />
            <div className="h-3 bg-mist/10 rounded animate-pulse w-full" />
            <div className="h-3 bg-mist/10 rounded animate-pulse w-3/4" />
            <ListSkeleton rows={2} />
          </div>
        </div>
      )}
    </>
  );
}
