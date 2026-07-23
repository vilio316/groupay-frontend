"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  AtIcon,
  BankIcon,
  WalletIcon,
  XIcon,
  MoneyWavyIcon,
  LockIcon,
} from "@phosphor-icons/react";
import { soraClass } from "../fonts";
import { useState, useRef } from "react";
import { useParams, usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../(user-facing)/cluster/[id]/ClusterDetailsClient";
import PinVerifyModal from "./PinVerifyModal";
import PinSetupModal from "./PinSetupModal";
import { usePinStatus } from "../hooks/queryHooks";
import PinRequired from "./PinRequired";
import AddMoneyHandler from "./AddMoneyHandler";
import TransferMoneyHandler from "./TransferMoneyHandler";
import PlanHandler from "./PlanHandler";

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
  const [contributionSource, changeSource] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [paymentMethod, updatePaymentMethod] = useState("");
  const [showPinVerify, setShowPinVerify] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showPinRequired, setShowPinRequired] = useState(false);
  const pinRef = useRef<string>("");
  const pendingActionRef = useRef<() => void>(() => {});

  const onPinVerified = (pin: string) => {
    setShowPinVerify(false);
    pinRef.current = pin;
    pendingActionRef.current();
  };

  const handleClick = () => {
    onClick();
    updatePaymentStage(0);
    setSelectedUser(null);
    pinRef.current = "";
    setShowPinRequired(false);
  };

  return (
    isShown && (
      <div className="fixed -top-12 left-0 min-h-screen w-full bg-forest/50 z-70 mx-auto grid p-3">
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
        <div className="place-self-center md:w-2/5 w-4/5 md:max-h-[90vh] h-auto rounded-[20px] bg-white dark:bg-surface px-6 py-4 border border-card-border shadow-modal relative transition-colors">
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
            className={`${soraClass} text-2xl text-forest-text font-bold my-3 capitalize`}
          >
            {prompter !== "plan" ? `${prompter} Money` : "Contribute to Plan"}
          </p>
          {showPinRequired && (
            <PinRequired
              clickFunction={() => {
                setShowPinRequired(false);
                handleClick();
              }}
            />
          )}
          {prompter === "add" && !showPinRequired && (
            <AddMoneyHandler
              paymentStage={paymentStage}
              paymentMethod={paymentMethod}
              accountNumber={accountNumber}
              clickFunction={handleClick}
              updatePaymentMethod={updatePaymentMethod}
              updatePaymentStage={updatePaymentStage}
            />
          )}

          {prompter === "transfer" && !showPinRequired && (
            <TransferMoneyHandler
              paymentStage={paymentStage}
              changeHandler={changeSource}
              clickHandler={updatePaymentStage}
              source={contributionSource}
              resetFunction={handleClick}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          )}

          {prompter === "withdraw" && pathname.includes("cluster") && (
            <div className="flex flex-col gap-y-4">
              <p className={`${soraClass} text-xl text-forest-text font-bold`}>
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
              <p className={`${soraClass} text-xl text-forest-text font-bold`}>
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

          {prompter === "plan" && (
            <PlanHandler
              paymentStage={paymentStage}
              source={contributionSource}
              changeHandler={updatePaymentMethod}
              resetFunction={handleClick}
              accountNumber={accountNumber}
              updateStage={updatePaymentStage}
            />
          )}
          {/* end */}
        </div>
      </div>
    )
  );
}
