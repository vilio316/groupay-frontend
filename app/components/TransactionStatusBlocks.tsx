import { HourglassHighIcon } from "@phosphor-icons/react";
import {
  CheckCircleIcon,
  CircleHalfIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { makeDate } from "../(user-facing)/notifications/page";

function getStatusClass(status: string) {
  if (status.toLowerCase().includes("success")) return "text-green";
  if (status === "fail") return "text-red";
  if (status === "pending") return "text-amber-300";
}

function setBg(status: string) {
  if (status === "success") return "from-green/20";
  if (status === "fail") return "from-red/20";
  if (status === "pending") return "from-amber-500/25";
}

export function TransactionBlock({
  transactionObject,
}: {
  transactionObject:
    | {
        status: "success" | "fail" | "pending";
        amount: number;
        heading?: string;
        type?: "credit" | "debit";
      }
    | any;
}) {
  const { status, amount, heading, type, createdAt, channel } =
    transactionObject;
  return (
    <Link
      href="/"
      className={`grid grid-cols-12 gap-x-4 p-1 my-2 items-center border-card-border border bg-linear-to-r ${setBg(status)} to-zinc-200/20 rounded-xl hover:scale-x-102 hover:shadow-2xl hover:shadow-card-border transition-all`}
    >
      <div className="col-span-1">
        {status.toLowerCase().includes("success") && (
          <CheckCircleIcon
            weight="light"
            className="text-3xl text-green p-1 h-10 w-10 "
          />
        )}
        {status === "fail" && (
          <XCircleIcon
            weight="light"
            className="text-3xl text-red p-1 h-10 w-10"
          />
        )}
        {status === "pending" && (
          <HourglassHighIcon
            weight="light"
            className="text-3xl text-amber-300 p-1 h-10 w-10"
          />
        )}
      </div>
      <div className="col-span-7 px-3">
        <p className="text-sm md:text-xl">TRANSACTION HEADING</p>
        <p className="text-ink-mid/70 text-[10px] md:text-sm">
          <span>{makeDate(createdAt)}</span> |{" "}
          <span>Handled through {channel}</span>
        </p>
      </div>
      <div className={`${getStatusClass(status)} font-bold col-span-4 p-3`}>
        <p className="text-right text-sm md:text-xl ">
          +&#8358;{" "}
          {channel === "SQUAD"
            ? (Number(amount) / 100).toFixed(2)
            : amount.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}

export function EmptyTransaction() {
  return (
    <div className="m-4 p-4 text-center border-2 border-card-border rounded-xl ">
      <p className="font-semibold text-2xl p-1 my-2">No Recent Transactions</p>
      <p className="text-xl">Your most recent transactions will show up here</p>
    </div>
  );
}
