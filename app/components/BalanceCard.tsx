import {
  HandDepositIcon,
  HandWithdrawIcon,
} from "@phosphor-icons/react/dist/ssr";

export function BalanceCard() {
  return (
    <div className="grid w-[90%] grid-cols-8 items-center border border-card-border shadow-md p-4 rounded-xl shadow-card-border/40">
      <div className="col-span-1">
        <img
          src="/family.jpg"
          className="rounded-full p-1 drop-shadow-xl drop-shadow-card-border h-24 w-24 object-cover"
        />
      </div>
      <div className="col-span-5">
        <p className="text-ink-mid font-semibold uppercase my-2">
          Total Balance:
        </p>
        <p className="font-bold text-2xl ">
          &#8358; {(1023433.89).toLocaleString()}
        </p>
      </div>
      <div className="col-span-2 flex items-center gap-x-4 justify-center text-center">
        <button title="Add Money">
          <div className="flex justify-center">
            <HandDepositIcon
              weight="duotone"
              className="rounded-full bg-green/40 text-black shadow-xl shadow-card-border md:h-12 w-12 p-2 hover:bg-greener hover:font-bold hover:scale-105 transition-all duration-100"
            />
          </div>
          <span className="text-sm text-ink-mid">Add money</span>
        </button>

        <button title="Request Withdrawal">
          <div className="flex justify-center">
            <HandWithdrawIcon
              weight="duotone"
              className="rounded-full bg-green/40 text-black shadow-xl shadow-card-border md:h-12 w-12 p-2 hover:bg-greener hover:font-bold hover:scale-105 transition-all duration-100"
            />
          </div>
          <span className="text-ink-mid text-sm">Withdraw</span>
        </button>
      </div>
    </div>
  );
}
