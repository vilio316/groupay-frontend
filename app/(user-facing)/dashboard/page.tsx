"use client";
import { PlusIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { soraClass } from "../../fonts";
import Link from "next/link";
import { TransactionBlock } from "@/app/components/TransactionStatusBlocks";
import ClusterCard from "@/app/components/ClusterCard";
import { BalanceCard } from "@/app/components/BalanceCard";
import PaymentModal from "@/app/components/PaymentModal";
import OnboardingStatusCard from "@/app/components/OnboardingStatusCard";
import { useState } from "react";
import { useSession } from "@/lib/authClient";

export default function DashboardPage() {
  const [showModal, updateModalState] = useState(false);
  const [prompter, updatePrompter] = useState<"add" | "withdraw" | "transfer">(
    "add",
  );
  const { data } = useSession();

  return (
    <div className="grid">
      <PaymentModal
        isShown={showModal}
        onClick={() => {
          updateModalState(!showModal);
        }}
        prompter={prompter}
      />
      <div className="bg-white nameAndBalance px-4 py-2">
        <p className={`${soraClass} text-3xl`}>
          Good day,{" "}
          <span className="text-bold text-green">
            {data?.user.name ? data.user.name.split(" ")[0] : "David"}
          </span>
        </p>
        <div className="md:flex gap-x-4 my-4 px-2">
          <BalanceCard
            payFunct={(string: any) => {
              updateModalState(true);
              updatePrompter(string);
            }}
          />

          <Link
            href="#transactions"
            className="text-white text-md shrink-0 flex self-end justify-self-end bg-green rounded-2xl p-2 hover:bg-[#3db029] transition-all hover:scale-x-105"
          >
            Your Transactions &gt;
          </Link>
        </div>
      </div>
      <OnboardingStatusCard />
      <div className="h-300 content px-4">
        <div className="my-4">
          <p className="font-semibold text-xl uppercase text-ink-mid">
            Your Clusters
          </p>
          <div className="flex items-center gap-x-6">
            <div className="flex shrink-0 gap-x-3 p-3 my-2 w-[90%] overflow-x-scroll">
              <ClusterCard className="md:w-[30%] w-[45%]" />
              <ClusterCard className="md:w-[30%] w-[45%]" />
              <ClusterCard className="md:w-[30%] w-[45%]" />
              <ClusterCard className="md:w-[30%] w-[45%]" />
              <ClusterCard className="md:w-[30%] w-[45%]" />
              <ClusterCard className="md:w-[30%] w-[45%]" />
              <ClusterCard className="md:w-[30%] w-[45%]" />
              <ClusterCard className="md:w-[30%] w-[45%]" />
              <ClusterCard className="md:w-[30%] w-[45%]" />
            </div>

            <Link href="/clusters">
              <ArrowRightIcon className="w-8 h-8 hover:text-greener" />
            </Link>
          </div>
        </div>

        <div className="my-4" id="transactions">
          <p className="uppercase font-semibold text-ink-mid text-xl my-2">
            Your Transactions
          </p>
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
          <TransactionBlock
            transactionObject={{
              status: "fail",
              amount: 4500.56,
            }}
          />
        </div>
      </div>
      <div className="sticky bottom-12 right-8 w-full flex justify-end z-40">
        <Link
          href="/clusters/new"
          className="md:flex items-center justify-center hidden bg-green text-white text-center rounded-full p-2 w-20 h-20 sticky hover:bg-greener transition-all hover:shadow-2xl hover:shadow-card-border hover:translate-y-px"
          title="Create New Cluster"
        >
          <PlusIcon className="h-18 w-18" />
        </Link>
      </div>
    </div>
  );
}

/*₦ */
