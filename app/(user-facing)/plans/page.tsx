"use client";

import PlanCard from "@/app/components/PlanCard";
import { soraClass } from "../../fonts";
import { PlusIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function PlansPage() {
  return (
    <div className="p-4 mx-auto border border-card-border rounded-xl">
      <div className="flex md:gap-x-4 gap-x-2 my-2 items-center">
        <p
          className={`${soraClass} text-xl lg:text-3xl text-green w-3/5 md:w-4/5`}
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
        <PlanCard />
        <PlanCard />
        <PlanCard />
        <PlanCard />
        <PlanCard />
      </div>
    </div>
  );
}
