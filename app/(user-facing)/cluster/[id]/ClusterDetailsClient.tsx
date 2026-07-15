"use client";

import Avatars from "@/app/components/AvatarsCircles";
import { BalanceCard } from "@/app/components/BalanceCard";
import PaymentModal from "@/app/components/PaymentModal";
import PlanCard from "@/app/components/PlanCard";
import { soraClass } from "@/app/fonts";
import { GearSixIcon, BankIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import {
  ArrowRightIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useState, useCallback, useMemo } from "react";
import {
  TransactionBlock,
  EmptyTransaction,
} from "@/app/components/TransactionStatusBlocks";
import { XIcon, CopyIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { useSession } from "@/lib/authClient";
import {
  useQueryClient,
  useMutation,
  QueryClient,
} from "@tanstack/react-query";

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
  const {
    name,
    id,
    desc,
    accountNumber,
    plans,
    members,
    accountBalance,
    transactions,
  } = detailsObject;
  const [isModalShown, showModal] = useState(false);
  const [promptButton, updatePrompter] = useState<
    "add" | "withdraw" | "transfer"
  >("add");
  const [liveAccountNumber, setAccountNumber] = useState(accountNumber);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [txPage, setTxPage] = useState(0);
  const TXS_PER_PAGE = 10;

  const paginatedTxs = useMemo(() => {
    if (!transactions) return [];
    const sorted = [...transactions].sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return sorted.slice(txPage * TXS_PER_PAGE, (txPage + 1) * TXS_PER_PAGE);
  }, [transactions, txPage]);

  const totalPages = transactions
    ? Math.ceil(transactions.length / TXS_PER_PAGE)
    : 0;

  const handleCopy = useCallback(async () => {
    const an = accountNumber;
    if (an) {
      await navigator.clipboard.writeText(an);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [accountNumber]);

  // const handleAccountCreated = (newAccountNumber: string) => {
  //   setaccountNumber(newAccountNumber);
  //   setShowCreateAccountForm(false);
  //   queryClient.invalidateQueries({ queryKey: ["cluster", id] });
  // };

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
            onClick={() => {
              if (accountNumber !== "1234567890") {
                setShowAccountModal(true);
              } else {
                setShowCreateAccountForm(true);
              }
            }}
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

      <div className="my-3 p-3 rounded-2xl border border-card-border shadow-md shadow-card-border">
        <p className="uppercase text-ink-mid font-semibold my-2">
          activities
          {transactions && transactions.length > 0 && (
            <span className="text-xs font-normal text-ink-mid/70 lowercase ml-2">
              ({transactions.length})
            </span>
          )}
        </p>
        <div className="grid">
          {transactions && transactions.length > 0 ? (
            paginatedTxs.map((txn: any) => (
              <TransactionBlock
                key={txn.id}
                transactionObject={txn}
                contextClusterId={id}
              />
            ))
          ) : (
            <EmptyTransaction />
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-card-border">
            <button
              onClick={() => setTxPage((p) => Math.max(0, p - 1))}
              disabled={txPage === 0}
              className="px-3 py-1.5 text-xs font-semibold rounded-full border border-card-border text-ink-mid hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setTxPage(i)}
                className={`w-7 h-7 text-xs font-semibold rounded-full transition-all ${
                  i === txPage
                    ? "bg-green text-white"
                    : "border border-card-border text-ink-mid hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setTxPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={txPage === totalPages - 1}
              className="px-3 py-1.5 text-xs font-semibold rounded-full border border-card-border text-ink-mid hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-forest/50 p-3">
          <div className="bg-white rounded-[20px] max-w-130 w-full p-6 shadow-modal relative">
            <button
              onClick={() => setShowAccountModal(false)}
              className="absolute top-4 right-4 text-ink hover:text-red transition-colors"
            >
              <XIcon className="w-6 h-6" weight="bold" />
            </button>

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
                      {liveAccountNumber}
                    </p>
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-lg hover:bg-green/10 transition-all shrink-0"
                      title="Copy account number"
                    >
                      {copied ? (
                        <CheckCircleIcon
                          className="w-5 h-5 fill-green"
                          weight="bold"
                        />
                      ) : (
                        <CopyIcon
                          className="w-5 h-5 text-ink-mid"
                          weight="bold"
                        />
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
          </div>
        </div>
      )}

      {/* Create Account Form Modal */}
      {showCreateAccountForm && (
        <RequestClusterAccountModal
          clusterId={id}
          clusterName={name}
          onBack={() => setShowCreateAccountForm(false)}
          onClose={() => setShowCreateAccountForm(false)}
          onComplete={(number: string) => {
            setShowCreateAccountForm(false);
            setShowAccountModal(true);
            setAccountNumber(number);
          }}
        />
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

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs uppercase font-semibold text-ink-mid tracking-wider mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-xl border border-card-border px-4 py-2.5 text-sm text-forest bg-white focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green transition-all"
      />
    </div>
  );
}

function RequestClusterAccountModal({
  clusterId,
  clusterName,
  onBack,
  onClose,
  onComplete,
}: {
  clusterId: string;
  clusterName: string;
  onBack: () => void;
  onClose: () => void;
  onComplete: (number: string) => void;
}) {
  const { data } = useSession();
  const [error, setError] = useState("");

  const prefillPhone = data?.user?.phone || "";

  const [formData, setFormData] = useState({
    customer_identifier: clusterName,
    business_name: clusterName,
    mobile_num: prefillPhone,
    bvn: "",
  });

  const isComplete =
    formData.customer_identifier.trim() &&
    formData.business_name.trim() &&
    formData.mobile_num.trim() &&
    formData.bvn.trim();

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const qc = new QueryClient();

  const {
    isPending,
    mutateAsync: createClusterAccount,
    isSuccess,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/squad/virtual/cluster/${clusterId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              beneficiary_account: process.env.NEXT_PUBLIC_BENEFICIARY_ACCOUNT,
            }),
            credentials: "include",
          },
        );
        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          throw new Error(errBody?.message || `Request failed (${res.status})`);
        }
        const result = await res.json();
        return result;
      } catch (error) {
        throw new Error("An error occurred!");
      }
    },
    onSuccess: async (data) => {
      await qc.invalidateQueries({
        queryKey: ["cluster", clusterId],
      });
      onComplete(data.data.virtual_account_number);
    },
  });

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-forest/50 p-3">
      <div className="bg-white rounded-[20px] max-w-130 w-full p-6 shadow-modal relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-ink hover:text-green transition-colors"
          title="Go back"
        >
          <ArrowLeftIcon className="w-6 h-6" weight="bold" />
        </button>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink hover:text-red transition-colors"
        >
          <XIcon className="w-6 h-6" weight="bold" />
        </button>

        <div className="text-center mb-6 mt-4">
          <h3 className={`${soraClass} text-xl font-bold text-forest`}>
            Request Account for {clusterName}
          </h3>
          <p className="text-sm text-ink-mid mt-1">
            Fill in your details to create a dedicated account for this cluster.
          </p>
        </div>

        <div className="space-y-4">
          <FormField
            label="Customer Identifier"
            value={formData.customer_identifier}
            onChange={(v) => updateField("customer_identifier", v)}
            placeholder="SQUAD_101"
          />
          <FormField
            label="Business Name"
            value={formData.business_name}
            onChange={(v) => updateField("business_name", v)}
            placeholder="Business name"
          />
          <FormField
            label="Mobile Number"
            type="tel"
            value={formData.mobile_num}
            onChange={(v) => updateField("mobile_num", v)}
            placeholder="08012345678"
          />
          <FormField
            label="BVN"
            value={formData.bvn}
            onChange={(v) => updateField("bvn", v)}
            placeholder="Enter your BVN"
            maxLength={11}
          />
          {error && (
            <p className="text-sm text-red-600 bg-red/5 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <button
            onClick={() => createClusterAccount()}
            disabled={!isComplete || isPending}
            className="w-full py-3 rounded-full bg-green text-white font-bold hover:bg-greener transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-2"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Submitting...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
