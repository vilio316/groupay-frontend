"use client";

import { ArrowRightIcon, AtIcon, BankIcon, XIcon } from "@phosphor-icons/react";
import { soraClass } from "../fonts";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PaymentModal({
  isShown,
  onClick,
  prompter,
}: {
  isShown?: boolean;
  onClick: () => void;
  prompter?: "add" | "withdraw" | "transfer";
}) {
  const [paymentStage, updatePaymentStage] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    if (prompter !== "transfer") {
      updatePaymentStage(0);
    } else {
      updatePaymentStage(1);
    }
  }, [prompter, paymentStage]);

  const handleClick = () => {
    onClick();
    updatePaymentStage(1);
  };

  return (
    isShown && (
      <div className="fixed -top-12 left-0 min-h-screen w-full bg-gray-100/60  z-70 max-h-3/4  mx-auto grid p-3">
        <div className="place-self-center md:w-2/5 w-4/5 max-h-3/4 rounded-xl bg-white px-6 py-4 border border-card-border shadow-2xl shadow-card-border relative">
          <span className="w-full text-right flex justify-end">
            <XIcon
              className="w-12 h-12 p-2 hover:text-red hover:scale-105 text-ink"
              onClick={handleClick}
            />
          </span>
          <p
            className={`${soraClass} text-2xl text-forest font-bold my-3 capitalize`}
          >
            {prompter} Money
          </p>

          {prompter === "add" && (
            <div className="flex justify-center flex-col">
              <p>Send the money to the account below: </p>
              <div className="text-center text-3xl uppercase font-bold my-3">
                <p className="text-forest">0834567111</p>
                <p className="uppercase text-xl">AMOS EBUBE CIROMA</p>
              </div>
              <button>I have sent the money</button>
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

          {paymentStage === 1 && (
            <div>
              <p className={`text-2xl font-bold ${soraClass}`}>
                Where's the money headed?
              </p>
              <div className="flex justify-center my-2 py-8 w-4/5 gap-x-4">
                <div className="rounded-xl p-2 gap-x-2 has-checked:border-green w-2/5 flex border hover:border-green">
                  <input
                    type="radio"
                    name="recipient_category"
                    id="groupayUser"
                  />
                  <label htmlFor="groupayUser">
                    <AtIcon weight="bold" />
                    Groupay User
                  </label>
                </div>

                <div className="rounded-xl p-2 gap-x-2 has-checked:border-green w-2/5 flex border hover:border-green">
                  <input
                    type="radio"
                    name="recipient_category"
                    id="bankAccount"
                  />
                  <label htmlFor="bankAccount">
                    <BankIcon weight="bold" />
                    Bank Account
                  </label>
                </div>
              </div>
              <button
                className="w-3/4 flex justify-self-center justify-center uppercase bg-green text-white rounded-xl p-2 my-2"
                onClick={() => updatePaymentStage(2)}
              >
                <span>Confirm</span>
              </button>
            </div>
          )}

          {paymentStage === 2 && (
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
                  onClick={() => updatePaymentStage(3)}
                >
                  <span>
                    Continue <ArrowRightIcon className="inline" />{" "}
                  </span>
                </button>
              </div>
            </div>
          )}

          {paymentStage === 3 && (
            <div>
              <p className={`${soraClass} text-2xl font-bold my-3`}>
                Transaction Details
              </p>
              <p>
                Transaction Amount:{" "}
                <span className="text-xl font-bold">
                  &#8358; {Number((54603456.44234).toFixed(2)).toLocaleString()}
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
        </div>
      </div>
    )
  );
}
