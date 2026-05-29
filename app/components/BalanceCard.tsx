"use client";

import { PaperPlaneTiltIcon } from "@phosphor-icons/react";
import {
  HandDepositIcon,
  HandWithdrawIcon,
} from "@phosphor-icons/react/dist/ssr";

export function BalanceCard({
  payFunct,
}: {
  payFunct: (string?: string) => void;
}) {
  return (
    <div className="md:grid md:w-[90%] grid-cols-8 items-center border border-card-border shadow-md p-4 rounded-xl shadow-card-border/40 my-2">
      <div className="col-span-1">
        <img
          src="/family.jpg"
          className="rounded-full p-1 drop-shadow-xl drop-shadow-card-border md:h-24 md:w-24 h-12 w-12 object-cover"
        />
      </div>
      <div className="col-span-4">
        <p className="text-ink-mid font-semibold uppercase my-2">
          Total Balance:
        </p>
        <p className="font-bold text-2xl ">
          &#8358; {(1023433.89).toLocaleString()}
        </p>
      </div>
      <div className="col-span-3 justify-end flex items-center gap-x-4 text-center">
        <button title="Add Money">
          <div className="flex justify-center">
            <HandDepositIcon
              weight="duotone"
              className="rounded-full bg-green/40 text-black shadow-xl shadow-card-border h-8 w-8 md:h-12 md:w-12 p-2 hover:bg-greener hover:font-bold hover:scale-105 transition-all duration-100"
              onClick={() => payFunct("add")}
            />
          </div>
          <span className="text-sm text-ink-mid">Add money</span>
        </button>

        <button title="Request Withdrawal">
          <div className="flex justify-center">
            <HandWithdrawIcon
              weight="duotone"
              className="rounded-full bg-green/40 text-black shadow-xl shadow-card-border h-8 w-8 md:h-12 md:w-12 p-2 hover:bg-greener hover:font-bold hover:scale-105 transition-all duration-100"
              onClick={() => payFunct("withdraw")}
            />
          </div>
          <span className="text-ink-mid text-sm">Withdraw</span>
        </button>

        <button title="Make Transfer">
          <div className="flex justify-center">
            <PaperPlaneTiltIcon
              weight="duotone"
              className="rounded-full bg-green/40 text-black shadow-xl shadow-card-border h-8 w-8 md:h-12 md:w-12 p-2 hover:bg-greener hover:font-bold hover:scale-105 transition-all duration-100"
              onClick={() => payFunct("transfer")}
            />
          </div>
          <span className="text-ink-mid text-sm">Transfer</span>
        </button>
      </div>
    </div>
  );
}
