import { usePathname } from "next/navigation";
import { WalletIcon, MoneyWavyIcon, BankIcon } from "@phosphor-icons/react";
import { soraClass } from "../fonts";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/lib/authClient";
import { redirect } from "next/navigation";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { usePinStatus } from "../hooks/queryHooks";
import PinVerifyModal from "./PinVerifyModal";
import PinSetupModal from "./PinSetupModal";

export default function AddMoneyHandler({
  paymentStage,
  accountNumber,
  paymentMethod,
  updatePaymentMethod,
  updatePaymentStage,
  clickFunction,
}: {
  paymentStage: number;
  accountNumber: string;
  paymentMethod?: string;
  clickFunction: () => void;
  updatePaymentStage: (param: number) => void;
  updatePaymentMethod: (param: string) => void;
}) {
  const pathname = usePathname();
  const params = useParams();
  const [trxAmount, updateAmount] = useState(500);
  const [transactionHeading, updateHeading] = useState("Cluster Funding");
  const queryClient = useQueryClient();
  const [payError, setPayError] = useState("");
  const [isPayingFromAccount, setIsPayingFromAccount] = useState(false);
  const [showPinVerify, setShowPinVerify] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showPinRequired, setShowPinRequired] = useState(false);
  const pinRef = useRef<string>("");
  const pinActionRef = useRef<() => void>(() => {});
  const { hasPin, isLoading: checkingPin } = usePinStatus();

  const requirePin = (action: () => void) => {
    if (checkingPin) return;
    if (hasPin) {
      pinActionRef.current = action;
      setShowPinVerify(true);
    } else {
      setShowPinRequired(true);
    }
  };

  const onPinVerified = (pin: string) => {
    setShowPinVerify(false);
    pinRef.current = pin;
    pinActionRef.current();
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
            pin: pinRef.current,
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
              callback_url: `${process.env.NEXT_PUBLIC_DEV_URL}/cluster/${params.id}`,
              payment_channels: ["transfer", "ussd", "card"],
              metadata: {
                clusterId: params.id,
                senderId: data?.user.id,
                transactionHeading: transactionHeading,
              },
              pass_charge: true,
              is_recurring: false,
              userId: data?.user.id,
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

  return (
    <div>
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
        <div className="flex justify-center flex-col">
          <p className="p-1 text-xl text-forest-text my-2">
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

            {accountNumber == "1234567890" && (
              <p className="font-semibold text-red text-sm">
                You need to create a GrouPay account before you can add money to
                your wallet
              </p>
            )}
            <label
              className={`${accountNumber == "1234567890" ? "border-red hover:border-red opacity-90" : ""} rounded-xl p-4 gap-x-3 has-checked:border-green has-checked:bg-green/5 md:w-4/5 flex items-center border border-card-border shadow-card hover:border-green transition-all cursor-pointer`}
            >
              <input
                type="radio"
                name="payment_method"
                id="virtual_account"
                className="accent-green"
                disabled={accountNumber == "1234567890"}
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
                <MoneyWavyIcon weight="bold" className="text-green shrink-0" />
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

      {paymentStage === 1 && paymentMethod === "squad" && (
        <div className="flex flex-col gap-y-4">
          <p className={`${soraClass} text-xl text-forest-text font-bold`}>
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
                className="h-12 rounded-xl border border-card-border px-4 text-sm text-forest-text outline-none focus:border-green transition-colors w-full"
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

      {paymentStage === 1 && paymentMethod === "virtual" && (
        <div className="flex flex-col gap-y-4">
          <p className="text-ink-mid">Send the money to the account below:</p>
          <div className="rounded-xl border border-card-border bg-gray-50 dark:bg-[#162c20] p-4">
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-ink-mid">Account Number</span>
              <span className="text-forest-text font-bold text-lg tracking-wider">
                {accountNumber}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-ink-mid">Bank</span>
              <span className="text-forest-text font-semibold">GTBank</span>
            </div>
          </div>
          <button
            className="bg-green text-center text-white font-semibold rounded-[9999px] md:py-3 md:px-6 py-1 px-2 uppercase hover:bg-greener transition-all mx-auto w-3/4"
            onClick={() => updatePaymentStage(2)}
          >
            I have sent the money
          </button>
        </div>
      )}

      {paymentStage === 1 && paymentMethod === "groupay" && (
        <div className="flex flex-col gap-y-4">
          <p className={`${soraClass} text-xl text-forest-text font-bold`}>
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
                className="h-12 rounded-xl border border-card-border px-4 text-sm text-forest-text outline-none focus:border-green transition-colors w-full"
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
            onClick={() => requirePin(handleGroupayPayment)}
            disabled={isPayingFromAccount}
          >
            {isPayingFromAccount ? "Processing..." : "Confirm"}
          </button>
        </div>
      )}

      {paymentStage === 2 && paymentMethod === "virtual" && (
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
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: ["cluster", params.id],
              });
              clickFunction();
            }}
            className="uppercase bg-green text-white font-semibold rounded-[9999px] py-3 px-8 hover:bg-greener transition-all"
          >
            Done
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
          <h3
            className={`${soraClass} text-xl font-bold text-forest-text mb-2`}
          >
            Payment Successful
          </h3>
          <p className="text-sm text-ink-mid mb-6">
            &#8358; {trxAmount.toLocaleString()} has been sent from your GrouPay
            account.
          </p>
          <button
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: ["plan", params.planID],
              });
              queryClient.invalidateQueries({
                queryKey: ["cluster", params.id],
              });
              clickFunction();
            }}
            className="uppercase bg-green text-white font-semibold rounded-[9999px] py-3 px-8 hover:bg-greener transition-all"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
