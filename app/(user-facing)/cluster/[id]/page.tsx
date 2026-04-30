import { BalanceCard } from "@/app/components/BalanceCard";
import {
  FailedTransaction,
  PendingTransaction,
  SuccessfulTransaction,
} from "@/app/components/TransactionStatusBlocks";
import { soraClass } from "@/app/fonts";
import { ShareNetworkIcon } from "@phosphor-icons/react/dist/ssr";

export default async function ClusterPage() {
  return (
    <div className="mx-auto p-4">
      <div className="flex gap-x-4 items-center">
        <p
          className={`${soraClass} w-[90%] text-3xl font-bold text-forest my-3`}
        >
          ClusterName
        </p>
        <p>22 Members</p>
      </div>
      <div className="flex gap-x-2">
        <BalanceCard />
        <div className="items-center flex ">
          <ShareNetworkIcon
            className="justify-center w-12 h-12 fill-green"
            weight="duotone"
          />
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
