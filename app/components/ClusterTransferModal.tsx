"use client";

import { useState, useRef } from "react";
import {
  XIcon,
  ArrowRightIcon,
  BankIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { soraClass } from "../fonts";
import { useMyClusters, usePinStatus } from "../hooks/queryHooks";
import { useSession } from "@/lib/authClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PinVerifyModal from "./PinVerifyModal";
import PinSetupModal from "./PinSetupModal";

export default function ClusterTransferModal({
  isShown,
  onClose,
}: {
  isShown: boolean;
  onClose: () => void;
}) {
  const { data } = useSession();
  const { clusterResponse, isSuccess } = useMyClusters();
  const [selectedClusterId, setSelectedClusterId] = useState<string>("");
  const [amount, setAmount] = useState(1000);
  const [step, setStep] = useState<"select" | "confirm" | "done">("select");
  const [showPinVerify, setShowPinVerify] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const pinRef = useRef<string>("");
  const pinActionRef = useRef<() => void>(() => {});
  const { hasPin, isLoading: checkingPin } = usePinStatus();

  const requirePin = (action: () => void) => {
    if (checkingPin) return;
    if (hasPin) {
      pinActionRef.current = action;
      setShowPinVerify(true);
    } else {
      action();
    }
  };

  const onPinVerified = (pin: string) => {
    setShowPinVerify(false);
    pinRef.current = pin;
    pinActionRef.current();
  };

  const selectedCluster = isSuccess
    ? clusterResponse?.find((c) => c.id === selectedClusterId)
    : null;

  const queryClient = useQueryClient();

  const { mutateAsync: transfer, isPending } = useMutation({
    mutationFn: async () => {
      if (!selectedClusterId || !data?.user) return;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/${selectedClusterId}/pay-from-account`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            userId: data.user.id,
            amount: amount * 100,
            pin: pinRef.current,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Transfer failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cluster", selectedClusterId],
      });
      queryClient.invalidateQueries({ queryKey: ["userClusters"] });
      queryClient.invalidateQueries({ queryKey: ["account_details"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setStep("done");
    },
  });

  const handleReset = () => {
    setStep("select");
    setSelectedClusterId("");
    setAmount(1000);
    pinRef.current = "";
    onClose();
  };

  if (!isShown) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-forest/50 p-3">
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
      <div className="bg-white dark:bg-surface rounded-[20px] transition-colors max-w-130 w-full p-6 shadow-modal relative">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 text-ink hover:text-red transition-colors"
        >
          <XIcon className="w-6 h-6" weight="bold" />
        </button>

        {step === "done" ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-8 h-8 fill-green" weight="bold" />
            </div>
            <h3 className={`${soraClass} text-xl font-bold text-forest-text mb-2`}>
              Transfer Initiated
            </h3>
            <p className="text-sm text-ink-mid mb-6">
              &#8358; {amount.toLocaleString()} has been sent to{" "}
              <span className="font-semibold text-forest-text">
                {selectedCluster?.name}
              </span>
              .
            </p>
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-full bg-green text-white font-bold hover:bg-greener transition-all"
            >
              Done
            </button>
          </div>
        ) : step === "confirm" && selectedCluster ? (
          <div className="text-center py-2">
            <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-4">
              <BankIcon className="w-8 h-8 fill-teal" weight="fill" />
            </div>
            <h3 className={`${soraClass} text-xl font-bold text-forest-text mb-2`}>
              Confirm Transfer
            </h3>

            <div className="border border-card-border rounded-xl p-4 mb-4 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-ink-mid">Cluster</span>
                <span className="text-sm font-semibold text-forest-text">
                  {selectedCluster.name}
                </span>
              </div>
              <div className="border-t border-card-border/50" />
              <div className="flex justify-between">
                <span className="text-sm text-ink-mid">Amount</span>
                <span className="text-lg font-bold text-forest-text">
                  &#8358; {amount.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-card-border/50" />
              <div className="flex justify-between">
                <span className="text-sm text-ink-mid">From</span>
                <span className="text-sm font-semibold text-forest-text">
                  {data?.user?.name || "Your Wallet"}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("select")}
                className="flex-1 py-3 rounded-full border border-card-border text-ink-mid font-semibold hover:bg-gray-50 dark:hover:bg-[#162c20] transition-all"
              >
                Back
              </button>
              <button
                onClick={() => requirePin(() => transfer())}
                disabled={isPending}
                className="flex-1 py-3 rounded-full bg-teal text-white font-bold hover:bg-teal/90 transition-all disabled:opacity-50"
              >
                {isPending ? "Processing..." : "Confirm Transfer"}
              </button>
            </div>
          </div>
        ) : (
          <div className="py-2">
            <div className="text-center mb-6">
              <h3 className={`${soraClass} text-xl font-bold text-forest-text mb-2`}>
                Transfer to Cluster
              </h3>
              <p className="text-sm text-ink-mid">
                Choose a cluster and enter the amount you want to transfer from
                your wallet.
              </p>
            </div>

            <div className="mb-4">
              <label className="text-xs uppercase font-semibold text-ink-mid tracking-wider mb-2 block">
                Select Cluster
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {isSuccess &&
                  clusterResponse?.map((cluster) => (
                    <button
                      key={cluster.id}
                      onClick={() => setSelectedClusterId(cluster.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        selectedClusterId === cluster.id
                          ? "border-green bg-green/5"
                          : "border-card-border hover:border-teal/30"
                      }`}
                    >
                      <p className="font-semibold text-sm text-forest-text">
                        {cluster.name}
                      </p>
                      <p className="text-xs text-ink-mid">
                        {cluster.members?.length || 0} members
                      </p>
                    </button>
                  ))}
                {(!isSuccess || clusterResponse?.length === 0) && (
                  <p className="text-sm text-ink-mid text-center py-4">
                    You haven't joined any clusters yet.
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="transferAmount"
                className="text-xs uppercase font-semibold text-ink-mid tracking-wider mb-2 block"
              >
                Amount (NGN)
              </label>
              <div className="flex items-center gap-3 border border-card-border rounded-xl p-3 focus-within:border-green transition-all">
                <span className="text-ink-mid font-bold text-lg">&#8358;</span>
                <input
                  id="transferAmount"
                  type="number"
                  min={100}
                  max={10000000}
                  step={100}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="flex-1 text-forest-text text-xl font-bold outline-none bg-transparent"
                />
              </div>
            </div>

            <button
              onClick={() => setStep("confirm")}
              disabled={!selectedClusterId || amount < 100}
              className="w-full py-3 rounded-full bg-green text-white font-bold hover:bg-greener transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRightIcon className="w-5 h-5" weight="bold" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
