"use client";
import Avatars from "@/app/components/AvatarsCircles";
import PaymentModal from "@/app/components/PaymentModal";
import {
  FailedTransaction,
  SuccessfulTransaction,
} from "@/app/components/TransactionStatusBlocks";
import { soraClass } from "@/app/fonts";
import { CheckCircleIcon, HandDepositIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

export default function PlanPage() {
  const [isPaying, updatePaymentStatus] = useState(false);
  const [hasContributed] = useState(false);
  const [joinedState] = useState(true);
  return (
    <div className="px-4 my-2 mx-auto">
      <div className="flex items-center">
        <div className="w-4/5 p-2">
          <p
            className={`
                ${soraClass} my-3 font-bold text-green text-3xl
                `}
          >
            PlanName
          </p>
          <span className="text-right uppercase bg-aqua/40 rounded-full p-2 text-ink-mid text-[11px]">
            Subscription
          </span>
        </div>

        <div className="w-1/5 flex justify-end p-1 gap-x-4">
          {joinedState && (
            <button className="rounded-xl p-2 border uppercase text-red border-red hover:bg-red hover:text-white hover:scale-105 transition-all shrink-0">
              Exit Plan
            </button>
          )}
          {!joinedState && (
            <button className="rounded-xl p-2 uppercase text-white bg-teal hover:text-white hover:scale-105 transition-all shrink-0 ">
              Ask to Join
            </button>
          )}
        </div>
      </div>
      <div className="border border-card-border shadow-sm shadow-card-border rounded-xl md:p-4 p-2 my-2">
        <div className="flex gap-x-4 my-2 items-end">
          <p className="uppercase text-ink-mid text-xl font-bold my-2 w-4/5">
            Details
          </p>

          <Link
            href="../plans/101/members"
            className="flex justify-end p-1 text-end flex-col w-1/5"
          >
            <p className="text-sm capitalize text-ink-mid font-bold">
              3/6 members paid
            </p>
            <Avatars className="justify-end" />
          </Link>
        </div>
        <div className="details">
          <div className="flex gap-x-4 items-center">
            <div className="details-text w-4/5">
              <p>Your Contribution Amount: &#8358; {(1234).toLocaleString()}</p>
              <p>Contribution Status: 60%</p>
            </div>

            <div className="w-1/5 flex justify-end p-2">
              <button
                className={`text-white bg-green hover:bg-greener rounded-xl uppercase hover:scale-105 transition-all p-2 flex items-center gap-x-2 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-green `}
                onClick={() => updatePaymentStatus(true)}
                disabled={hasContributed}
              >
                {hasContributed ? (
                  <CheckCircleIcon
                    className="text-white text-xl"
                    weight="bold"
                  />
                ) : (
                  <HandDepositIcon
                    className="text-white text-xl"
                    weight="bold"
                  />
                )}
                {hasContributed ? "Contributed" : "Contribute"}
              </button>
            </div>
          </div>

          <div className="description my-4">
            <p className="uppercase text-ink-mid font-bold text-lg">
              Description
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
              esse, eius ad iure modi, dignissimos rem animi commodi vero unde
              quos molestias voluptas ex odio? Error consectetur voluptates unde
              enim.
            </p>
          </div>

          <div className="recentActions my-4">
            <p className="text-ink-mid font-bold uppercase text-lg">
              Recent Transactions
            </p>
            <div className="transactions">
              <SuccessfulTransaction />
              <SuccessfulTransaction />
              <SuccessfulTransaction />
              <FailedTransaction />
            </div>
          </div>
        </div>
      </div>
      <PaymentModal
        isShown={isPaying}
        onClick={() => updatePaymentStatus(false)}
      />
    </div>
  );
}
