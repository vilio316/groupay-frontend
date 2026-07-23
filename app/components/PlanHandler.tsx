import { useState, useRef } from "react";
import { soraClass } from "../fonts";
import { AtIcon, BankIcon } from "@phosphor-icons/react";
import { useParams } from "next/navigation";
import { usePinStatus } from "../hooks/queryHooks";
import { getSession } from "@/lib/authClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PinSetupModal from "./PinSetupModal";
import PinVerifyModal from "./PinVerifyModal";

export default function PlanHandler({
  paymentStage,
  source,
  changeHandler,
  resetFunction,
  accountNumber,
  updateStage,
}: {
  paymentStage: number;
  source: string;
  changeHandler: (param: string) => void;
  resetFunction: () => void;
  accountNumber: string;
  updateStage: (number: number) => void;
}) {
  const [planAmount, setPlanAmount] = useState(500);
  const params = useParams();
  const pinRef = useRef<string>("");
  const pendingActionRef = useRef<() => void>(() => {});
  const { hasPin } = usePinStatus();
  const queryClient = useQueryClient();
  const [showPinVerify, setShowPinVerify] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showPinRequired, setShowPinRequired] = useState(false);

  const onPinVerified = (pin: string) => {
    setShowPinVerify(false);
    pinRef.current = pin;
    pendingActionRef.current();
  };

  const planContributionMutation = useMutation({
    mutationFn: async () => {
      const { data } = await getSession();
      if (!data?.user) throw new Error("Not authenticated");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/${params.id}/pay-from-account`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            userId: data.user.id,
            amount: planAmount * 100,
            transactionHeading: "Plan Contribution",
            planId: params.planID || undefined,
            pin: pinRef.current,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Payment failed");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cluster", params.id] });
      queryClient.invalidateQueries({ queryKey: ["account_details"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      updateStage(1);
    },
  });

  const handlePlanContribution = () => {
    if (!params.id) return;
    if (source !== "external") {
      if (!pinRef.current && hasPin) {
        pendingActionRef.current = handlePlanContribution;
        setShowPinVerify(true);
        return;
      }
      planContributionMutation.mutate();
    } else {
      updateStage(1);
    }
  };

  return (
    <>
      <PinVerifyModal
        isShown={showPinVerify}
        onClose={() => {
          setShowPinVerify(false);
          pinRef.current = "";
        }}
        onSuccess={onPinVerified}
      />
      <PinSetupModal
        isShown={showPinSetup}
        onClose={() => setShowPinSetup(false)}
        onSuccess={() => setShowPinSetup(false)}
      />
      {paymentStage === 0 && (
        <div className="flex flex-col gap-y-4">
          <p className={`text-ink ${soraClass} text-xl`}>
            Your Contribution Amount
          </p>
          <div className="flex gap-x-3 items-center">
            <span className="text-ink text-xl font-semibold">NGN</span>
            <input
              type="number"
              autoFocus
              className="h-12 rounded-xl border border-card-border px-4 text-sm text-forest-text outline-none focus:border-green transition-colors w-full"
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
                  if (e.target.checked) changeHandler("groupay");
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
                  if (e.target.checked) changeHandler("external");
                }}
              />
              <BankIcon weight="bold" className="text-green shrink-0" />
              <span className="font-medium">Bank Account</span>
            </label>
          </div>

          {planContributionMutation.error && (
            <p className="text-sm text-red bg-red/5 rounded-xl px-3 py-2">
              {planContributionMutation.error.message}
            </p>
          )}

          <button
            className="w-full text-white md:py-3 md:px-6 py-1 px-2 bg-green font-semibold uppercase rounded-[9999px] hover:bg-greener transition-all disabled:opacity-50"
            onClick={handlePlanContribution}
            disabled={planContributionMutation.isPending}
          >
            {planContributionMutation.isPending ? (
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

      {paymentStage === 1 && source === "groupay" && (
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
            className={`${soraClass} text-xl font-bold text-forest-text mb-2`}
          >
            Contribution Successful
          </h3>
          <p className="text-sm text-ink-mid mb-6">
            &#8358; {planAmount.toLocaleString()} has been sent from your
            GrouPay wallet.
          </p>
          <button
            onClick={resetFunction}
            className="uppercase bg-green text-white font-semibold rounded-[9999px] py-3 px-8 hover:bg-greener transition-all"
          >
            Done
          </button>
        </div>
      )}

      {paymentStage === 1 && source !== "groupay" && (
        <div className="flex flex-col gap-y-4 items-center">
          <p className="text-ink-mid">Send the money to the account below:</p>
          <div className="rounded-xl border border-card-border bg-gray-50 dark:bg-[#162c20] p-4 w-full text-center">
            <p className="text-forest-text text-2xl font-bold tracking-wider">
              {accountNumber}
            </p>
            <p className="text-ink text-base font-semibold mt-1 uppercase">
              {`squad/{cluster name}`}
            </p>
          </div>
          <button
            className="bg-green text-white font-semibold rounded-[9999px] py-3 px-8 uppercase hover:bg-greener transition-all w-3/4"
            onClick={() => updateStage(2)}
          >
            I have sent the money
          </button>
        </div>
      )}

      {paymentStage === 2 && source !== "groupay" && (
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
              className={`${soraClass} text-xl font-bold text-forest-text mb-2`}
            >
              Pending Confirmation
            </h3>
            <p className="text-sm text-ink-mid max-w-sm mx-auto leading-relaxed">
              Your contribution status will be updated once the GrouPay systems
              confirm receipt of your transfer.
            </p>
          </div>
          <button
            onClick={resetFunction}
            className="uppercase bg-green text-white font-semibold rounded-[9999px] py-3 px-8 hover:bg-greener transition-all"
          >
            Done
          </button>
        </div>
      )}
    </>
  );
}
