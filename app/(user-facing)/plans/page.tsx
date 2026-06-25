"use client";

import PlanCard from "@/app/components/PlanCard";
import { soraClass } from "../../fonts";
import { PlusIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/authClient";
import { PlanDetails } from "../cluster/[id]/ClusterDetailsClient";
import { useQuery } from "@tanstack/react-query";

interface PlanByUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  joinedAt: string;
  cluster: {
    id: string;
    accountNumber: string;
  };
  memberCount: number;
}

async function fetchPlan(clustId: string, planId: string) {
  const planReq = await fetch(
    `http://localhost:3000/clusters/${clustId}/plans/${planId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const planRes: PlanDetails = await planReq.json();
  return planRes;
}

export default function PlansPage() {
  const { data } = useSession();

  async function getUserPlans() {
    const userPlansRequest = await fetch(
      `http://localhost:3000/users/${data?.user.id}/plans`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const userPlansResponse: PlanByUser[] = await userPlansRequest.json();
    const requiredIds = userPlansResponse.map((plan) => ({
      planId: plan.id,
      clustId: plan.cluster.id,
    }));
    const results = await Promise.all(
      requiredIds.map(({ planId, clustId }) => fetchPlan(clustId, planId)),
    );
    return results;
  }

  const {
    data: userPlans,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["userPlans"],
    queryFn: getUserPlans,
    staleTime: 1 * 60 * 60 * 1000,
  });

  return (
    <div className="p-4 mx-auto border border-card-border rounded-xl">
      <div className="flex md:gap-x-4 gap-x-2 my-2 items-center">
        <p
          className={`${soraClass} text-2xl lg:text-3xl text-green w-3/5 md:w-4/5 font-bold`}
        >
          Your Plans
        </p>
        <Link
          href={"/plans/new"}
          className="text-white text-lg hover:bg-greener bg-green hover:scale-105 rounded-full p-1 items-center justify-center justify-self-end md:w-1/5 w-2/5 text-center flex gap-x-4"
        >
          <PlusIcon />
          <span>New Plan</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isSuccess &&
          userPlans.map((plan) => <PlanCard planObject={plan} key={plan.id} />)}
        {isLoading && "Loading your plans..."}
      </div>
    </div>
  );
}
