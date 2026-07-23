"use client";
import React, { useState } from "react";
import KYCWizard from "@/kycComponents/KYCWizard";
import { KYCDashboardBanner } from "@/kycComponents/KYCDashBanner";
import { KYCTier, KYCStatus } from "@/kycComponents/tokens";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@phosphor-icons/react";

export default function KYCStartPage() {
  const router = useRouter();
  const [currentTier, setCurrentTier] = useState<KYCTier>(0);
  const [pendingStatus] = useState<KYCStatus>("idle");
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return (
      <div className="min-h-screen pb-24">
        <div className="flex items-center gap-3 px-6 pt-6 pb-2">
          <button
            onClick={() => setShowWizard(false)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#162c20] transition-colors text-ink-mid hover:text-forest-text"
          >
            <ArrowLeftIcon className="w-5 h-5" weight="bold" />
          </button>
          <div>
            <h1 className="text-xl font-bold">KYC Verification</h1>
            <p className="text-sm text-ink-mid">
              Complete your identity verification
            </p>
          </div>
        </div>
        <KYCWizard
          currentTier={currentTier}
          onComplete={(data) => {
            router.push("/dashboard");
          }}
          onCancel={() => setShowWizard(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="border-b border-[#e8efe8] px-6 py-6">
        <h1 className={`text-2xl font-bold text-forest-text leading-tight`}>
          KYC Verification
        </h1>
        <p className="text-sm text-ink-mid mt-1">
          Verify your identity to unlock higher transaction limits
        </p>
      </div>

      <div className="px-6 mt-6 max-w-2xl">
        <KYCDashboardBanner
          currentTier={currentTier}
          pendingStatus={pendingStatus}
          onUpgrade={() => setShowWizard(true)}
        />
      </div>

      <div className="px-6 mt-8 max-w-2xl">
        <h2 className="text-lg font-bold text-forest-text mb-3">
          How KYC Works
        </h2>
        <div className="space-y-3">
          {[
            {
              step: "1",
              title: "Phone Verification",
              desc: "Verify your phone number with a one-time password",
            },
            {
              step: "2",
              title: "BVN / NIN Verification",
              desc: "Link your BVN or NIN to confirm your identity",
            },
            {
              step: "3",
              title: "Government ID Upload",
              desc: "Upload a valid government-issued ID document",
            },
            {
              step: "4",
              title: "Address Verification",
              desc: "Provide your residential address and proof",
            },
            {
              step: "5",
              title: "Next of Kin",
              desc: "Add an emergency contact person",
            },
            {
              step: "6",
              title: "Liveness Check",
              desc: "Facial verification to confirm your identity",
            },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[#e8efe8]"
            >
              <div className="w-8 h-8 rounded-full bg-green/10 text-green flex items-center justify-center text-sm font-bold shrink-0">
                {step}
              </div>
              <div>
                <p className="font-semibold text-forest-text text-sm">
                  {title}
                </p>
                <p className="text-xs text-ink-mid mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
