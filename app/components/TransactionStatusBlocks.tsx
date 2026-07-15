"use client";

import {
  HourglassHighIcon,
  XIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import {
  CheckCircleIcon,
  CircleHalfIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { createPortal } from "react-dom";
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

function formatAmount(amount: number, channel?: string) {
  if (channel === "SQUAD" || channel === "groupay-account") {
    return (Number(amount) / 100).toFixed(2);
  }
  return amount.toFixed(2);
}

function statusIcon(status: string, className?: string) {
  if (status.toLowerCase().includes("success"))
    return <CheckCircleIcon weight="light" className={className} />;
  if (status === "fail")
    return <XCircleIcon weight="light" className={className} />;
  if (status === "pending")
    return <HourglassHighIcon weight="light" className={className} />;
  return null;
}

export function TransactionBlock({
  transactionObject,
}: {
  transactionObject:
    | {
        id: string;
        status: "success" | "fail" | "pending";
        amount: number;
        transactionHeading: string;
        createdAt: string;
        channel?: string;
        transactionRef?: string;
        type?: string;
        clusterId?: string | null;
        planId?: string | null;
      }
    | any;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    status,
    amount,
    createdAt,
    channel,
    transactionHeading,
    id,
    transactionRef,
  } = transactionObject;

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={`w-full grid grid-cols-12 gap-x-4 p-1 my-2 items-center border-card-border border bg-linear-to-r ${setBg(status)} to-zinc-200/20 rounded-xl hover:scale-x-102 hover:shadow-2xl hover:shadow-card-border transition-all cursor-pointer text-left`}
      >
        <div className="col-span-1">
          {statusIcon(status, "text-3xl text-green p-1 h-10 w-10")}
        </div>
        <div className="col-span-7 px-3 min-w-0">
          <p className="text-sm md:text-xl h-8 w-full truncate">
            {transactionHeading}
          </p>
          <p className="text-ink-mid/70 text-[10px] md:text-sm">
            <span>{makeDate(createdAt)}</span>
            {channel && (
              <>
                {" "}
                | <span>Handled through {channel}</span>
              </>
            )}
          </p>
        </div>
        <div
          className={`${getStatusClass(status)} font-bold col-span-4 md:p-3 p-1`}
        >
          <p className="text-right text-[10px] md:text-xl">
            +&#8358; {formatAmount(amount, channel)}
          </p>
        </div>
      </button>

      {modalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-forest/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) setModalOpen(false);
            }}
          >
            <div className="bg-white rounded-[20px] shadow-modal w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Transaction Details</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XIcon className="w-5 h-5 text-ink" weight="bold" />
                </button>
              </div>

              <div className="flex items-center gap-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center">
                  {statusIcon(status, "text-2xl text-green h-6 w-6")}
                </div>
                <div>
                  <p className="font-semibold text-forest text-base">
                    {transactionHeading}
                  </p>
                  <span
                    className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                      status.toLowerCase().includes("success")
                        ? "bg-green/10 text-green"
                        : status === "fail"
                          ? "bg-red/10 text-red"
                          : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {status.toLowerCase().includes("success")
                      ? "Successful"
                      : status === "fail"
                        ? "Failed"
                        : "Pending"}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-card-border divide-y divide-card-border">
                <div className="flex justify-between items-center py-3 px-4">
                  <span className="text-sm text-ink-mid">Amount</span>
                  <span className="text-sm font-semibold text-forest">
                    &#8358; {formatAmount(amount, channel)}
                  </span>
                </div>
                <Row label="Channel" value={channel || "—"} />
                <Row label="Date" value={makeDate(createdAt)} />
                {id && <Row label="Transaction ID" value={id} mono />}
                {transactionRef && (
                  <Row label="Reference" value={transactionRef} mono />
                )}
                {transactionObject.type && (
                  <Row label="Type" value={transactionObject.type} />
                )}
              </div>

              <button
                onClick={() => {
                  /* UI only — receipt download not yet wired */
                }}
                className="w-full flex items-center justify-center gap-x-2 mt-6 bg-green text-white font-semibold rounded-[9999px] py-3 px-6 hover:bg-greener transition-all"
              >
                <DownloadSimpleIcon weight="bold" className="w-5 h-5" />
                Download Receipt
              </button>
            </div>
          </div>,
          document.getElementById("modal-portal") || document.body,
        )}
    </>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-3 px-4">
      <span className="text-sm text-ink-mid">{label}</span>
      <span
        className={`text-sm font-semibold text-forest text-right ${
          mono ? "font-mono text-xs tracking-tight" : ""
        }`}
      >
        {value}
      </span>
    </div>
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
