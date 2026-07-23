import { soraClass } from "../fonts";
import { LockIcon } from "@phosphor-icons/react";

export default function PinRequired({
  clickFunction,
}: {
  clickFunction: () => void;
}) {
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-4">
        <LockIcon className="md:h-9 md:w-9 h-6 w-6" weight="bold" />
      </div>
      <h3 className={`${soraClass} text-xl font-bold text-forest-text mb-2`}>
        PIN Required
      </h3>
      <p className="text-sm text-ink-mid mb-6 max-w-xs mx-auto leading-relaxed">
        You need to set a transaction PIN before you can make wallet transfers,
        fund clusters, or contribute to plans.
      </p>
      <a
        href="/profile/pin"
        className="inline-block w-full py-3 rounded-full bg-green text-white font-bold hover:bg-greener transition-all text-center"
      >
        Set Up PIN
      </a>
      <button
        onClick={clickFunction}
        className="w-full mt-2 py-2 text-sm text-ink-mid font-medium hover:text-ink transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
