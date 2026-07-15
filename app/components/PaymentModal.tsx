"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  AtIcon,
  BankIcon,
  WalletIcon,
  XIcon,
  MoneyWavyIcon,
} from "@phosphor-icons/react";
import { soraClass } from "../fonts";
import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/authClient";
import type { User } from "../(user-facing)/cluster/[id]/ClusterDetailsClient";

export default function PaymentModal({
  isShown,
  onClick,
  accountNumber,
  prompter,
  planId,
}: {
  isShown?: boolean;
  accountNumber: string;
  onClick: () => void;
  prompter?: "add" | "withdraw" | "transfer" | "plan";
  planId?: string;
}) {
  const [paymentStage, updatePaymentStage] = useState(0);
  const pathname = usePathname();
  const params = useParams();
  const [contributionSource, changeSource] = useState("");
  const [trxAmount, updateAmount] = useState(500);
  const [transactionHeading, updateHeading] = useState("Cluster Funding");
  const [paymentMethod, updatePaymentMethod] = useState("");
  const [mailQuery, updateMailQuery] = useState<undefined | string>();
  const [isPayingFromAccount, setIsPayingFromAccount] = useState(false);
  const [payError, setPayError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [groupayTransferStep, setGroupayTransferStep] = useState(0);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState("");
  const [planAmount, setPlanAmount] = useState(500);
  const [isPayingPlan, setIsPayingPlan] = useState(false);
  const [planPayError, setPlanPayError] = useState("");
  const [isRegisteringPending, setIsRegisteringPending] = useState(false);
  const [pendingRegError, setPendingRegError] = useState("");

  const handleClick = () => {
    onClick();
    updatePaymentStage(0);
    setSelectedUser(null);
    setGroupayTransferStep(0);
  };

  const {
    data: userResults,
    isLoading,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["usersByEmail", mailQuery],
    queryFn: async () => {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/userData/query/${mailQuery}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      const res: User[] = await req.json();
      return res;
    },
    enabled: !!mailQuery,
  });

  const { mutateAsync: initiatePayment, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await getSession();
      try {
        const payReq = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/squad/transaction/initiate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email: data?.user.email,
              amount: trxAmount * 100,
              initiate_type: "inline",
              currency: "NGN",
              customer_name: data?.user.name,
              callback_url: `http://localhost:9909/cluster/${params.id}`,
              payment_channels: ["transfer", "ussd", "card"],
              metadata: {
                clusterId: params.id,
                senderId: data?.user.id,
                transactionHeading: transactionHeading,
              },
              pass_charge: true,
              is_recurring: false,
            }),
          },
        );
        return payReq.json();
      } catch (error) {
        throw new Error(
          "Error experienced while initiating payment request to Squad Checkout",
        );
      }
    },
    onSuccess: (queryResult) => {
      redirect(queryResult.data.checkout_url);
    },
  });

  const queryClient = useQueryClient();

  const handlePlanContribution = async () => {
    if (!params.id) return;

    if (contributionSource !== "external") {
      setIsPayingPlan(true);
      setPlanPayError("");
      try {
        const { data } = await getSession();
        if (!data?.user) throw new Error("Not authenticated");
        const res = await fetch(
          `http://localhost:3000/clusters/${params.id}/pay-from-account`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              userId: data.user.id,
              amount: planAmount * 100,
              transactionHeading: "Plan Contribution",
              planId: planId || undefined,
            }),
          },
        );
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.message || "Payment failed");
        }
        queryClient.invalidateQueries({ queryKey: ["cluster", params.id] });
        queryClient.invalidateQueries({ queryKey: ["account_details"] });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        updatePaymentStage(1);
      } catch (e: any) {
        setPlanPayError(e.message || "Something went wrong");
      } finally {
        setIsPayingPlan(false);
      }
    } else {
      updatePaymentStage(1);
    }
  };

  const handleUserTransfer = async () => {
    if (!selectedUser) return;
    setIsTransferring(true);
    setTransferError("");
    try {
      const { data: sessionData } = await getSession();
      if (!sessionData?.user) throw new Error("Not authenticated");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/userData/transfer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            senderId: sessionData.user.id,
            recipientId: selectedUser.id,
            amount: trxAmount * 100,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Transfer failed");
      }
      queryClient.invalidateQueries({ queryKey: ["account_details"] });
      queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      updatePaymentStage(2);
    } catch (e: any) {
      setTransferError(e.message || "Something went wrong");
    } finally {
      setIsTransferring(false);
    }
  };

  const handleRegisterPendingTransaction = async () => {
    setIsRegisteringPending(true);
    setPendingRegError("");
    try {
      const { data } = await getSession();
      if (!data?.user) throw new Error("Not authenticated");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/${params.id}/pending-transaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            userId: data.user.id,
            amount: planAmount * 100,
            planId: planId || params.planID || undefined,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to register payment");
      }
      queryClient.invalidateQueries({ queryKey: ["plan", params.planID] });
      queryClient.invalidateQueries({ queryKey: ["cluster", params.id] });
      queryClient.invalidateQueries({ queryKey: ["userPlans"] });
      updatePaymentStage(2);
    } catch (e: any) {
      setPendingRegError(e.message || "Something went wrong");
    } finally {
      setIsRegisteringPending(false);
    }
  };

  const handleGroupayPayment = async () => {
    setIsPayingFromAccount(true);
    setPayError("");
    try {
      const { data } = await getSession();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/${params.id}/pay-from-account`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: data?.user.id,
            amount: trxAmount * 100,
          }),
          credentials: "include",
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Payment failed");
      }
      queryClient.invalidateQueries({ queryKey: ["cluster", params.id] });
      queryClient.invalidateQueries({ queryKey: ["account_details"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      updatePaymentStage(2);
    } catch (e: any) {
      setPayError(e.message || "Something went wrong");
    } finally {
      setIsPayingFromAccount(false);
    }
  };

  return (
    isShown && (
      <div className="fixed -top-12 left-0 min-h-screen w-full bg-forest/50 z-70 mx-auto grid p-3">
        <div className="place-self-center md:w-2/5 w-4/5 md:max-h-[90vh] h-auto rounded-[20px] bg-white px-6 py-4 border border-card-border shadow-modal relative">
          <span className="w-full text-right flex justify-end">
            <XIcon
              className="w-12 h-12 p-2 hover:text-red hover:scale-105 text-ink"
              onClick={handleClick}
            />
          </span>
          {paymentStage >= 1 && (
            <button
              className="flex gap-x-1 text-lg items-center cursor-pointer"
              onClick={() => updatePaymentStage((state) => state - 1)}
            >
              <ArrowLeftIcon className="text-ink font-bold text-xl" />
              <span>Back</span>
            </button>
          )}
          <p
            className={`${soraClass} text-2xl text-forest font-bold my-3 capitalize`}
          >
            {prompter !== "plan" ? `${prompter} Money` : "Contribute to Plan"}
          </p>
          {prompter === "add" && paymentStage === 0 && (
            <div className="flex justify-center flex-col">
              <p className="p-1 etxt-xl text-forest my-2">
                Choose Payment Method
              </p>

              <div className="flex flex-col justify-center py-2 w-full gap-y-3">
                {pathname.includes("cluster") && (
                  <label className="rounded-xl p-4 gap-x-3 has-checked:border-green has-checked:bg-green/5 md:w-4/5 flex items-center border border-card-border shadow-card hover:border-green transition-all cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      id="groupayAccount"
                      className="accent-green"
                      onChange={(e) => {
                        if (e.target.checked) {
                          updatePaymentMethod("groupay");
                          updatePaymentStage(1);
                        }
                      }}
                    />
                    <WalletIcon weight="bold" className="text-green shrink-0" />
                    <span>
                      <span className="font-semibold">
                        Pay from GrouPay Account
                      </span>
                      <span className="text-ink-mid text-sm block">
                        instant, no extra charge
                      </span>
                    </span>
                  </label>
                )}

                <label className="rounded-xl p-4 gap-x-3 has-checked:border-green has-checked:bg-green/5 md:w-4/5 flex items-center border border-card-border shadow-card hover:border-green transition-all cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    id="virtual_account"
                    className="accent-green"
                    onChange={(e) => {
                      if (e.target.checked) {
                        updatePaymentMethod("virtual");
                        updatePaymentStage(1);
                      }
                    }}
                  />
                  <BankIcon weight="bold" className="text-green shrink-0" />
                  <span>
                    <span className="font-semibold">
                      Transfer to Virtual Account
                    </span>
                    <span className="text-ink-mid text-sm block">
                      carries 0.2% charge
                    </span>
                  </span>
                </label>

                {pathname.includes("cluster") && (
                  <label className="rounded-xl p-4 gap-x-3 has-checked:border-green has-checked:bg-green/5 md:w-4/5 flex items-center border border-card-border shadow-card hover:border-green transition-all cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      id="squadPayment"
                      className="accent-green"
                      onChange={(e) => {
                        if (e.target.checked) {
                          updatePaymentMethod("squad");
                          updatePaymentStage(1);
                        }
                      }}
                    />
                    <MoneyWavyIcon
                      weight="bold"
                      className="text-green shrink-0"
                    />
                    <span>
                      <span className="font-semibold">Use Squad Checkout</span>
                      <span className="text-ink-mid text-sm block">
                        carries 1% charge on payments
                      </span>
                    </span>
                  </label>
                )}
              </div>
            </div>
          )}

          {prompter === "add" &&
            paymentStage === 1 &&
            paymentMethod === "squad" && (
              <div className="flex flex-col gap-y-4">
                <p className={`${soraClass} text-xl text-forest font-bold`}>
                  Transaction Details
                </p>

                <div>
                  <label className="text-sm text-ink-mid font-medium mb-1 block">
                    How much do you want to send?
                  </label>
                  <div className="flex gap-x-3 items-center">
                    <span className="text-ink text-xl font-semibold">NGN</span>
                    <input
                      type="number"
                      id="trxAmount"
                      autoFocus
                      className="h-12 rounded-xl border border-card-border px-4 text-sm text-forest outline-none focus:border-green transition-colors w-full"
                      min={100}
                      max={1000000}
                      step={100}
                      defaultValue={trxAmount}
                      onChange={(e) => updateAmount(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-ink-mid font-medium mb-1 block">
                    Transaction Heading
                  </label>
                  <input
                    type="text"
                    id="trxHeading"
                    className="h-12 rounded-xl border border-card-border px-4 text-sm outline-none focus:border-green transition-colors w-full"
                    onChange={(e) => updateHeading(e.target.value)}
                    defaultValue={"Cluster Funding"}
                  />
                </div>

                <button
                  className="w-full flex justify-center uppercase bg-green text-white rounded-[9999px] md:py-3 md:px-6 py-1 px-2 font-semibold hover:bg-greener transition-all disabled:opacity-50"
                  onClick={() => initiatePayment()}
                  disabled={isPending}
                >
                  {isPending ? "Processing..." : "Confirm"}
                </button>
              </div>
            )}

          {prompter === "add" &&
            paymentStage === 1 &&
            paymentMethod === "virtual" && (
              <div className="flex flex-col gap-y-4">
                <p className="text-ink-mid">
                  Send the money to the account below:
                </p>
                <div className="rounded-xl border border-card-border bg-gray-50 p-4">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-ink-mid">Account Number</span>
                    <span className="text-forest font-bold text-lg tracking-wider">
                      {accountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-ink-mid">Bank</span>
                    <span className="text-forest font-semibold">GTBank</span>
                  </div>
                </div>
                <button
                  className="bg-green text-center text-white font-semibold rounded-[9999px] md:py-3 md:px-6 py-1 px-2 uppercase hover:bg-greener transition-all mx-auto w-3/4"
                  onClick={() => {
                    alert("We'll look out for your payment!");
                    updatePaymentStage(0);
                    onClick();
                  }}
                >
                  I have sent the money
                </button>
              </div>
            )}

          {prompter === "add" &&
            paymentStage === 1 &&
            paymentMethod === "groupay" && (
              <div className="flex flex-col gap-y-4">
                <p className={`${soraClass} text-xl text-forest font-bold`}>
                  Transaction Details
                </p>

                <div>
                  <label className="text-sm text-ink-mid font-medium mb-1 block">
                    How much do you want to send?
                  </label>
                  <div className="flex gap-x-3 items-center">
                    <span className="text-ink text-xl font-semibold">NGN</span>
                    <input
                      type="number"
                      id="trxAmount"
                      autoFocus
                      className="h-12 rounded-xl border border-card-border px-4 text-sm text-forest outline-none focus:border-green transition-colors w-full"
                      min={100}
                      max={1000000}
                      step={100}
                      defaultValue={trxAmount}
                      onChange={(e) => updateAmount(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-ink-mid font-medium mb-1 block">
                    Transaction Heading
                  </label>
                  <input
                    type="text"
                    id="trxHeading"
                    className="h-12 rounded-xl border border-card-border px-4 text-sm outline-none focus:border-green transition-colors w-full"
                    onChange={(e) => updateHeading(e.target.value)}
                    defaultValue={"Cluster Funding"}
                  />
                </div>

                {payError && (
                  <p className="text-sm text-red bg-red/5 rounded-xl px-3 py-2">
                    {payError}
                  </p>
                )}

                <button
                  className="w-full flex justify-center uppercase bg-green text-white rounded-[9999px] md:py-3 md:px-6 py-1 px-2 font-semibold hover:bg-greener transition-all disabled:opacity-50"
                  onClick={handleGroupayPayment}
                  disabled={isPayingFromAccount}
                >
                  {isPayingFromAccount ? "Processing..." : "Confirm"}
                </button>
              </div>
            )}

          {paymentStage === 2 && paymentMethod === "groupay" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h3 className={`${soraClass} text-xl font-bold text-forest mb-2`}>
                Payment Successful
              </h3>
              <p className="text-sm text-ink-mid mb-6">
                &#8358; {trxAmount.toLocaleString()} has been sent from your
                GrouPay account.
              </p>
              <button
                onClick={() => {
                  queryClient.invalidateQueries({
                    queryKey: ["plan", params.planID],
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["cluster", params.id],
                  });
                  handleClick();
                }}
                className="uppercase bg-green text-white font-semibold rounded-[9999px] py-3 px-8 hover:bg-greener transition-all"
              >
                Done
              </button>
            </div>
          )}

          {prompter === "withdraw" && pathname.includes("cluster") && (
            <div className="flex flex-col gap-y-4">
              <p className={`${soraClass} text-xl text-forest font-bold`}>
                Request Withdrawal
              </p>
              <input
                type="number"
                max={500000}
                min={1000}
                step={100}
                placeholder="Withdrawal Amount"
                className="h-12 rounded-xl border border-card-border px-4 text-sm outline-none focus:border-green transition-colors"
              />
              <p className="text-sm text-ink-mid">
                N.B: The details of this request will be made available to the
                members of your cluster.
              </p>
              <button className="self-center w-1/2 uppercase text-white font-semibold rounded-[9999px] md:py-3 md:px-6 py-1 px-2 hover:bg-greener bg-green transition-all">
                Proceed
              </button>
            </div>
          )}

          {prompter === "withdraw" && pathname.includes("dashboard") && (
            <div className="flex flex-col gap-y-4">
              <p className={`${soraClass} text-xl text-forest font-bold`}>
                Withdraw from your Wallet
              </p>
              <div>
                <label className="block text-sm text-ink-mid font-medium mb-1">
                  Withdrawal Amount (in Naira)
                </label>
                <input
                  type="number"
                  min={100}
                  max={50000}
                  step={100}
                  defaultValue={200}
                  required
                  className="h-12 rounded-xl border border-card-border px-4 text-sm w-full outline-none focus:border-green transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-ink-mid font-medium mb-1">
                  Destination Account
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  className="h-12 rounded-xl border border-card-border px-4 text-sm w-full outline-none focus:border-green transition-colors"
                />
              </div>
              <button className="uppercase text-white font-semibold hover:bg-greener bg-green block rounded-[9999px] md:py-3 md:px-6 py-1 px-2 self-center w-1/2 transition-all">
                Confirm
              </button>
            </div>
          )}

          {prompter === "plan" && paymentStage === 0 && (
            <div className="flex flex-col gap-y-4">
              <p className={`text-ink ${soraClass} text-xl`}>
                Your Contribution Amount
              </p>
              <div className="flex gap-x-3 items-center">
                <span className="text-ink text-xl font-semibold">NGN</span>
                <input
                  type="number"
                  autoFocus
                  className="h-12 rounded-xl border border-card-border px-4 text-sm text-forest outline-none focus:border-green transition-colors w-full"
                  min={100}
                  max={1000000}
                  step={100}
                  value={planAmount}
                  onChange={(e) => setPlanAmount(Number(e.target.value))}
                />
              </div>

              <p className={`${soraClass} text-ink text-sm md:text-base`}>
                Where&apos;s the contribution coming from?
              </p>
              <div className="flex md:flex-row flex-col gap-y-3 gap-x-4">
                <label className="rounded-xl p-3 gap-x-3 has-checked:border-green has-checked:bg-green/5 md:w-2/5 flex items-center border border-card-border shadow-card hover:border-green transition-all cursor-pointer">
                  <input
                    type="radio"
                    name="recipient_category"
                    id="groupayUser"
                    className="accent-green"
                    onChange={(e) => {
                      if (e.target.checked) changeSource("groupay");
                    }}
                  />
                  <AtIcon weight="bold" className="text-green shrink-0" />
                  <span className="font-medium">Your Groupay Wallet</span>
                </label>

                <label className="rounded-xl p-3 gap-x-3 has-checked:border-green has-checked:bg-green/5 md:w-2/5 flex items-center border border-card-border shadow-card hover:border-green transition-all cursor-pointer">
                  <input
                    type="radio"
                    name="recipient_category"
                    id="bankAccount"
                    className="accent-green"
                    onChange={(e) => {
                      if (e.target.checked) changeSource("external");
                    }}
                  />
                  <BankIcon weight="bold" className="text-green shrink-0" />
                  <span className="font-medium">Bank Account</span>
                </label>
              </div>

              {planPayError && (
                <p className="text-sm text-red bg-red/5 rounded-xl px-3 py-2">
                  {planPayError}
                </p>
              )}

              <button
                className="w-full text-white md:py-3 md:px-6 py-1 px-2 bg-green font-semibold uppercase rounded-[9999px] hover:bg-greener transition-all disabled:opacity-50"
                onClick={handlePlanContribution}
                disabled={isPayingPlan}
              >
                {isPayingPlan ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          )}

          {paymentStage === 1 &&
            prompter === "plan" &&
            contributionSource === "groupay" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h3
                  className={`${soraClass} text-xl font-bold text-forest mb-2`}
                >
                  Contribution Successful
                </h3>
                <p className="text-sm text-ink-mid mb-6">
                  &#8358; {planAmount.toLocaleString()} has been sent from your
                  GrouPay wallet.
                </p>
                <button
                  onClick={handleClick}
                  className="uppercase bg-green text-white font-semibold rounded-[9999px] py-3 px-8 hover:bg-greener transition-all"
                >
                  Done
                </button>
              </div>
            )}

          {paymentStage === 1 &&
            prompter === "plan" &&
            contributionSource !== "groupay" && (
              <div className="flex flex-col gap-y-4 items-center">
                <p className="text-ink-mid">
                  Send the money to the account below:
                </p>
                <div className="rounded-xl border border-card-border bg-gray-50 p-4 w-full text-center">
                  <p className="text-forest text-2xl font-bold tracking-wider">
                    {accountNumber}
                  </p>
                  <p className="text-ink text-base font-semibold mt-1 uppercase">
                    {`squad/{cluster name}`}
                  </p>
                </div>
                {pendingRegError && (
                  <p className="text-sm text-red bg-red/5 rounded-xl px-3 py-2 w-full text-center">
                    {pendingRegError}
                  </p>
                )}
                <button
                  className="bg-green text-white font-semibold rounded-[9999px] py-3 px-8 uppercase hover:bg-greener transition-all w-3/4 disabled:opacity-50"
                  onClick={handleRegisterPendingTransaction}
                  disabled={isRegisteringPending}
                >
                  {isRegisteringPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    "I have sent the money"
                  )}
                </button>
              </div>
            )}

          {paymentStage === 2 &&
            prompter === "plan" &&
            contributionSource !== "groupay" && (
              <div className="flex flex-col gap-y-6 items-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-amber"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    className={`${soraClass} text-xl font-bold text-forest mb-2`}
                  >
                    Pending Confirmation
                  </h3>
                  <p className="text-sm text-ink-mid max-w-sm mx-auto leading-relaxed">
                    Your contribution status will be updated once the GrouPay
                    systems confirm receipt of your transfer.
                  </p>
                </div>
                <button
                  onClick={handleClick}
                  className="uppercase bg-green text-white font-semibold rounded-[9999px] py-3 px-8 hover:bg-greener transition-all"
                >
                  Done
                </button>
              </div>
            )}

          {/* Transaction Stages for "Transfer" attempts on payment modal */}
          {paymentStage === 0 && prompter === "transfer" && (
            <div>
              <p className={`text-xl font-bold ${soraClass} mb-3`}>
                Where&apos;s the money headed?
              </p>
              <div className="flex flex-col md:flex-row gap-y-3 gap-x-4">
                <label className="rounded-xl p-3 gap-x-3 has-checked:border-green has-checked:bg-green/5 md:w-2/5 flex items-center border border-card-border shadow-card hover:border-green transition-all cursor-pointer">
                  <input
                    type="radio"
                    name="recipient_category"
                    id="groupayUser"
                    className="accent-green"
                    onChange={(e) => {
                      if (e.target.checked) {
                        changeSource("groupay");
                      }
                    }}
                  />
                  <AtIcon weight="bold" className="text-green shrink-0" />
                  <span className="font-medium">Groupay User</span>
                </label>

                <label className="rounded-xl p-3 gap-x-3 has-checked:border-green has-checked:bg-green/5 md:w-2/5 flex items-center border border-card-border shadow-card hover:border-green transition-all cursor-pointer">
                  <input
                    type="radio"
                    name="recipient_category"
                    id="bankAccount"
                    className="accent-green"
                    onChange={(e) => {
                      if (e.target.checked) {
                        changeSource("external");
                      }
                    }}
                  />
                  <BankIcon weight="bold" className="text-green shrink-0" />
                  <span className="font-medium">Bank Account</span>
                </label>
              </div>
              <button
                className="w-full flex justify-center uppercase bg-green text-white rounded-[9999px] md:py-3 md:px-6 py-1 px-2 font-semibold hover:bg-greener transition-all mt-4"
                onClick={() => updatePaymentStage(1)}
              >
                Confirm
              </button>
            </div>
          )}

          {paymentStage === 1 &&
            prompter === "transfer" &&
            contributionSource == "external" && (
              <div className="flex flex-col gap-y-4">
                <p
                  className={`${soraClass} text-xl text-forest font-bold capitalize`}
                >
                  Add Payment Details
                </p>

                <div>
                  <label
                    htmlFor="accountNumber"
                    className="text-sm text-ink-mid font-medium mb-1 block"
                  >
                    Account Number
                  </label>
                  <input
                    className="h-12 rounded-xl border border-card-border px-4 text-sm outline-none focus:border-green transition-colors w-full"
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    maxLength={10}
                  />
                </div>
                <div>
                  <label
                    htmlFor="bankName"
                    className="text-sm text-ink-mid font-medium mb-1 block"
                  >
                    Bank Name
                  </label>
                  <select className="h-12 rounded-xl border border-card-border px-4 text-sm outline-none focus:border-green transition-colors w-full">
                    <option value={"UBA"}>UBA</option>
                    <option value={"UBA"}>UBA</option>
                    <option value={"UBA"}>UBA</option>
                    <option value={"UBA"}>UBA</option>
                    <option value={"UBA"}>UBA</option>
                    <option value={"UBA"}>UBA</option>
                    <option value={"UBA"}>UBA</option>
                    <option value={"UBA"}>UBA</option>
                    <option value={"UBA"}>UBA</option>
                  </select>
                </div>

                <p className="text-sm text-ink-mid font-medium">Account Name</p>
                <p className="text-forest font-semibold">Account Result</p>

                <div className="flex justify-center gap-x-4 mt-2">
                  <button
                    className="flex justify-center items-center px-6 py-3 text-ink-mid font-medium hover:text-ink transition-colors"
                    onClick={() => {
                      onClick();
                      updatePaymentStage(0);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex justify-center items-center gap-x-2 bg-green text-white font-semibold rounded-[9999px] py-3 px-8 hover:bg-greener transition-all"
                    onClick={() => updatePaymentStage(2)}
                  >
                    Continue <ArrowRightIcon className="inline" weight="bold" />
                  </button>
                </div>
              </div>
            )}

          {paymentStage === 1 &&
            prompter === "transfer" &&
            contributionSource === "groupay" && (
              <div className="flex flex-col gap-y-4">
                <p className={`${soraClass} text-xl text-forest font-bold`}>
                  Send to GrouPay User
                </p>

                {/* Step 1: Search for user */}
                {(!selectedUser || groupayTransferStep === 0) && (
                  <>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSelectedUser(null);
                        updateMailQuery(e.target.emailQuery.value);
                        refetch();
                      }}
                      className="flex flex-col gap-y-3"
                    >
                      <label className="text-sm text-ink-mid font-medium">
                        Enter email address
                      </label>
                      <input
                        type="email"
                        name="emailQuery"
                        placeholder="user@example.com"
                        className="h-12 rounded-xl border border-card-border px-4 text-sm outline-none focus:border-green transition-colors"
                        required
                      />
                      <button
                        className="w-full uppercase text-white font-semibold bg-green rounded-[9999px] md:py-3 md:px-6 py-1 px-2 hover:bg-greener transition-all disabled:opacity-50"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Searching..." : "Search"}
                      </button>
                    </form>

                    {/* Loading state */}
                    {isLoading && (
                      <div className="flex items-center gap-x-3 p-4 rounded-xl border border-card-border animate-pulse">
                        <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-2/3" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    )}

                    {/* Results */}
                    {!isLoading && userResults && userResults.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm text-ink-mid font-medium">
                          {userResults.length === 1
                            ? "1 user found"
                            : `${userResults.length} users found`}
                        </p>
                        {userResults.map((u) => (
                          <label
                            key={u.id}
                            className="flex items-center gap-x-4 p-4 rounded-xl border border-card-border shadow-card hover:border-green transition-all cursor-pointer has-checked:border-green has-checked:bg-green/5"
                          >
                            <input
                              type="radio"
                              name="selectedTransferUser"
                              className="accent-green shrink-0"
                              onChange={() => setSelectedUser(u)}
                            />
                            <div className="w-11 h-11 rounded-full bg-green/10 flex items-center justify-center text-green font-bold text-sm shrink-0 uppercase">
                              {u.image ? (
                                <img
                                  src={u.image}
                                  alt=""
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                u.name?.charAt(0) || "?"
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-forest font-semibold truncate">
                                {u.name}
                              </p>
                              <p className="text-sm text-ink-mid truncate">
                                {u.email}
                              </p>
                              {u.phone && (
                                <p className="text-xs text-ink-mid/70 truncate">
                                  {u.phone}
                                </p>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* No results */}
                    {!isLoading && isSuccess && userResults?.length === 0 && (
                      <div className="text-center py-6 rounded-xl border border-card-border">
                        <p className="text-ink-mid font-medium">
                          No matching users found
                        </p>
                        <p className="text-sm text-ink-mid/70 mt-1">
                          Try a different email address
                        </p>
                      </div>
                    )}

                    {/* Continue button when user selected */}
                    {selectedUser && (
                      <button
                        className="w-full flex justify-center uppercase bg-green text-white rounded-[9999px] md:py-3 md:px-6 py-1 px-2 font-semibold hover:bg-greener transition-all"
                        onClick={() => setGroupayTransferStep(1)}
                      >
                        Continue to Payment
                      </button>
                    )}
                  </>
                )}

                {/* Step 2: Enter amount and send */}
                {selectedUser && groupayTransferStep === 1 && (
                  <div className="flex flex-col gap-y-4">
                    {/* Selected user summary */}
                    <div className="flex items-center gap-x-3 p-3 rounded-xl border border-card-border bg-green/5">
                      <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center text-green font-bold text-sm shrink-0 uppercase">
                        {selectedUser.image ? (
                          <img
                            src={selectedUser.image}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          selectedUser.name?.charAt(0) || "?"
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-forest font-semibold text-sm truncate">
                          {selectedUser.name}
                        </p>
                        <p className="text-xs text-ink-mid truncate">
                          {selectedUser.email}
                        </p>
                      </div>
                      <button
                        className="ml-auto text-ink-mid hover:text-ink text-xs underline"
                        onClick={() => {
                          setSelectedUser(null);
                          setGroupayTransferStep(0);
                          updateMailQuery("");
                        }}
                      >
                        Change
                      </button>
                    </div>

                    <div>
                      <label className="text-sm text-ink-mid font-medium mb-1 block">
                        How much do you want to send?
                      </label>
                      <div className="flex gap-x-3 items-center">
                        <span className="text-ink text-xl font-semibold">
                          NGN
                        </span>
                        <input
                          type="number"
                          autoFocus
                          className="h-12 rounded-xl border border-card-border px-4 text-sm text-forest outline-none focus:border-green transition-colors w-full"
                          min={100}
                          max={1000000}
                          step={100}
                          defaultValue={trxAmount}
                          onChange={(e) => updateAmount(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-ink-mid font-medium mb-1 block">
                        Transaction Heading
                      </label>
                      <input
                        type="text"
                        className="h-12 rounded-xl border border-card-border px-4 text-sm outline-none focus:border-green transition-colors w-full"
                        onChange={(e) => updateHeading(e.target.value)}
                        defaultValue="Transfer"
                      />
                    </div>

                    {transferError && (
                      <p className="text-sm text-red bg-red/5 rounded-xl px-3 py-2">
                        {transferError}
                      </p>
                    )}
                    <button
                      className="w-full flex justify-center uppercase bg-green text-white rounded-[9999px] md:py-3 md:px-6 py-1 px-2 font-semibold hover:bg-greener transition-all mt-2 disabled:opacity-50"
                      onClick={handleUserTransfer}
                      disabled={isTransferring}
                    >
                      {isTransferring ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <>Send &#8358;{trxAmount.toLocaleString()}</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

          {paymentStage === 2 &&
            prompter === "transfer" &&
            contributionSource === "groupay" &&
            selectedUser && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h3
                  className={`${soraClass} text-xl font-bold text-forest mb-2`}
                >
                  Transfer Successful
                </h3>
                <p className="text-sm text-ink-mid mb-1">
                  &#8358; {trxAmount.toLocaleString()} sent to
                </p>
                <div className="flex items-center justify-center gap-x-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-green/10 flex items-center justify-center text-green font-bold text-xs uppercase">
                    {selectedUser.image ? (
                      <img
                        src={selectedUser.image}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      selectedUser.name?.charAt(0) || "?"
                    )}
                  </div>
                  <span className="text-forest font-semibold">
                    {selectedUser.name}
                  </span>
                </div>
                <button
                  onClick={handleClick}
                  className="uppercase bg-green text-white font-semibold rounded-[9999px] py-3 px-8 hover:bg-greener transition-all"
                >
                  Done
                </button>
              </div>
            )}

          {paymentStage === 2 &&
            prompter === "transfer" &&
            contributionSource === "external" && (
              <div className="flex flex-col gap-y-4">
                <p className={`${soraClass} text-xl font-bold text-forest`}>
                  Transaction Details
                </p>
                <div className="rounded-xl border border-card-border divide-y divide-card-border">
                  <div className="flex justify-between py-3 px-4">
                    <span className="text-sm text-ink-mid">Amount</span>
                    <span className="font-bold text-forest">
                      &#8358;{" "}
                      {Number((54603456.44234).toFixed(2)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 px-4">
                    <span className="text-sm text-ink-mid">Account Number</span>
                    <span className="font-semibold text-forest">
                      1234567890
                    </span>
                  </div>
                  <div className="flex justify-between py-3 px-4">
                    <span className="text-sm text-ink-mid">Recipient Name</span>
                    <span className="font-semibold text-forest">
                      ADIKA REGINALD SUKI
                    </span>
                  </div>
                  <div className="flex justify-between py-3 px-4">
                    <span className="text-sm text-ink-mid">Bank</span>
                    <span className="font-semibold text-forest">
                      Moniepoint
                    </span>
                  </div>
                </div>

                <div className="flex gap-x-4 justify-center pt-2">
                  <button
                    onClick={() => {
                      onClick();
                      updatePaymentStage(0);
                    }}
                    className="px-6 py-3 text-ink-mid font-medium hover:text-ink transition-colors uppercase"
                  >
                    Cancel
                  </button>
                  <button className="uppercase text-white font-semibold bg-green rounded-[9999px] py-3 px-8 hover:bg-greener transition-all">
                    Make Payment
                  </button>
                </div>
              </div>
            )}
          {/* end */}
        </div>
      </div>
    )
  );
}
