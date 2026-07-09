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
import { useMutation, useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/authClient";
import type { User } from "../(user-facing)/cluster/[id]/ClusterDetailsClient";

export default function PaymentModal({
  isShown,
  onClick,
  accountNumber,
  prompter,
}: {
  isShown?: boolean;
  accountNumber?: string;
  onClick: () => void;
  prompter?: "add" | "withdraw" | "transfer" | "plan";
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

  const handleClick = () => {
    onClick();
    updatePaymentStage(0);
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
        `http://localhost:3000/userData/query/${mailQuery}`,
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
          `http://localhost:3000/squad/transaction/initiate`,
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

  const handleGroupayPayment = async () => {
    setIsPayingFromAccount(true);
    setPayError("");
    try {
      const { data } = await getSession();
      const res = await fetch(
        `http://localhost:3000/clusters/${params.id}/pay-from-account`,
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
      updatePaymentStage(2);
    } catch (e: any) {
      setPayError(e.message || "Something went wrong");
    } finally {
      setIsPayingFromAccount(false);
    }
  };

  return (
    isShown && (
      <div className="fixed -top-12 left-0 min-h-screen w-full bg-gray-100/60  z-70  mx-auto grid p-3">
        <div className="place-self-center md:w-2/5 w-4/5 md:max-h-4/5 h-auto rounded-xl bg-white px-6 py-4 border border-card-border shadow-2xl shadow-card-border relative">
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

              <div className="flex flex-col justify-center py-2 w-full gap-x-4">
                <div className="rounded-xl p-4 gap-x-2 has-checked:border-green has-checked:scale-110 md:w-4/5 flex border hover:border-green transition-all my-2">
                  <input
                    type="radio"
                    name="payment_method"
                    id="virtual_account"
                    onChange={(e) => {
                      if (e.target.checked) {
                        updatePaymentMethod("virtual");
                        updatePaymentStage(1);
                      }
                    }}
                  />
                  <label htmlFor="virtual_account">
                    <BankIcon weight="bold" />
                    <span className="font-bold px-0.5">
                      Transfer to Virtual Account{" "}
                    </span>{" "}
                    (carries 0.2% charge)
                  </label>
                </div>

                <div className="rounded-xl p-2 gap-x-2 has-checked:border-green has-checked:scale-110 md:w-4/5 my-2 flex border hover:border-green transition-all">
                  <input
                    type="radio"
                    name="payment_method"
                    id="squadPayment"
                    onChange={(e) => {
                      if (e.target.checked) {
                        updatePaymentMethod("squad");
                        updatePaymentStage(1);
                      }
                    }}
                  />
                  <label htmlFor="squadPayment">
                    <MoneyWavyIcon weight="bold" />
                    <span className="font-bold px-0.5">
                      Use Squad Checkout{" "}
                    </span>{" "}
                    (carries 1% charge on payments)
                  </label>
                </div>

                <div className="rounded-xl p-2 gap-x-2 has-checked:border-green has-checked:scale-110 md:w-4/5 my-2 flex border hover:border-green transition-all">
                  <input
                    type="radio"
                    name="payment_method"
                    id="groupayAccount"
                    onChange={(e) => {
                      if (e.target.checked) {
                        updatePaymentMethod("groupay");
                        updatePaymentStage(1);
                      }
                    }}
                  />
                  <label htmlFor="groupayAccount">
                    <WalletIcon weight="bold" />
                    <span className="font-bold px-0.5">
                      Pay from GrouPay Account{" "}
                    </span>{" "}
                    (instant, no extra charge)
                  </label>
                </div>
              </div>
            </div>
          )}

          {prompter === "add" &&
            paymentStage === 1 &&
            paymentMethod === "squad" && (
              <div className="flex justify-center flex-col">
                <p className="text-xl text-forest font-bold">
                  Transaction Details
                </p>

                <div className="my-2 p-1">
                  <label htmlFor="trxAmount my-2 block">
                    How much do you want to send?{" "}
                  </label>
                  <div className="flex gap-x-3 items-center my-2">
                    <p className="text-ink text-2xl text-bold">NGN</p>
                    <input
                      type="number"
                      id="trxAmount"
                      autoFocus
                      className="text-forest text-3xl outline-none rounded-xl p-2"
                      min={100}
                      max={1000000}
                      step={100}
                      defaultValue={trxAmount}
                      onChange={(e) => updateAmount(Number(e.target.value))}
                    />
                  </div>
                </div>

                <label htmlFor="trxHeading my-2 block">
                  Transaction Heading
                </label>
                <input
                  type="text"
                  id="trxHeading"
                  className="outline-none block p-1 border focus:border-green rounded-xl w-3/4"
                  onChange={(e) => updateHeading(e.target.value)}
                  defaultValue={"Cluster Funding"}
                />

                <button
                  className={`w-3/4 flex justify-self-center justify-center uppercase bg-green text-white rounded-xl p-2 my-2`}
                  onClick={() => initiatePayment()}
                >
                  <span>{isPending ? "Processing..." : "Confirm"}</span>
                </button>
              </div>
            )}

          {prompter === "add" &&
            paymentStage === 1 &&
            paymentMethod === "virtual" && (
              <div className="flex justify-center flex-col">
                <p>Send the money to the account below: </p>
                <div className="font-bold my-3">
                  <p className="text-forest">
                    Account Number:{" "}
                    {accountNumber && accountNumber.length > 0
                      ? accountNumber
                      : "0834556789"}
                  </p>
                  <p
                    className="
              my-2"
                  >
                    Bank: GTBank
                  </p>
                </div>
                <button className="bg-green text-center text-white font-bold rounded-2xl p-2 uppercase hover:bg-greener mx-auto w-3/4">
                  I have sent the money
                </button>
              </div>
            )}

          {prompter === "add" &&
            paymentStage === 1 &&
            paymentMethod === "groupay" && (
              <div className="flex justify-center flex-col">
                <p className="text-xl text-forest font-bold">
                  Transaction Details
                </p>

                <div className="my-2 p-1">
                  <label htmlFor="trxAmount my-2 block">
                    How much do you want to send?{" "}
                  </label>
                  <div className="flex gap-x-3 items-center my-2">
                    <p className="text-ink text-2xl text-bold">NGN</p>
                    <input
                      type="number"
                      id="trxAmount"
                      autoFocus
                      className="text-forest text-3xl outline-none rounded-xl p-2"
                      min={100}
                      max={1000000}
                      step={100}
                      defaultValue={trxAmount}
                      onChange={(e) => updateAmount(Number(e.target.value))}
                    />
                  </div>
                </div>

                <label htmlFor="trxHeading my-2 block">
                  Transaction Heading
                </label>
                <input
                  type="text"
                  id="trxHeading"
                  className="outline-none block p-1 border focus:border-green rounded-xl w-3/4"
                  onChange={(e) => updateHeading(e.target.value)}
                  defaultValue={"Cluster Funding"}
                />

                {payError && (
                  <p className="text-red-500 text-sm bg-red/5 rounded-xl px-3 py-2 my-2">
                    {payError}
                  </p>
                )}

                <button
                  className={`w-3/4 flex justify-self-center justify-center uppercase bg-green text-white rounded-xl p-2 my-2`}
                  onClick={handleGroupayPayment}
                  disabled={isPayingFromAccount}
                >
                  <span>
                    {isPayingFromAccount ? "Processing..." : "Confirm"}
                  </span>
                </button>
              </div>
            )}

          {paymentStage === 2 && paymentMethod === "groupay" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
                <BankIcon className="w-8 h-8 fill-green" weight="fill" />
              </div>
              <h3 className={`${soraClass} text-xl font-bold text-forest mb-2`}>
                Payment Successful
              </h3>
              <p className="text-sm text-ink-mid mb-2">
                &#8358; {trxAmount.toLocaleString()} has been sent from your
                GrouPay account.
              </p>
              <button
                onClick={handleClick}
                className="mt-4 uppercase bg-green text-white font-bold rounded-xl p-2 px-6 hover:bg-greener transition-all"
              >
                Done
              </button>
            </div>
          )}

          {prompter === "withdraw" && pathname.includes("cluster") && (
            <div className="grid">
              <p>Request Withdrawal</p>
              <input
                type="number"
                max={500000}
                min={1000}
                step={100}
                placeholder="Withdrawal Amount"
                className="border-2 border-green rounded-[10px] indent-1 p-1 my-1 outline-none "
              />

              <p className="text-[12px] my-1">
                N.B: The details of this request will be made available to the
                members of your cluster.
              </p>
              <button className="outline-none justify-self-center w-1/2 p-2 uppercase text-white  rounded-2xl hover:bg-greener bg-green font-bold">
                Proceed
              </button>
            </div>
          )}

          {prompter === "withdraw" && pathname.includes("dashboard") && (
            <div className="grid">
              <p>Withdraw from your Wallet</p>
              <label className="block my-3 uppercase">Withdrawal Amount</label>
              <input
                type="number"
                min={100}
                max={50000}
                step={100}
                required
                className="border-2 border-green rounded-[10px] p-1 w-3/4 outline-none"
              />

              <label className="block my-3 uppercase">
                destination account
              </label>
              <input
                type="text"
                required
                maxLength={10}
                className="border-2 border-green rounded-[10px] p-1 w-3/4 outline-none"
              />
              <button className="uppercase text-white font-bold hover:bg-greener bg-green hover:scale-105 block p-2 rounded-2xl justify-self-center my-2 w-1/2">
                Confirm
              </button>
            </div>
          )}

          {prompter === "plan" && paymentStage === 0 && (
            <div className="grid p-4 justify-center gap-y-2">
              <p className={`text-ink ${soraClass} text-xl`}>
                Your Contribution Amount
              </p>
              <p className="text-ink">NGN</p>
              <input
                type="number"
                autoFocus
                className="text-forest text-3xl outline-none border-0 "
                min={100}
                max={1000000}
                step={100}
                defaultValue={500}
              />

              <p className={`${soraClass} my-1 text-ink text-sm md:text-xl`}>
                Where's the contribution coming from?
              </p>
              <div className="flex md:flex-row flex-col justify-center py-2 w-full gap-x-4">
                <div className="rounded-xl p-2 gap-x-2 has-checked:border-green has-checked:scale-110 md:w-2/5 flex border hover:border-green transition-all">
                  <input
                    type="radio"
                    name="recipient_category"
                    id="groupayUser"
                    onChange={(e) => {
                      if (e.target.checked) changeSource("groupay");
                    }}
                  />
                  <label htmlFor="groupayUser">
                    <AtIcon weight="bold" />
                    Your Groupay Wallet
                  </label>
                </div>

                <div className="rounded-xl p-2 gap-x-2 has-checked:border-green has-checked:scale-110 md:w-2/5 my-1 flex border hover:border-green transition-all">
                  <input
                    type="radio"
                    name="recipient_category"
                    id="bankAccount"
                    onChange={(e) => {
                      if (e.target.checked) changeSource("external");
                    }}
                  />
                  <label htmlFor="bankAccount">
                    <BankIcon weight="bold" />
                    Bank Account
                  </label>
                </div>
              </div>

              <button
                className="text-white justify-self-center p-2 justify-center flex text-center w-3/4 my-3 bg-green font-bold uppercase rounded-2xl"
                onClick={() => {
                  if (contributionSource == "external") {
                    updatePaymentStage(1);
                  } else {
                    setTimeout(() => {
                      alert("Sent");
                    }, 2000);
                  }
                }}
              >
                Continue
              </button>
            </div>
          )}

          {paymentStage === 1 && prompter === "plan" && (
            <div className="grid justify-center">
              <p>Send the money to the account below: </p>
              <div className="text-center text-3xl uppercase font-bold my-3">
                <p className="text-forest">0834567111</p>
                <p className="uppercase text-xl">AMOS EBUBE CIROMA</p>
              </div>
              <button className="bg-green text-white font-bold rounded-2xl p-2 uppercase hover:bg-greener mx-auto w-3/4">
                I have sent the money
              </button>
            </div>
          )}

          {/* Transaction Stages for "Transfer" attempts on payment modal */}
          {paymentStage === 0 && prompter === "transfer" && (
            <div>
              <p className={`text-2xl font-bold ${soraClass}`}>
                Where's the money headed?
              </p>
              <div className="flex justify-center my-2 py-3 w-4/5 gap-x-4 flex-col md:flex-row">
                <div className="rounded-xl p-2 gap-x-2 has-checked:border-green md:w-2/5 my-1 flex  border hover:border-green">
                  <input
                    type="radio"
                    name="recipient_category"
                    id="groupayUser"
                    onChange={(e) => {
                      if (e.target.checked) {
                        changeSource("groupay");
                      }
                    }}
                  />
                  <label htmlFor="groupayUser">
                    <AtIcon weight="bold" />
                    Groupay User
                  </label>
                </div>

                <div className="rounded-xl p-2 gap-x-2 has-checked:border-green md:w-2/5 my-1 flex border hover:border-green">
                  <input
                    type="radio"
                    name="recipient_category"
                    id="bankAccount"
                    onChange={(e) => {
                      if (e.target.checked) {
                        changeSource("external");
                      }
                    }}
                  />
                  <label htmlFor="bankAccount">
                    <BankIcon weight="bold" />
                    Bank Account
                  </label>
                </div>
              </div>
              <button
                className="w-3/4 flex justify-self-center justify-center uppercase bg-green text-white rounded-xl p-2 my-2"
                onClick={() => updatePaymentStage(1)}
              >
                <span>Confirm</span>
              </button>
            </div>
          )}

          {paymentStage === 1 &&
            prompter === "transfer" &&
            contributionSource == "external" && (
              <div className="detailsAndLookup">
                <p className="capitalize my-3 text-lg ">add payment details</p>

                <p>Recipient Details</p>
                <div>
                  <label
                    htmlFor="accountNumber"
                    className="text-ink-mid font-bold my-1 uppercase block"
                  >
                    Account Number
                  </label>
                  <input
                    className="border outline-0 my-1 p-2 border-shadow-border focus:border-green rounded-xl transition-all "
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    maxLength={10}
                  />
                </div>
                <label
                  htmlFor="bankName"
                  className="text-ink-mid font-bold my-1 uppercase block"
                >
                  Bank Name
                </label>
                <select className="border outline-none my-2 border-ink-mid focus:border-green transition-all focus:scale-105 w-3/4 p-2 rounded-xl">
                  <option value={"UBA"}>UBA</option>
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

                <p>Account Name</p>
                <p>Account Result</p>

                <div className="flex justify-center  gap-x-4 ">
                  <button className="flex justify-center items-center w-2/5 ">
                    <span>Cancel </span>
                  </button>
                  <button
                    className="flex justify-center items-center w-2/5"
                    onClick={() => updatePaymentStage(2)}
                  >
                    <span>
                      Continue <ArrowRightIcon className="inline" />{" "}
                    </span>
                  </button>
                </div>
              </div>
            )}

          {paymentStage === 1 &&
            prompter === "transfer" &&
            contributionSource === "groupay" && (
              <div>
                <p className="italic">Sending to GrouPay User</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateMailQuery(e.target.emailQuery.value);
                    refetch();
                  }}
                >
                  <label className="uppercase text-ink-mid font-bold">
                    enter username or email here
                  </label>
                  <input
                    type="email"
                    name="emailQuery"
                    className="outline-none indent-2 block p-1 border focus:border-green rounded-xl w-3/4 my-1"
                    required
                  />
                  <button
                    className="uppercase text-white font-bold hover:bg-greener bg-green hover:scale-105 block p-2 rounded-2xl justify-self-center my-2 w-1/2"
                    type="submit"
                  >
                    Confirm
                  </button>
                </form>

                {userResults && userResults.length > 0 ? (
                  <p>{userResults[0].name}</p>
                ) : (
                  <p>No matching users found</p>
                )}
              </div>
            )}

          {paymentStage === 2 &&
            prompter === "transfer" &&
            contributionSource === "groupay" && <div></div>}

          {paymentStage === 2 &&
            prompter === "transfer" &&
            contributionSource === "external" && (
              <div>
                <p className={`${soraClass} text-2xl font-bold my-3`}>
                  Transaction Details
                </p>
                <p>
                  Transaction Amount:{" "}
                  <span className="text-xl font-bold">
                    &#8358;{" "}
                    {Number((54603456.44234).toFixed(2)).toLocaleString()}
                  </span>
                </p>
                <p>Recipient Account Number (NUBAN): 1234567890</p>
                <p>Recipient Name: ADIKA REGINALD SUKI</p>
                <p>Recipient Bank: Moniepoint</p>

                <div className="justify-self-center w-full flex gap-x-4 justify-center p-4">
                  <button
                    onClick={() => {
                      onClick();
                      updatePaymentStage(1);
                    }}
                    className="uppercase"
                  >
                    Cancel
                  </button>
                  <button className="uppercase text-white bg-green rounded-xl p-2">
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
