// ============================================================
// KYCConsentGate.tsx — NDPA 2023-compliant consent screen
// KYCTierUpgradePrompt.tsx — Tier upgrade CTA modal/page
// ============================================================
import React, { useState } from "react";
import { KYCTier, TIER_LIMITS, TIER_LABELS } from "./tokens";

// ─────────────────────────────────────────────────────────
// CONSENT GATE
// ─────────────────────────────────────────────────────────
interface KYCConsentGateProps {
  targetTier: 1 | 2 | 3;
  onConsent: () => void;
  onDecline: () => void;
}

const DATA_COLLECTED: Record<1 | 2 | 3, { icon: string; item: string }[]> = {
  1: [
    { icon: "🔢", item: "BVN or NIN number" },
    {
      icon: "👤",
      item: "Full legal name and date of birth (from BVN/NIN record)",
    },
    { icon: "📱", item: "BVN/NIN-registered phone number" },
    { icon: "🏠", item: "Residential address (self-declared)" },
    { icon: "🤳", item: "Selfie photo for facial biometric matching" },
  ],
  2: [
    { icon: "🔢", item: "BVN and NIN (both required)" },
    { icon: "🪪", item: "Government-issued photo ID (scanned front and back)" },
    { icon: "📄", item: "Proof of address document" },
    { icon: "👨‍👩‍👧", item: "Next of kin details (name, phone, relationship)" },
  ],
  3: [
    { icon: "📍", item: "Physical address verification record" },
    { icon: "🎥", item: "Enhanced liveness video (3D challenge-response)" },
    {
      icon: "💼",
      item: "Source of funds declaration and supporting documents",
    },
    {
      icon: "🔍",
      item: "PEP/Sanctions screening data (Refinitiv World-Check)",
    },
  ],
};

const DATA_SHARED: Record<1 | 2 | 3, string[]> = {
  1: [
    "NIBSS (BVN validation)",
    "NIMC (NIN validation)",
    "Smile ID (liveness & facial match)",
    "Termii (OTP delivery)",
  ],
  2: [
    "All Tier 1 partners",
    "FRSC / INEC / NIS / NIMC (ID verification)",
    "AWS Textract (OCR)",
    "Google Maps (address validation)",
  ],
  3: [
    "All Tier 2 partners",
    "iProov (3D liveness)",
    "Refinitiv World-Check (sanctions screening)",
    "NFIU (regulatory reporting if required)",
  ],
};

export const KYCConsentGate: React.FC<KYCConsentGateProps> = ({
  targetTier,
  onConsent,
  onDecline,
}) => {
  const [checked, setChecked] = useState({
    data: false,
    sharing: false,
    retention: false,
  });
  const allChecked = Object.values(checked).every(Boolean);

  const tierColor =
    targetTier === 1 ? "#49c635" : targetTier === 2 ? "#00bd9d" : "#54defd";
  const tierTextColor =
    targetTier === 3 ? "#006e8a" : targetTier === 2 ? "#005f50" : "#1a6b0e";

  const s = {
    container: { fontFamily: "Inter, sans-serif", maxWidth: 520 },
    heading: {
      fontFamily: "Sora, sans-serif",
      fontSize: 20,
      fontWeight: 700,
      color: "#0d2b1f",
      marginBottom: 6,
    },
    sub: { fontSize: 14, color: "#4a5568", marginBottom: 24, lineHeight: 1.6 },
    tierChip: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: `rgba(${targetTier === 3 ? "84,222,253" : targetTier === 2 ? "0,189,157" : "73,198,53"},0.12)`,
      color: tierTextColor,
      border: `1px solid ${tierColor}44`,
      borderRadius: 9999,
      padding: "4px 12px",
      fontSize: 12,
      fontWeight: 700,
      marginBottom: 16,
    },
    section: {
      background: "#fffbfa",
      border: "1px solid rgba(139,215,210,0.35)",
      borderRadius: 12,
      padding: "16px",
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: "#0d2b1f",
      marginBottom: 10,
    },
    dataItem: {
      display: "flex",
      gap: 8,
      marginBottom: 6,
      fontSize: 13,
      color: "#4a5568",
      alignItems: "flex-start",
    },
    dataIcon: { fontSize: 14, flexShrink: 0, marginTop: 1 },
    partnerList: { display: "flex", flexWrap: "wrap" as const, gap: 6 },
    partnerChip: {
      background: "rgba(139,215,210,0.12)",
      border: "1px solid rgba(139,215,210,0.3)",
      color: "#4a5568",
      borderRadius: 9999,
      padding: "3px 10px",
      fontSize: 12,
    },
    checkRow: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 12,
      padding: "12px 14px",
      borderRadius: 10,
      border: "1px solid rgba(139,215,210,0.25)",
      background: "rgba(255,251,250,0.8)",
    },
    checkbox: {
      width: 18,
      height: 18,
      accentColor: "#49c635",
      flexShrink: 0,
      marginTop: 2,
      cursor: "pointer",
    },
    checkLabel: { fontSize: 13, color: "#4a5568", lineHeight: 1.5 },
    btnRow: { display: "flex", gap: 12, marginTop: 20 },
    proceedBtn: (ready: boolean) => ({
      flex: 2,
      height: 52,
      borderRadius: 9999,
      border: "none",
      background: ready ? tierColor : "#8bd7d2",
      color: "#fffbfa",
      fontWeight: 700,
      fontSize: 15,
      cursor: ready ? "pointer" : "not-allowed",
      fontFamily: "Inter, sans-serif",
    }),
    declineBtn: {
      flex: 1,
      height: 52,
      borderRadius: 9999,
      border: `1.5px solid rgba(139,215,210,0.5)`,
      background: "transparent",
      color: "#4a5568",
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
      fontFamily: "Inter, sans-serif",
    },
    ndpaNote: {
      fontSize: 12,
      color: "#8bd7d2",
      textAlign: "center" as const,
      marginTop: 12,
    },
  };

  const toggle = (k: keyof typeof checked) =>
    setChecked((c) => ({ ...c, [k]: !c[k] }));

  return (
    <div style={s.container}>
      <div style={s.tierChip}>
        🔐 Tier {targetTier} Verification — {TIER_LABELS[targetTier as KYCTier]}
      </div>
      <h2 style={s.heading}>Data Consent</h2>
      <p style={s.sub}>
        Before we proceed, we need your consent to collect and process your
        personal data in accordance with the{" "}
        <strong>Nigeria Data Protection Act (NDPA) 2023</strong> and
        <strong> CBN AML/CFT Regulations</strong>.
      </p>

      <div style={s.section}>
        <div style={s.sectionTitle}>📋 Data we will collect</div>
        {DATA_COLLECTED[targetTier].map((item, i) => (
          <div key={i} style={s.dataItem}>
            <span style={s.dataIcon}>{item.icon}</span>
            <span>{item.item}</span>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>🤝 Third parties we share with</div>
        <div style={s.partnerList}>
          {DATA_SHARED[targetTier].map((p, i) => (
            <span key={i} style={s.partnerChip}>
              {p}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20, marginBottom: 4 }}>
        {[
          {
            key: "data",
            label:
              "I consent to GrouPay collecting and processing the personal data listed above for the purpose of identity verification.",
          },
          {
            key: "sharing",
            label:
              "I consent to GrouPay sharing my data with the listed third-party verification partners solely for KYC purposes.",
          },
          {
            key: "retention",
            label:
              "I understand that my data will be retained for 5 years after account closure as required by CBN AML/CFT regulations.",
          },
        ].map(({ key, label }) => (
          <div key={key} style={s.checkRow}>
            <input
              type="checkbox"
              style={s.checkbox}
              checked={checked[key as keyof typeof checked]}
              onChange={() => toggle(key as keyof typeof checked)}
              id={`consent_${key}`}
            />
            <label htmlFor={`consent_${key}`} style={s.checkLabel}>
              {label}
            </label>
          </div>
        ))}
      </div>

      <div style={s.btnRow}>
        <button style={s.declineBtn} onClick={onDecline}>
          Decline
        </button>
        <button
          style={s.proceedBtn(allChecked)}
          onClick={allChecked ? onConsent : undefined}
          disabled={!allChecked}
        >
          {allChecked
            ? "I Agree — Continue →"
            : "Please accept all to continue"}
        </button>
      </div>
      <p style={s.ndpaNote}>
        Protected under the Nigeria Data Protection Act 2023 · Your rights:
        access, correct, delete
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// TIER UPGRADE PROMPT
// ─────────────────────────────────────────────────────────
interface TierUpgradePromptProps {
  currentTier: KYCTier;
  targetTier: 1 | 2 | 3;
  trigger?: "limit_hit" | "feature_gate" | "proactive";
  blockedFeature?: string;
  onUpgrade: () => void;
  onDismiss: () => void;
}

const TIER_FEATURES: Record<1 | 2 | 3, string[]> = {
  1: [
    "Receive and contribute to group payments",
    "Split bills with friends",
    "Wallet balance up to ₦300,000",
  ],
  2: [
    "Send to external bank accounts",
    "Full bill splitting features",
    "Daily limit up to ₦200,000",
    "Wallet balance up to ₦500,000",
  ],
  3: [
    "Unlimited wallet balance",
    "Daily transactions up to ₦5,000,000",
    "International group payments",
    "Premium GrouPay features",
  ],
};

export const KYCTierUpgradePrompt: React.FC<TierUpgradePromptProps> = ({
  currentTier,
  targetTier,
  trigger,
  blockedFeature,
  onUpgrade,
  onDismiss,
}) => {
  const fromLimits = TIER_LIMITS[currentTier];
  const toLimits = TIER_LIMITS[targetTier as KYCTier];
  const tierColor =
    targetTier === 1 ? "#49c635" : targetTier === 2 ? "#00bd9d" : "#54defd";

  const s = {
    overlay: {
      position: "fixed" as const,
      inset: 0,
      background: "rgba(13,43,31,0.5)",
      zIndex: 200,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
    },
    sheet: {
      background: "#fffbfa",
      borderRadius: "20px 20px 0 0",
      padding: "28px 24px 36px",
      width: "100%",
      maxWidth: 520,
      fontFamily: "Inter, sans-serif",
      animation: "slideUp 0.25s ease-out",
    },
    handle: {
      width: 36,
      height: 4,
      background: "rgba(139,215,210,0.4)",
      borderRadius: 9999,
      margin: "0 auto 20px",
    },
    heading: {
      fontFamily: "Sora, sans-serif",
      fontSize: 20,
      fontWeight: 800,
      color: "#0d2b1f",
      marginBottom: 8,
    },
    sub: { fontSize: 14, color: "#4a5568", lineHeight: 1.6, marginBottom: 20 },
    triggerBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "5px 12px",
      borderRadius: 9999,
      fontSize: 12,
      fontWeight: 700,
      marginBottom: 16,
      background: "rgba(229,55,58,0.1)",
      color: "#e5373a",
      border: "1px solid rgba(229,55,58,0.25)",
    },
    compareRow: {
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      gap: 12,
      alignItems: "center",
      marginBottom: 20,
    },
    limitBox: (isCurrent: boolean) => ({
      background: isCurrent
        ? "rgba(139,215,210,0.1)"
        : `rgba(${targetTier === 3 ? "84,222,253" : targetTier === 2 ? "0,189,157" : "73,198,53"},0.08)`,
      border: `1px solid ${isCurrent ? "rgba(139,215,210,0.3)" : `${tierColor}33`}`,
      borderRadius: 12,
      padding: "12px 14px",
    }),
    limitBoxLabel: {
      fontSize: 11,
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      color: "#4a5568",
      marginBottom: 8,
    },
    limitStat: { marginBottom: 6 },
    limitStatLabel: { fontSize: 11, color: "#4a5568" },
    limitStatVal: { fontSize: 14, fontWeight: 700, color: "#0d2b1f" },
    arrow: { fontSize: 22, color: tierColor, textAlign: "center" as const },
    featureList: { marginBottom: 20 },
    featureItem: {
      display: "flex",
      gap: 8,
      marginBottom: 8,
      alignItems: "center",
      fontSize: 13,
      color: "#4a5568",
    },
    checkMark: { color: tierColor, fontSize: 14, flexShrink: 0 },
    upgradeBtn: {
      width: "100%",
      height: 52,
      borderRadius: 9999,
      border: "none",
      background: tierColor,
      color: "#fffbfa",
      fontWeight: 700,
      fontSize: 15,
      cursor: "pointer",
      fontFamily: "Inter, sans-serif",
      marginBottom: 10,
    },
    dismissBtn: {
      width: "100%",
      height: 44,
      borderRadius: 9999,
      border: "1.5px solid rgba(139,215,210,0.4)",
      background: "transparent",
      color: "#4a5568",
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
      fontFamily: "Inter, sans-serif",
    },
  };

  return (
    <div
      style={s.overlay}
      onClick={(e) => e.target === e.currentTarget && onDismiss()}
    >
      <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
      <div style={s.sheet}>
        <div style={s.handle} />
        {trigger === "limit_hit" && (
          <div style={s.triggerBadge}>⛔ Transaction limit reached</div>
        )}
        {trigger === "feature_gate" && blockedFeature && (
          <div
            style={{
              ...s.triggerBadge,
              background: "rgba(246,173,85,0.1)",
              color: "#b7791f",
              border: "1px solid rgba(246,173,85,0.3)",
            }}
          >
            🔒 {blockedFeature} requires Tier {targetTier}
          </div>
        )}
        <h2 style={s.heading}>Upgrade to Tier {targetTier}</h2>
        <p style={s.sub}>
          Complete a quick verification to unlock higher limits and more
          features.
        </p>
        <div style={s.compareRow}>
          <div style={s.limitBox(true)}>
            <div style={s.limitBoxLabel}>Current (Tier {currentTier})</div>
            <div style={s.limitStat}>
              <div style={s.limitStatLabel}>Daily limit</div>
              <div style={s.limitStatVal}>{fromLimits.dailyCumulative}</div>
            </div>
            <div style={s.limitStat}>
              <div style={s.limitStatLabel}>Max balance</div>
              <div style={s.limitStatVal}>{fromLimits.maxBalance}</div>
            </div>
          </div>
          <div style={s.arrow}>→</div>
          <div style={s.limitBox(false)}>
            <div
              style={{
                ...s.limitBoxLabel,
                color:
                  tierColor === "#54defd"
                    ? "#006e8a"
                    : tierColor === "#00bd9d"
                      ? "#005f50"
                      : "#1a6b0e",
              }}
            >
              Tier {targetTier} Unlocks
            </div>
            <div style={s.limitStat}>
              <div style={s.limitStatLabel}>Daily limit</div>
              <div
                style={{
                  ...s.limitStatVal,
                  color: tierColor === "#54defd" ? "#006e8a" : "#0d2b1f",
                }}
              >
                {toLimits.dailyCumulative}
              </div>
            </div>
            <div style={s.limitStat}>
              <div style={s.limitStatLabel}>Max balance</div>
              <div
                style={{
                  ...s.limitStatVal,
                  color: tierColor === "#54defd" ? "#006e8a" : "#0d2b1f",
                }}
              >
                {toLimits.maxBalance}
              </div>
            </div>
          </div>
        </div>
        <div style={s.featureList}>
          {TIER_FEATURES[targetTier].map((f, i) => (
            <div key={i} style={s.featureItem}>
              <span style={s.checkMark}>✓</span>
              {f}
            </div>
          ))}
        </div>
        <button style={s.upgradeBtn} onClick={onUpgrade}>
          Start Tier {targetTier} Verification →
        </button>
        <button style={s.dismissBtn} onClick={onDismiss}>
          Maybe later
        </button>
      </div>
    </div>
  );
};
