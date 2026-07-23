// ============================================================
// tokens.ts — GrouPay Design System Tokens
// ============================================================
export const colors = {
  green: "#49c635",
  aqua: "#54defd",
  white: "#fffbfa",
  teal: "#00bd9d",
  mist: "#8bd7d2",
  forest: "#0d2b1f",
  ink: "#1a1a1a",
  inkMid: "#4a5568",
  error: "#e5373a",
  warning: "#f6ad55",
  cardBorder: "rgba(139,215,210,0.35)",
} as const;

// ============================================================
// types.ts — KYC shared types
// ============================================================
export type KYCTier = 0 | 1 | 2 | 3;
export type KYCStatus =
  | "idle"
  | "pending"
  | "in_review"
  | "approved"
  | "failed"
  | "rejected";

export type IDType =
  | "nin_card"
  | "passport"
  | "drivers_licence"
  | "voters_card";
export type AddressDocType =
  | "utility_bill"
  | "bank_statement"
  | "tenancy_agreement";

export interface KYCState {
  currentTier: KYCTier;
  tier1Status: KYCStatus;
  tier2Status: KYCStatus;
  tier3Status: KYCStatus;
  // Tier 1 data
  bvn?: string;
  nin?: string;
  legalName?: string;
  dateOfBirth?: string;
  phone?: string;
  residentialAddress?: AddressData;
  livenessScore?: number;
  livenessVerified?: boolean;
  phoneOTPVerified?: boolean;
  // Tier 2 data
  idType?: IDType;
  idNumber?: string;
  idExpiry?: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  addressDocType?: AddressDocType;
  addressDocUrl?: string;
  nextOfKin?: NextOfKin;
  // Tier 3 data
  addressPhysicallyVerified?: boolean;
  sourceOfFunds?: string;
  sourceOfFundsDocUrl?: string;
  pepScreeningPassed?: boolean;
  sanctionsScreeningPassed?: boolean;
}

export interface AddressData {
  street: string;
  lga: string;
  state: string;
}

export interface NextOfKin {
  fullName: string;
  phone: string;
  relationship: string;
}

export interface TierLimit {
  singleTx: string;
  dailyCumulative: string;
  maxBalance: string;
}

export const TIER_LIMITS: Record<KYCTier, TierLimit> = {
  0: { singleTx: "₦0", dailyCumulative: "₦0", maxBalance: "₦0" },
  1: {
    singleTx: "₦50,000",
    dailyCumulative: "₦50,000",
    maxBalance: "₦300,000",
  },
  2: {
    singleTx: "₦200,000",
    dailyCumulative: "₦200,000",
    maxBalance: "₦500,000",
  },
  3: {
    singleTx: "₦5,000,000",
    dailyCumulative: "₦5,000,000",
    maxBalance: "Unlimited",
  },
};

export const TIER_LABELS: Record<KYCTier, string> = {
  0: "Unverified",
  1: "Basic Verified",
  2: "Enhanced Verified",
  3: "Fully Verified",
};
