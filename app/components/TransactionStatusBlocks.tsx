import {
  CheckCircleIcon,
  CircleHalfIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export function SuccessfulTransaction() {
  return (
    <Link
      href="/"
      className="grid grid-cols-12 gap-x-4 p-1 my-2 items-center border-card-border border bg-linear-to-r from-green/20 to-zinc-200/20 rounded-xl hover:scale-x-102 hover:shadow-2xl hover:shadow-card-border transition-all"
    >
      <div className="p-3 col-span-1">
        <CheckCircleIcon weight="light" className="h-12 w-12 p-2 text-green" />
      </div>
      <div className="col-span-7">
        <p>TRANSACTION HEADING</p>
        <p className="text-ink-mid/70">
          <span>22/07/2026, 11:30:44 AM </span>|{" "}
          <span>Transaction Category</span>
        </p>
      </div>
      <div className="text-green font-bold col-span-4 p-3">
        <p className="text-right text-green text-xl ">
          +&#8358; TRANSACTION_AMOUNT
        </p>
      </div>
    </Link>
  );
}

export function FailedTransaction() {
  return (
    <Link
      href="/"
      className="grid grid-cols-12 gap-x-4 p-1 my-2 items-center border-card-border border bg-linear-to-r from-red/35 to-zinc-200/20 rounded-xl hover:scale-x-102 hover:shadow-2xl hover:shadow-card-border transition-all"
    >
      <div className="p-3 col-span-1">
        <XCircleIcon weight="light" className="h-12 w-12 p-2 text-red" />
      </div>
      <div className="col-span-7">
        <p>TRANSACTION HEADING</p>
        <p className="text-ink-mid/70">
          <span>22/07/2026, 11:30:44 AM </span>|{" "}
          <span>Transaction Category</span>
        </p>
      </div>
      <div className="text-red font-bold col-span-4 p-3">
        <p className="text-right text-xl">-&#8358; TRANSACTION_AMOUNT</p>
      </div>
    </Link>
  );
}

export function PendingTransaction() {
  return (
    <Link
      href="/"
      className="grid grid-cols-12 gap-x-4 p-1 my-2 items-center border-card-border border bg-linear-to-r from-amber-500/35 to-zinc-200/20 rounded-xl hover:scale-x-102 hover:shadow-2xl hover:shadow-card-border transition-all"
    >
      <div className="p-3 col-span-1 flex justify-center">
        <CircleHalfIcon
          weight="light"
          className="h-12 w-12 p-2 text-amber-500"
        />
      </div>
      <div className="col-span-7">
        <p>TRANSACTION HEADING</p>
        <p className="text-ink-mid/70">
          <span>22/07/2026, 11:30:45 AM </span>|{" "}
          <span>Transaction Category</span>
        </p>
      </div>
      <div className="text-amber font-bold col-span-4 p-3">
        <p className="text-right text-amber-500 text-xl">+&#8358; 10045.25</p>
      </div>
    </Link>
  );
}
