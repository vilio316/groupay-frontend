import { XIcon } from "@phosphor-icons/react/dist/ssr";
import { soraClass } from "../fonts";

export default function PaymentModal({
  isShown,
  onClick,
}: {
  isShown?: boolean;
  onClick?: () => void;
}) {
  return (
    isShown && (
      <div className="fixed -top-12 left-0 min-h-screen w-full bg-gray-100/60  z-70 max-h-3/4  mx-auto grid p-3">
        <div className="place-self-center md:w-2/5 w-4/5 h-3/4 rounded-xl bg-white px-6 py-4 border border-card-border shadow-2xl shadow-card-border relative">
          <span className="w-full text-right flex justify-end">
            <XIcon
              className="w-12 h-12 p-2 hover:text-red hover:scale-105 text-ink"
              onClick={onClick}
            />
          </span>
          <p className={`${soraClass} text-2xl text-forest font-bold my-3`}>
            Initiate Payment
          </p>
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
          <div className="h-1/5">
            <p>Payment Methods</p>
          </div>
          <div className="self-end justify-self-center bottom-0 absolute w-full flex gap-x-4 justify-center p-4">
            <button>Cancel</button>
            <button>Confirm</button>
          </div>
        </div>
      </div>
    )
  );
}
