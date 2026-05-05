"use client";

import { BalanceCard } from "@/app/components/BalanceCard";
import PlanCard from "@/app/components/PlanCard";
import {
  FailedTransaction,
  PendingTransaction,
  SuccessfulTransaction,
} from "@/app/components/TransactionStatusBlocks";
import { soraClass } from "@/app/fonts";
import { GearSixIcon } from "@phosphor-icons/react";
import {
  ArrowRightIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function ClusterPage() {
  return (
    <div className="p-4 mx-auto">
      <div className="flex gap-x-4 items-center">
        <p className={`${soraClass} w-4/5 text-3xl font-bold text-forest my-3`}>
          ClusterName
        </p>
        <Link
          className="hover:bg-aqua/15 hover:rounded-2xl p-2 flex flex-col w-1/5 justify-end-safe items-center"
          href={"/cluster/234/members"}
        >
          <p>
            <span className="font-bold">22</span> Members
          </p>
          <div className="avatars flex m-1">
            <div className="avatar h-7 w-7 rounded-full flex border-2 border-solid border-white items-center justify-center font-bold -mr-2 bg-yellow-300 text-white">
              <span>C</span>
            </div>
            <div className="avatar h-7 w-7 rounded-full flex border-2 border-solid border-white items-center justify-center font-bold -mr-2 bg-mist text-white">
              <span>A</span>
            </div>
            <div className="avatar h-7 w-7 rounded-full flex border-2 border-solid border-white items-center justify-center font-bold -mr-2 bg-green/80 text-white">
              <span>E</span>
            </div>
            <div className="avatar h-7 w-7 rounded-full border-2 border-solid border-white items-center justify-center font-bold -mr-2 bg-red-400 text-white">
              <span>9+</span>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex gap-x-2">
        <BalanceCard payFunct={() => console.log("Awooga")} />
        <div className="items-center flex p-2 gap-x-4 ">
          <ShareNetworkIcon className="w-12 h-12 fill-green" weight="duotone" />
          <Link href={"/cluster/234/manage"}>
            <GearSixIcon className="w-12 h-12 fill-green" weight="duotone" />
          </Link>
        </div>
      </div>
      <div className="border border-card-border p-1 my-4 rounded-xl">
        <p className="font-semibold uppercase text-ink-mid my-2 px-2">
          Description
        </p>
        <p className="clusterDescription p-2 indent-4">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto
          iure animi pariatur nesciunt qui repellat alias fugit odio. Illum quam
          magnam veritatis accusamus eius perspiciatis! Ullam quas veritatis
          quaerat fuga.
        </p>
      </div>

      <div className="border border-card-border p-1 my-4 rounded-xl">
        <p className="font-semibold uppercase text-ink-mid my-2 px-2">
          Plans in this cluster
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center overflow-x-scroll gap-x-4 w-[90%]">
            <PlanCard />
            <PlanCard />
            <PlanCard />
            <PlanCard />
            <PlanCard />
            <PlanCard />
          </div>
          <ArrowRightIcon className="w-6 h-6 hover:text-greener hover:scale-110 transition-all" />
        </div>
      </div>

      <div className="my-3 p-3 rounded-2xl grid items-center border border-card-border shadow-md shadow-card-border">
        <p className="uppercase text-ink-mid font-semibold my-2">activities</p>
        <div className="grid">
          <SuccessfulTransaction />
          <FailedTransaction />
          <PendingTransaction />
        </div>
      </div>
    </div>
  );
}
