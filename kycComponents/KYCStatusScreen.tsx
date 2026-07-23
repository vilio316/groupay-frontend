// ============================================================
// KYCStatusScreen.tsx
// Post-submission status: pending, approved, failed, rejected
// ============================================================
import React from "react";
import { KYCTier, TIER_LIMITS, TIER_LABELS } from "./tokens";

type StatusType = "pending" | "approved" | "failed" | "rejected";

interface KYCStatusScreenProps {
  status: StatusType;
  tier: KYCTier;
  failReason?: string;
  estimatedTime?: string;
  onRetry?: () => void;
  onContinue?: () => void;
  onContactSupport?: () => void;
}

const STATUS_CONFIG = {
  pending: {
    icon: "⏳",
    bg: "rgba(246,173,85,0.08)",
    border: "rgba(246,173,85,0.3)",
    accent: "#f6ad55",
    title: "Verification in Progress",
    subtitle: "Your documents are being reviewed by our compliance team.",
    ctaLabel: null,
  },
  approved: {
    icon: "🎉",
    bg: "rgba(73,198,53,0.08)",
    border: "rgba(73,198,53,0.3)",
    accent: "#49c635",
    title: "Verification Successful!",
    subtitle:
      "Your identity has been verified. Your account limits have been upgraded.",
    ctaLabel: "Go to Dashboard →",
  },
  failed: {
    icon: "⚠️",
    bg: "rgba(246,173,85,0.08)",
    border: "rgba(246,173,85,0.3)",
    accent: "#f6ad55",
    title: "Verification Unsuccessful",
    subtitle:
      "We were unable to verify your identity with the information provided.",
    ctaLabel: "Try Again →",
  },
  rejected: {
    icon: "🚫",
    bg: "rgba(229,55,58,0.06)",
    border: "rgba(229,55,58,0.25)",
    accent: "#e5373a",
    title: "Verification Rejected",
    subtitle:
      "Your verification has been reviewed and could not be approved at this time.",
    ctaLabel: "Contact Support",
  },
};

export const KYCStatusScreen: React.FC<KYCStatusScreenProps> = ({
  status,
  tier,
  failReason,
  estimatedTime = "24–48 hours",
  onRetry,
  onContinue,
  onContactSupport,
}) => {
  const config = STATUS_CONFIG[status];
  const limits = TIER_LIMITS[tier];
  const isApproved = status === "approved";

  const s: Record<string, React.CSSProperties> = {
    container: {
      fontFamily: "Inter, sans-serif",
      maxWidth: 480,
      textAlign: "center" as const,
      padding: "32px 0",
    },
    iconCircle: {
      width: 96,
      height: 96,
      borderRadius: "50%",
      margin: "0 auto 24px",
      background: config.bg,
      border: `2px solid ${config.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 40,
      animation: isApproved ? "popIn 0.4s ease-out" : undefined,
    },
    title: {
      fontFamily: "Sora, sans-serif",
      fontSize: 22,
      fontWeight: 800,
      color: "#0d2b1f",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      color: "#4a5568",
      lineHeight: 1.7,
      marginBottom: 24,
      padding: "0 16px",
    },
    tierBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: `${config.bg}`,
      border: `1px solid ${config.border}`,
      color: config.accent === "#49c635" ? "#1a6b0e" : config.accent,
      borderRadius: 9999,
      padding: "6px 16px",
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 24,
    },
    limitsCard: {
      background: "rgba(73,198,53,0.06)",
      border: "1px solid rgba(73,198,53,0.2)",
      borderRadius: 16,
      padding: "20px",
      margin: "0 auto 24px",
      maxWidth: 380,
    },
    limitsTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: "#1a6b0e",
      marginBottom: 14,
      textAlign: "center" as const,
    },
    limitsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 },
    limitItem: { textAlign: "center" as const },
    limitLabel: {
      fontSize: 11,
      color: "#4a5568",
      marginBottom: 4,
      textTransform: "uppercase" as const,
      letterSpacing: "0.04em",
    },
    limitVal: { fontSize: 14, fontWeight: 700, color: "#0d2b1f" },
    reasonCard: {
      background: "rgba(246,173,85,0.08)",
      border: "1px solid rgba(246,173,85,0.3)",
      borderRadius: 12,
      padding: "14px 16px",
      margin: "0 auto 20px",
      maxWidth: 400,
      textAlign: "left" as const,
    },
    reasonTitle: {
      fontSize: 12,
      fontWeight: 700,
      color: "#b7791f",
      marginBottom: 6,
      textTransform: "uppercase" as const,
    },
    reasonText: { fontSize: 13, color: "#4a5568", lineHeight: 1.6 },
    pendingSteps: {
      background: "#fffbfa",
      border: "1px solid rgba(139,215,210,0.3)",
      borderRadius: 12,
      padding: "16px",
      margin: "0 auto 24px",
      maxWidth: 400,
      textAlign: "left" as const,
    },
    stepItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 10,
    },
    stepDot: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "#f6ad55",
      flexShrink: 0,
      marginTop: 5,
      animation: "pulse 1.5s infinite",
    },
    stepText: { fontSize: 13, color: "#4a5568", lineHeight: 1.5 },
    primaryBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 200,
      height: 52,
      borderRadius: 9999,
      border: "none",
      background: config.accent,
      color: "#fffbfa",
      fontWeight: 700,
      fontSize: 15,
      cursor: "pointer",
      fontFamily: "Inter, sans-serif",
      marginBottom: 12,
    },
    secondaryBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 200,
      height: 44,
      borderRadius: 9999,
      border: `1.5px solid ${config.accent}`,
      background: "transparent",
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
      fontFamily: "Inter, sans-serif",
      color: config.accent,
    },
    etaRow: { fontSize: 13, color: "#4a5568", marginBottom: 24 },
  };

  return (
    <div style={s.container}>
      <style>{`
        @keyframes popIn{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>
      <div style={s.iconCircle}>{config.icon}</div>

      <div style={s.tierBadge}>
        {isApproved ? "✓ " : ""}
        {TIER_LABELS[tier]}
      </div>

      <h2 style={s.title}>{config.title}</h2>
      <p style={s.subtitle}>{config.subtitle}</p>

      {status === "pending" && (
        <>
          <p style={s.etaRow}>
            ⏱ Estimated review time: <strong>{estimatedTime}</strong>
          </p>
          <div style={s.pendingSteps}>
            {[
              "Document authenticity check with issuing authority",
              "Facial biometric verification against NIN/BVN record",
              "Address cross-reference and validation",
              "AML/PEP/Sanctions screening",
            ].map((step, i) => (
              <div key={i} style={s.stepItem}>
                <div style={s.stepDot} />
                <span style={s.stepText}>{step}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#4a5568", marginBottom: 24 }}>
            We'll notify you via email and push notification once complete.
          </p>
        </>
      )}

      {isApproved && (
        <div style={s.limitsCard}>
          <div style={s.limitsTitle}>🎯 Your new account limits</div>
          <div style={s.limitsGrid}>
            <div style={s.limitItem}>
              <div style={s.limitLabel}>Daily Limit</div>
              <div style={s.limitVal}>{limits.dailyCumulative}</div>
            </div>
            <div style={s.limitItem}>
              <div style={s.limitLabel}>Per Transaction</div>
              <div style={s.limitVal}>{limits.singleTx}</div>
            </div>
            <div style={s.limitItem}>
              <div style={s.limitLabel}>Max Balance</div>
              <div style={s.limitVal}>{limits.maxBalance}</div>
            </div>
          </div>
        </div>
      )}

      {(status === "failed" || status === "rejected") && failReason && (
        <div style={s.reasonCard}>
          <div style={s.reasonTitle}>Reason</div>
          <p style={s.reasonText}>{failReason}</p>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        {config.ctaLabel && (
          <button
            style={s.primaryBtn}
            onClick={
              status === "approved"
                ? onContinue
                : status === "rejected"
                  ? onContactSupport
                  : onRetry
            }
          >
            {config.ctaLabel}
          </button>
        )}
        {(status === "failed" || status === "pending") && (
          <button style={s.secondaryBtn} onClick={onContactSupport}>
            Contact Support
          </button>
        )}
      </div>
    </div>
  );
};

export default KYCStatusScreen;
