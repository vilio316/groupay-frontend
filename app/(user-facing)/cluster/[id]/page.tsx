"use client";

import Avatars from "@/app/components/AvatarsCircles";
import { BalanceCard } from "@/app/components/BalanceCard";
import PaymentModal from "@/app/components/PaymentModal";
import PlanCard from "@/app/components/PlanCard";
import { TransactionBlock } from "@/app/components/TransactionStatusBlocks";
import { soraClass } from "@/app/fonts";
import { GearSixIcon } from "@phosphor-icons/react";
import {
  ArrowRightIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useState } from "react";

export default function ClusterPage() {
  const [isModalShown, showModal] = useState(false);
  const [promptButton, updatePrompter] = useState<
    "add" | "withdraw" | "transfer"
  >("add");
  return (
    <div className="p-4 mx-auto">
      <div className="flex gap-x-4 items-center">
        <p className={`${soraClass} w-5/6 text-3xl font-bold text-forest my-3`}>
          ClusterName
        </p>
        <Link
          className="hover:bg-aqua/15 hover:rounded-2xl p-2 flex flex-col max-w-1/5 justify-end items-center text-right"
          href={"/cluster/234/members"}
        >
          <span className="w-full justify-self-end">22 Members</span>
          <Avatars className="justify-end w-full" />
        </Link>
      </div>
      <div className="flex gap-x-2 flex-col md:flex-row ">
        <BalanceCard
          payFunct={(string: any) => {
            showModal(true);
            updatePrompter(string);
          }}
        />
        <div className="items-center justify-end flex p-2 gap-x-4 ">
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
          <TransactionBlock
            transactionObject={{
              status: "success",
              amount: 4000,
            }}
          />
          <TransactionBlock
            transactionObject={{
              status: "pending",
              amount: 3450.56,
            }}
          />{" "}
        </div>
      </div>

      <PaymentModal
        onClick={() => {
          showModal(false);
        }}
        isShown={isModalShown}
        prompter={promptButton}
      />
    </div>
  );
}
