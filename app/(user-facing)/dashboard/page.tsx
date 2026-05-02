import { PlusIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { soraClass } from "../../fonts";
import Link from "next/link";
import {
  FailedTransaction,
  PendingTransaction,
  SuccessfulTransaction,
} from "@/app/components/TransactionStatusBlocks";
import ClusterCard from "@/app/components/ClusterCard";
import { BalanceCard } from "@/app/components/BalanceCard";
// import PaymentModal from "@/app/components/PaymentModal";
// import OnboardingStatusCard from "@/app/components/OnboardingStatusCard";
// // import { PlusIcon } from "@phosphor-icons/react";

export default function DashboardPage() {
  return (
    <div className="grid">
      <div className="bg-white nameAndBalance px-4 py-2">
        <p className={`${soraClass} text-3xl`}>
          Good day, <span className="text-bold text-green">David</span>
        </p>
        <div className="flex gap-x-4 my-4 px-2">
          <BalanceCard />

          <Link
            href="#transactions"
            className="text-white text-md shrink-0 flex self-end justify-self-end bg-green rounded-full p-2 hover:bg-[#3db029] transition-all hover:scale-x-105"
          >
            Your Transactions &gt;
          </Link>
        </div>
      </div>
      <div className="h-300 content px-4">
        <div className="my-4">
          <p className="font-semibold text-xl uppercase text-ink-mid">
            Your Clusters
          </p>
          {/* <div className="p-4 text-center border-2 border-card-border rounded-xl my-4 mx-4">
            <p className="text-center font-semibold p-1 my-2 text-2xl ">
              No Clusters Yet{" "}
            </p>
            <p className="text-xl">
              Click the "+" button to create your own Cluster or join a friend's
              via their invite link
            </p>
          </div> */}
          <div className="flex items-center gap-x-6">
            <div className="flex shrink-0 gap-x-3 p-3 my-2 w-[90%] overflow-x-scroll">
              <ClusterCard className="w-[30%]" />
              <ClusterCard className="w-[30%]" />
              <ClusterCard className="w-[30%]" />
              <ClusterCard className="w-[30%]" />
              <ClusterCard className="w-[30%]" />
              <ClusterCard className="w-[30%]" />
              <ClusterCard className="w-[30%]" />
            </div>

            <Link href="/clusters">
              <ArrowRightIcon className="w-8 h-8" />
            </Link>
          </div>
        </div>

        <div className="my-4" id="transactions">
          <p className="uppercase font-semibold text-ink-mid text-xl my-2">
            Your Transactions
          </p>
          <div className="m-4 p-4 text-center border-2 border-card-border rounded-xl ">
            <p className="font-semibold text-2xl p-1 my-2">
              No Recent Transactions
            </p>
            <p className="text-xl">
              Your most recent transactions will show up here
            </p>
          </div>
          <SuccessfulTransaction />
          <PendingTransaction />
          <FailedTransaction />
        </div>
      </div>
      <div className="sticky bottom-12 right-8 w-full flex justify-end">
        <Link
          href="/clusters/new"
          className="flex items-center justify-cente bg-green text-white text-center rounded-full p-2 w-20 h-20 sticky hover:bg-greener transition-all hover:shadow-2xl hover:shadow-card-border hover:translate-y-px"
          title="Create New Cluster"
        >
          <PlusIcon className="h-18 w-18" />
        </Link>
      </div>
    </div>
  );
}

/*₦ */
