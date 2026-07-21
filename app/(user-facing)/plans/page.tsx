"use client";

import PlanCard from "@/app/components/PlanCard";
import { soraClass } from "../../fonts";
import { PlusIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useMyPlans } from "@/app/hooks/queryHooks";
import { CardSkeleton } from "@/app/components/Spinner";

export interface PlanByUser {
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

export default function PlansPage() {
  const { isSuccess, isLoading, userPlans } = useMyPlans();

  return (
    <div className="min-h-full">
      <div className="flex gap-x-4 my-3 items-center">
        <p
          className={`${soraClass} text-2xl lg:text-3xl text-green font-bold md:w-4/5 w-3/5`}
        >
          Your Plans
        </p>
        <Link
          href={"/plans/new"}
          className="text-white text-lg hover:bg-greener bg-green hover:scale-105 rounded-[9999px] p-2 md:p-1 items-center justify-center md:w-1/5 w-auto text-center flex gap-x-4 shrink-0 font-semibold"
        >
          <PlusIcon weight="bold" />
          <span>New Plan</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isSuccess &&
          userPlans &&
          userPlans.map((plan) => <PlanCard planObject={plan} key={plan.id} />)}
        {isLoading && (
          <div className="col-span-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}
        {isSuccess && userPlans?.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-2xl font-bold text-forest-text mb-2">No Plans Yet</p>
            <p className="text-ink-mid mb-6">
              You haven't created or joined any plans yet.
            </p>
            <Link
              href="/plans/new"
              className="inline-flex items-center gap-2 bg-green text-white font-bold rounded-[9999px] px-6 py-3 hover:bg-greener transition-all"
            >
              <PlusIcon weight="bold" />
              Create Your First Plan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
