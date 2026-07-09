"use client";

import Avatars from "@/app/components/AvatarsCircles";
import { BalanceCard } from "@/app/components/BalanceCard";
import PaymentModal from "@/app/components/PaymentModal";
import PlanCard from "@/app/components/PlanCard";
import { TransactionBlock } from "@/app/components/TransactionStatusBlocks";
import { soraClass } from "@/app/fonts";
import { GearSixIcon, BankIcon } from "@phosphor-icons/react";
import {
  ArrowRightIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useState, useCallback } from "react";
import {
  XIcon,
  CopyIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";

export interface clusterDetailsType {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  accountNumber: string;
  desc: string;
  members: ClusterMember[];
  plans: PlanDetails[];
  transactions: any[];
  accountBalance: string;
}

export interface PlanDetails {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  minimumContribution: string;
  desc: string;
  members: ClusterMember[];
  transactions: any[];
  planType: string;
  clusterId: string;
}

export interface ClusterMember {
  id: string;
  joinedAt: string;
  userId: string;
  clusterId: string;
  user: User;
}

export interface User {
  id: string;
  image: string;
  phone: string;
  name: string;
  email: string;
}

export default function ClusterDetailsClient({
  detailsObject,
}: {
  detailsObject: clusterDetailsType;
}) {
  const { name, id, desc, accountNumber, plans, members, accountBalance } =
    detailsObject;
  const [isModalShown, showModal] = useState(false);
  const [promptButton, updatePrompter] = useState<
    "add" | "withdraw" | "transfer"
  >("add");
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (accountNumber) {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [accountNumber]);
  return (
    <div className="p-4 mx-auto">
      <div className="flex gap-x-4 items-center">
        <p
          className={`${soraClass} md:w-5/6 w-2/3 md:text-3xl text-xl font-bold text-forest my-3`}
        >
          {detailsObject ? name : "ClusterName"}
        </p>
        <Link
          className="hover:bg-aqua/15 hover:rounded-2xl p-2 flex flex-col max-w-1/5 justify-end items-center text-right"
          href={`/cluster/${id}/members`}
        >
          <span className="w-full justify-self-end">
            {detailsObject ? members.length : ""} Members
          </span>
          <Avatars className="justify-end w-full" members={members} />
        </Link>
      </div>
      <div className="flex gap-x-2 flex-col md:flex-row ">
        <BalanceCard
          balance={Number(accountBalance)}
          payFunct={(string: any) => {
            showModal(true);
            updatePrompter(string);
          }}
        />
        <div className="items-center justify-end flex p-2 gap-x-4 ">
          <button
            title={accountNumber ? "View account" : "Add account"}
            className="flex flex-col items-center gap-1 group"
            onClick={() => setShowAccountModal(true)}
          >
            <BankIcon
              weight={accountNumber ? "fill" : "duotone"}
              className={`w-12 h-12 p-2 rounded-xl transition-all ${
                accountNumber
                  ? "fill-green bg-green/10"
                  : "fill-mist bg-mist/20 group-hover:fill-green group-hover:bg-green/10"
              }`}
            />
            <span className="text-[10px] text-ink-mid whitespace-nowrap">
              {accountNumber ? "Account" : "Add Account"}
            </span>
          </button>
          <ShareNetworkIcon className="w-12 h-12 fill-green" weight="duotone" />
          <Link href={`/cluster/${id}/manage`}>
            <GearSixIcon className="w-12 h-12 fill-green" weight="duotone" />
          </Link>
        </div>
      </div>
      <div className="border border-card-border p-1 my-4 rounded-xl">
        <p className="font-semibold uppercase text-ink-mid my-2 px-2">
          Description
        </p>
        <p className="clusterDescription p-2 indent-4">
          {detailsObject ? desc : ""}
        </p>
      </div>

      <div className="border border-card-border p-1 my-4 rounded-xl">
        <p className="font-semibold uppercase text-ink-mid my-2 px-2">
          Plans in this cluster ({plans.length})
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center overflow-x-scroll gap-x-4 w-[90%]">
            {plans.map((plan) => (
              <PlanCard planObject={plan} key={plan.id} />
            ))}
          </div>
          <ArrowRightIcon className="w-6 h-6 hover:text-greener hover:scale-110 transition-all" />
        </div>
      </div>

      <div className="my-3 p-3 rounded-2xl grid items-center border border-card-border shadow-md shadow-card-border">
        <p className="uppercase text-ink-mid font-semibold my-2">activities</p>
        <div className="grid"></div>
      </div>

      {/* Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-forest/50 p-3">
          <div className="bg-white rounded-[20px] max-w-[520px] w-full p-6 shadow-modal relative">
            <button
              onClick={() => setShowAccountModal(false)}
              className="absolute top-4 right-4 text-ink hover:text-red transition-colors"
            >
              <XIcon className="w-6 h-6" weight="bold" />
            </button>

            {accountNumber ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
                  <BankIcon className="w-8 h-8 fill-green" weight="fill" />
                </div>
                <h3 className={`${soraClass} text-xl font-bold text-forest mb-2`}>
                  Cluster Account
                </h3>
                <p className="text-sm text-ink-mid mb-6">
                  Share these details to receive payments into this cluster.
                </p>

                <div className="border border-card-border rounded-xl p-4 mb-4 text-left space-y-3">
                  <div>
                    <p className="text-xs uppercase font-semibold text-ink-mid tracking-wider mb-1">
                      Account Name
                    </p>
                    <p className="text-forest font-bold text-lg">{name}</p>
                  </div>
                  <div className="border-t border-card-border/50" />
                  <div>
                    <p className="text-xs uppercase font-semibold text-ink-mid tracking-wider mb-1">
                      Account Number
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-forest font-bold text-2xl tracking-widest font-mono">
                        {accountNumber}
                      </p>
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg hover:bg-green/10 transition-all shrink-0"
                        title="Copy account number"
                      >
                        {copied ? (
                          <CheckCircleIcon className="w-5 h-5 fill-green" weight="bold" />
                        ) : (
                          <CopyIcon className="w-5 h-5 text-ink-mid" weight="bold" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowAccountModal(false)}
                  className="w-full py-3 rounded-full bg-green text-white font-bold hover:bg-greener transition-all"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-mist/20 flex items-center justify-center mx-auto mb-4">
                  <BankIcon className="w-8 h-8 fill-mist" weight="duotone" />
                </div>
                <h3 className={`${soraClass} text-xl font-bold text-forest mb-2`}>
                  No Account Yet
                </h3>
                <p className="text-sm text-ink-mid mb-6">
                  This cluster doesn't have a dedicated account yet. Create one to
                  receive payments directly.
                </p>

                <button
                  onClick={() => {
                    setShowAccountModal(false);
                    showModal(true);
                    updatePrompter("add");
                  }}
                  className="w-full py-3 rounded-full bg-green text-white font-bold hover:bg-greener transition-all mb-3"
                >
                  Create Account
                </button>
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="w-full py-3 rounded-full border border-card-border text-ink-mid font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <PaymentModal
        onClick={() => {
          showModal(false);
        }}
        accountNumber={accountNumber}
        isShown={isModalShown}
        prompter={promptButton}
      />
    </div>
  );
}
