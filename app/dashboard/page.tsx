import { BellIcon, UserIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { sora } from "../fonts";
import Link from "next/link";
// import { PlusIcon } from "@phosphor-icons/react";

export default function DashboardPage() {
  return (
    <div className="grid">
      <div className="flex w-full py-2 items-center gap-x-4 justify-end top-icons">
        <BellIcon className="flex w-8 h-8 fill-green" />
        <UserIcon className="flex w-8 h-8 fill-green" />
      </div>

      <div className="sticky top-0 z-20 bg-white nameAndBalance">
        <p className={`${sora.className} text-3xl`}>
          Good day, <span className="text-bold text-green">David</span>
        </p>
        <div className="flex gap-x-4 my-4">
          <div className="w-3/4">
            <p className="uppercase font-semibold text-ink-mid">
              Total balance:{" "}
            </p>
            <p className="font-semibold text-2xl">&#8358; 24,391.67</p>
          </div>

          <Link
            href="/"
            className="text-white flex self-end justify-self-end bg-green rounded-full p-2 hover:bg-[#3db029] transition-all hover:scale-x-105"
          >
            Your Transactions &gt;
          </Link>
        </div>
      </div>

      <div className="h-300 content">
        <div className="my-2">
          <p className="font-semibold text-xl uppercase text-ink-mid">
            Your Clusters
          </p>
          <div className="p-4 text-center border-2 border-card-border rounded-xl my-4 mx-4">
            <p className="text-center font-semibold p-1 my-2 text-2xl ">
              No Clusters Yet{" "}
            </p>
            <p className="text-xl">
              Click the "+" button to create your own Cluster or join a friend's
              via their invite link
            </p>
          </div>
        </div>

        <div className="my-2 ">
          <p className="uppercase text-semibold text-ink-mid">
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
