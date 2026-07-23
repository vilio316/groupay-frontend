import { soraClass } from "../fonts";
import { AtIcon, BankIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Dispatch, SetStateAction, useState } from "react";
import { User } from "../(user-facing)/cluster/[id]/ClusterDetailsClient";
import { getSession } from "@/lib/authClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import PinVerifyModal from "./PinVerifyModal";
import PinSetupModal from "./PinSetupModal";
import { usePinStatus } from "../hooks/queryHooks";

export default function TransferMoneyHandler({
  paymentStage,
  changeHandler,
  clickHandler,
  source,
  resetFunction,
  selectedUser,
  setSelectedUser,
}: {
  paymentStage: number;
  changeHandler: (param: string) => void; //should receive a function to update payment source ("external, groupay, etc")
  clickHandler: (number: number) => void; //should receive a function to update payment stage
  source: string;
  resetFunction: () => void;
  selectedUser: User | null;
  setSelectedUser: Dispatch<SetStateAction<User | null>>;
}) {
  const [trxAmount, updateAmount] = useState(500);
  const pinRef = useRef<string>("");
  const [groupayTransferStep, setGroupayTransferStep] = useState(0);
  const [mailQuery, updateMailQuery] = useState<undefined | string>();
  const [transactionHeading, updateHeading] = useState("Cluster Funding");
  const [showPinVerify, setShowPinVerify] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showPinRequired, setShowPinRequired] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState("");
  const pendingActionRef = useRef<() => void>(() => {});
  const { hasPin, isLoading: checkingPin } = usePinStatus();

  const queryClient = useQueryClient();

  const requirePin = (action: () => void) => {
    if (checkingPin) return;
    if (hasPin) {
      pendingActionRef.current = action;
      setShowPinVerify(true);
    } else {
      setShowPinRequired(true);
    }
  };

  const onPinVerified = (pin: string) => {
    setShowPinVerify(false);
    pinRef.current = pin;
    pendingActionRef.current();
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
            pin: pinRef.current,
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
      clickHandler(2);
    } catch (e: any) {
      setTransferError(e.message || "Something went wrong");
    } finally {
      setIsTransferring(false);
    }
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
                    changeHandler("groupay");
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
                    changeHandler("external");
                  }
                }}
              />
              <BankIcon weight="bold" className="text-green shrink-0" />
              <span className="font-medium">Bank Account</span>
            </label>
          </div>
          <button
            className="w-full flex justify-center uppercase bg-green text-white rounded-[9999px] md:py-3 md:px-6 py-1 px-2 font-semibold hover:bg-greener transition-all mt-4"
            onClick={() => clickHandler(1)}
          >
            Confirm
          </button>
        </div>
      )}

      {paymentStage === 1 && source === "external" && (
        <div className="flex flex-col gap-y-4">
          <p
            className={`${soraClass} text-xl text-forest-text font-bold capitalize`}
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
          <p className="text-forest-text font-semibold">Account Result</p>

          <div className="flex justify-center gap-x-4 mt-2">
            <button
              className="flex justify-center items-center px-6 py-3 text-ink-mid font-medium hover:text-ink transition-colors"
              onClick={() => {
                resetFunction();
              }}
            >
              Cancel
            </button>
            <button
              className="flex justify-center items-center gap-x-2 bg-green text-white font-semibold rounded-[9999px] py-3 px-8 hover:bg-greener transition-all"
              onClick={() => clickHandler(2)}
            >
              Continue <ArrowRightIcon className="inline" weight="bold" />
            </button>
          </div>
        </div>
      )}

      {paymentStage === 1 && source === "groupay" && (
        <div className="flex flex-col gap-y-4">
          <p className={`${soraClass} text-xl text-forest-text font-bold`}>
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
                        <p className="text-forest-text font-semibold truncate">
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
                  <p className="text-forest-text font-semibold text-sm truncate">
                    {selectedUser.name}
                  </p>
                  <p className="text-xs text-ink-mid truncate">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-ink-mid font-medium mb-1 block">
                  How much do you want to send?
                </label>
                <div className="flex gap-x-3 items-center">
                  <span className="text-ink text-xl font-semibold">NGN</span>
                  <input
                    type="number"
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
                  className="h-12 rounded-xl border border-card-border px-4 text-sm outline-none focus:border-green transition-colors w-full"
                  onChange={(e) => updateHeading(e.target.value)}
                  defaultValue="Transfer"
                />
              </div>

              {/* error handling behaviour on mutation */}
              {transferError && (
                <p className="text-sm text-red bg-red/5 rounded-xl px-3 py-2">
                  {transferError}
                </p>
              )}
              <button
                className="w-full flex justify-center uppercase bg-green text-white rounded-[9999px] md:py-3 md:px-6 py-1 px-2 font-semibold hover:bg-greener transition-all mt-2 disabled:opacity-50"
                onClick={() => requirePin(handleUserTransfer)}
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

      {paymentStage === 2 && source === "groupay" && (
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
            Transfer Successful
          </h3>
          <p className="text-sm text-ink-mid mb-1">
            &#8358; {trxAmount.toLocaleString()} sent to
          </p>
          <div className="flex items-center justify-center gap-x-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-green/10 flex items-center justify-center text-green font-bold text-xs uppercase">
              {selectedUser && selectedUser.image ? (
                <img
                  src={selectedUser.image}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                (selectedUser && selectedUser.name?.charAt(0)) || "?"
              )}
            </div>
            <span className="text-forest-text font-semibold">
              {selectedUser && selectedUser.name ? selectedUser.name : "name"}
            </span>
          </div>
          <button
            onClick={resetFunction}
            className="uppercase bg-green text-white font-semibold rounded-[9999px] py-3 px-8 hover:bg-greener transition-all"
          >
            Done
          </button>
        </div>
      )}

      {paymentStage === 2 && source === "external" && (
        <div className="flex flex-col gap-y-4">
          <p className={`${soraClass} text-xl font-bold text-forest-text`}>
            Transaction Details
          </p>
          <div className="rounded-xl border border-card-border divide-y divide-card-border">
            <div className="flex justify-between py-3 px-4">
              <span className="text-sm text-ink-mid">Amount</span>
              <span className="font-bold text-forest-text">
                &#8358; {Number((54603456.44234).toFixed(2)).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-3 px-4">
              <span className="text-sm text-ink-mid">Account Number</span>
              <span className="font-semibold text-forest-text">1234567890</span>
            </div>
            <div className="flex justify-between py-3 px-4">
              <span className="text-sm text-ink-mid">Recipient Name</span>
              <span className="font-semibold text-forest-text">
                ADIKA REGINALD SUKI
              </span>
            </div>
            <div className="flex justify-between py-3 px-4">
              <span className="text-sm text-ink-mid">Bank</span>
              <span className="font-semibold text-forest-text">Moniepoint</span>
            </div>
          </div>

          <div className="flex gap-x-4 justify-center pt-2">
            <button
              onClick={() => {
                resetFunction();
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
    </>
  );
}
