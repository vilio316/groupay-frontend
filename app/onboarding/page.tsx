import AddressCapture from "@/claudeComps/AddressVerification";
import { soraClass } from "../fonts";

export default function OnboardingPage() {
  return (
    <div className="h-full lg:p-4 p-2">
      <p className={`${soraClass} lg:text-3xl`}>Get Started with GrouPay!</p>
      <div>
        <AddressCapture />
      </div>
    </div>
  );
}
