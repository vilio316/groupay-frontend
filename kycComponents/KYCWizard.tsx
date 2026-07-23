// ============================================================
// KYCWizard.tsx
// Orchestrates the full KYC flow — routes between all KYC
// components with shared state and step-by-step navigation.
// ============================================================
"use client";
import React, { useState, useMemo } from "react";
import { KYCTier, AddressData, NextOfKin } from "./tokens";
import { KYCProgressStepper, KYCStep as StepDef } from "./KYCStepper";
import { KYCConsentGate } from "./Consent_TierUpgrade";
import { BVNNINVerification } from "./IDVerification";
import { PhoneOTPVerification } from "./PhoneNumberVerification";
import { AddressCapture } from "./AddressVerification";
import { NextOfKinCapture, ProofOfAddress } from "./NextOfKin_Address";
import { GovernmentIDUpload } from "./GovtIDVerification";
import { LivenessCheck } from "./SelfieCheck";
import { KYCStatusScreen } from "./KYCStatusScreen";

type WizardStep =
  | "consent"
  | "bvn-nin"
  | "phone-otp"
  | "address"
  | "address-doc"
  | "next-of-kin"
  | "govt-id"
  | "selfie"
  | "status";

interface VerifiedIDData {
  fullName: string;
  dateOfBirth: string;
  phone: string;
  idType: string;
  idNumber: string;
}

interface GovtIDData {
  idType: string;
  idNumber: string;
  idExpiry: string;
  frontUrl: string;
  backUrl?: string;
}

interface SelfieData {
  score: number;
  imageDataUrl: string;
}

interface KYCWizardProps {
  currentTier: KYCTier;
  onComplete?: (data: CollectedData) => void;
  onCancel?: () => void;
}

export interface CollectedData {
  bvnNin?: VerifiedIDData;
  phoneVerified?: boolean;
  address?: AddressData;
  addressDoc?: { docType: string; docUrl: string };
  nextOfKin?: NextOfKin;
  govtID?: GovtIDData;
  selfie?: SelfieData;
}

const STEP_ORDER: { id: WizardStep; label: string; sublabel: string }[] = [
  { id: "consent", label: "Consent", sublabel: "Data notice" },
  { id: "bvn-nin", label: "BVN / NIN", sublabel: "Identity verification" },
  { id: "phone-otp", label: "Phone OTP", sublabel: "Verify mobile" },
  { id: "address", label: "Address", sublabel: "Residential address" },
  { id: "address-doc", label: "Address Doc", sublabel: "Proof of address" },
  { id: "next-of-kin", label: "Next of Kin", sublabel: "Emergency contact" },
  { id: "govt-id", label: "Government ID", sublabel: "Document upload" },
  { id: "selfie", label: "Liveness", sublabel: "Facial check" },
  { id: "status", label: "Complete", sublabel: "Review" },
];

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "24px 16px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
  },
  navRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  backBtn: {
    background: "transparent",
    border: "1px solid rgba(139,215,210,0.35)",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    color: "#4a5568",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  progressContainer: {
    marginBottom: 32,
    padding: "16px 0",
    borderBottom: "1px solid rgba(139,215,210,0.25)",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#4a5568",
    marginBottom: 24,
  },
};

export const KYCWizard: React.FC<KYCWizardProps> = ({
  currentTier,
  onComplete,
  onCancel,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStep>>(
    new Set()
  );
  const [collected, setCollected] = useState<CollectedData>({});

  const targetTier: KYCTier = 3;
  const nextTier: 1 | 2 | 3 = currentTier >= 3 ? 3 : ((currentTier + 1) as 1 | 2 | 3);

  const stepIds = STEP_ORDER.map((s) => s.id);

  const currentStep = STEP_ORDER[stepIndex]?.id ?? "consent";

  const stepperSteps: StepDef[] = useMemo(
    () =>
      STEP_ORDER.map((s) => ({
        id: s.id,
        label: s.label,
        sublabel: s.sublabel,
        status: completedSteps.has(s.id)
          ? "complete"
          : s.id === currentStep
          ? "active"
          : "upcoming",
      })),
    [completedSteps, currentStep]
  );

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < STEP_ORDER.length) setStepIndex(idx);
  };

  const markComplete = (id: WizardStep) => {
    const next = new Set(completedSteps);
    next.add(id);
    setCompletedSteps(next);
  };

  const advance = () => {
    const nextIdx = stepIndex + 1;
    if (nextIdx < STEP_ORDER.length) {
      setStepIndex(nextIdx);
    }
  };

  const renderBackButton = () => {
    if (currentStep === "consent") return <div />;
    return (
      <button
        style={styles.backBtn}
        onClick={() => goTo(stepIndex - 1)}
      >
        ← Back
      </button>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case "consent":
        return (
          <KYCConsentGate
            targetTier={nextTier}
            onConsent={() => {
              markComplete("consent");
              advance();
            }}
            onDecline={() => onCancel?.()}
          />
        );

      case "bvn-nin":
        return (
          <BVNNINVerification
            onVerified={(data) => {
              setCollected((prev) => ({
                ...prev,
                bvnNin: {
                  fullName: data.fullName,
                  dateOfBirth: data.dateOfBirth,
                  phone: data.phone,
                  idType: data.idType,
                  idNumber: data.idNumber,
                },
              }));
              markComplete("bvn-nin");
              advance();
            }}
          />
        );

      case "phone-otp": {
        const phone =
          collected.bvnNin?.phone || "";
        if (!phone) {
          return (
            <div style={{ textAlign: "center", padding: 40, color: "#4a5568" }}>
              <p style={{ fontSize: 16, marginBottom: 8 }}>
                No phone number available from identity lookup.
              </p>
              <p style={{ fontSize: 14 }}>
                You may skip this step and verify your phone later.
              </p>
              <button
                style={{
                  ...styles.backBtn,
                  margin: "20px auto 0",
                  background: "#49c635",
                  color: "#fff",
                  border: "none",
                }}
                onClick={() => {
                  markComplete("phone-otp");
                  advance();
                }}
              >
                Skip for now →
              </button>
            </div>
          );
        }
        return (
          <PhoneOTPVerification
            phone={phone}
            onVerified={() => {
              setCollected((prev) => ({ ...prev, phoneVerified: true }));
              markComplete("phone-otp");
              advance();
            }}
          />
        );
      }

      case "address":
        return (
          <AddressCapture
            onComplete={(addr) => {
              setCollected((prev) => ({ ...prev, address: addr }));
              markComplete("address");
              advance();
            }}
          />
        );

      case "address-doc":
        return (
          <ProofOfAddress
            onComplete={(docType, docUrl) => {
              setCollected((prev) => ({
                ...prev,
                addressDoc: { docType, docUrl },
              }));
              markComplete("address-doc");
              advance();
            }}
          />
        );

      case "next-of-kin":
        return (
          <NextOfKinCapture
            onComplete={(nok) => {
              setCollected((prev) => ({ ...prev, nextOfKin: nok }));
              markComplete("next-of-kin");
              advance();
            }}
          />
        );

      case "govt-id":
        return (
          <GovernmentIDUpload
            onComplete={(result) => {
              setCollected((prev) => ({ ...prev, govtID: result }));
              markComplete("govt-id");
              advance();
            }}
          />
        );

      case "selfie":
        return (
          <LivenessCheck
            tier={3}
            onComplete={(score, imageDataUrl) => {
              setCollected((prev) => ({
                ...prev,
                selfie: { score, imageDataUrl },
              }));
              markComplete("selfie");
              advance();
            }}
            onFailed={() => {}}
          />
        );

      case "status":
        return (
          <KYCStatusScreen
            status="pending"
            tier={targetTier}
            estimatedTime="24 hours"
            onContinue={() => onComplete?.(collected)}
            onContactSupport={() => {}}
          />
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  const getStepTitle = () => {
    const item = STEP_ORDER[stepIndex];
    if (!item) return "";
    return `${stepIndex + 1}. ${item.label}`;
  };

  const getStepSubtitle = () => {
    const item = STEP_ORDER[stepIndex];
    if (!item) return "";
    return item.sublabel;
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.progressContainer}>
        <KYCProgressStepper
          steps={stepperSteps}
          tier={nextTier}
        />
      </div>

      <h2 style={styles.title}>{getStepTitle()}</h2>
      <p style={styles.subtitle}>{getStepSubtitle()}</p>

      {renderStep()}

      {currentStep !== "consent" && currentStep !== "status" && (
        <div style={styles.navRow}>
          {renderBackButton()}
          <div />
        </div>
      )}
    </div>
  );
};

export default KYCWizard;
