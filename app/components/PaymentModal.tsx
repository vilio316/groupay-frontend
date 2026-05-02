import { soraClass } from "../fonts";

export default function PaymentModal({ isShown }: { isShown?: boolean }) {
  return (
    <div className="fixed -top-12 left-0 min-h-screen w-full bg-gray-100/60  z-70 max-h-3/4  mx-auto grid p-3">
      <div className="place-self-center w-3/4 h-3/4 rounded-xl bg-white px-6 py-4 border border-card-border shadow-2xl shadow-card-border">
        <p className={`${soraClass} text-2xl text-forest font-bold`}>
          Payment Modal
        </p>
      </div>
    </div>
  );
}
