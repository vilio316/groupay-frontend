import { GaugeIcon } from "@phosphor-icons/react/dist/ssr";
import { soraClass } from "../fonts";

export default function OnboardingStatusCard() {
  return (
    <div className="md:py-3 md:px-6 border border-card-border rounded-xl shadow-sm shadow-card-border my-4 ">
      <div className="flex gap-x-3 items-center">
        <div className="w-4/5">
          <p className={`${soraClass} text-2xl font-bold my-2`}>
            Onboarding Status
          </p>
          <p className="text-ink-mid font-semibold">
            You're almost done with the onboarding process!
          </p>

          <div className="progress-container bg-gray-300/40 rounded-lg">
            <div className="prog-bar h-2.5 rounded-lg w-4/5 bg-linear-to-r from-green to-greener"></div>
          </div>
        </div>

        <div className="grid justify-center w-1/5">
          <GaugeIcon className="h-8 w-8 fill-green" weight="duotone" />
          <p className="text-center">3/5</p>
        </div>
      </div>
    </div>
  );
}
