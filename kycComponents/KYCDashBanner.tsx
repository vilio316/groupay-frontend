// ============================================================
// KYCDashboardBanner.tsx
// Shows KYC tier status and upgrade prompt on the app dashboard
// ============================================================
import React from "react";
import { KYCTier, KYCStatus, TIER_LIMITS, TIER_LABELS } from "./tokens";

interface KYCDashboardBannerProps {
  currentTier: KYCTier;
  pendingStatus?: KYCStatus;
  onUpgrade: () => void;
}

const tierConfig = {
  0: {
    icon: "🔒",
    bg: "rgba(229,55,58,0.08)",
    border: "rgba(229,55,58,0.3)",
    accent: "#e5373a",
    message: "Verify your identity to start making payments on GrouPay.",
    ctaLabel: "Start Verification →",
    urgency: true,
  },
  1: {
    icon: "✅",
    bg: "rgba(73,198,53,0.08)",
    border: "rgba(73,198,53,0.3)",
    accent: "#49c635",
    message:
      "You're on Tier 1. Upgrade to Tier 2 to send to bank accounts and increase your limits.",
    ctaLabel: "Upgrade to Tier 2 →",
    urgency: false,
  },
  2: {
    icon: "🌟",
    bg: "rgba(0,189,157,0.08)",
    border: "rgba(0,189,157,0.3)",
    accent: "#00bd9d",
    message:
      "You're on Tier 2. Upgrade to Tier 3 for unlimited balances and premium features.",
    ctaLabel: "Upgrade to Tier 3 →",
    urgency: false,
  },
  3: {
    icon: "🏆",
    bg: "rgba(73,198,53,0.08)",
    border: "rgba(73,198,53,0.3)",
    accent: "#49c635",
    message: "Fully verified. You have access to all GrouPay features.",
    ctaLabel: null,
    urgency: false,
  },
} as const;

export const KYCDashboardBanner: React.FC<KYCDashboardBannerProps> = ({
  currentTier,
  pendingStatus,
  onUpgrade,
}) => {
  const config = tierConfig[currentTier];
  const limits = TIER_LIMITS[currentTier];
  const isPending =
    pendingStatus === "pending" || pendingStatus === "in_review";

  const styles: Record<string, React.CSSProperties> = {
    banner: {
      background: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: 16,
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      flexWrap: "wrap",
      fontFamily: "Inter, sans-serif",
    },
    left: { display: "flex", alignItems: "center", gap: 14, flex: 1 },
    iconBox: {
      width: 48,
      height: 48,
      borderRadius: 12,
      background: config.border,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 22,
      flexShrink: 0,
    },
    tierBadge: {
      display: "inline-block",
      background: config.accent,
      color: "#fffbfa",
      fontSize: 10,
      fontWeight: 700,
      padding: "2px 8px",
      borderRadius: 9999,
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      marginBottom: 4,
    },
    title: {
      fontSize: 14,
      fontWeight: 600,
      color: "#0d2b1f",
      margin: "0 0 2px",
    },
    subtitle: { fontSize: 13, color: "#4a5568", margin: 0 },
    limitsRow: {
      display: "flex",
      gap: 16,
      flexWrap: "wrap",
      marginTop: 8,
    },
    limitItem: { fontSize: 12, color: "#4a5568" },
    limitVal: { fontWeight: 700, color: "#0d2b1f" },
    cta: {
      background: config.accent,
      color: "#fffbfa",
      border: "none",
      borderRadius: 9999,
      padding: "10px 20px",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      whiteSpace: "nowrap" as const,
      fontFamily: "Inter, sans-serif",
      flexShrink: 0,
      transition: "opacity 0.15s",
    },
    pendingBadge: {
      background: "rgba(246,173,85,0.15)",
      border: "1px solid rgba(246,173,85,0.4)",
      color: "#b7791f",
      borderRadius: 9999,
      padding: "8px 16px",
      fontSize: 13,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: "#f6ad55",
      animation: "pulse 1.5s infinite",
    },
  };

  return (
    <div style={styles.banner}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <div style={styles.left}>
        <div style={styles.iconBox}>{config.icon}</div>
        <div>
          <div style={styles.tierBadge}>{TIER_LABELS[currentTier]}</div>
          <p style={styles.title}>
            {isPending ? "Verification in Progress" : `KYC Tier ${currentTier}`}
          </p>
          <p style={styles.subtitle}>
            {isPending
              ? "Your documents are being reviewed. We'll notify you within 24–72 hours."
              : config.message}
          </p>
          {currentTier > 0 && !isPending && (
            <div style={styles.limitsRow}>
              <span style={styles.limitItem}>
                Daily limit:{" "}
                <span style={styles.limitVal}>{limits.dailyCumulative}</span>
              </span>
              <span style={styles.limitItem}>
                Max balance:{" "}
                <span style={styles.limitVal}>{limits.maxBalance}</span>
              </span>
            </div>
          )}
        </div>
      </div>
      {isPending ? (
        <div style={styles.pendingBadge}>
          <div style={styles.dot} />
          Under Review
        </div>
      ) : config.ctaLabel && currentTier < 3 ? (
        <button style={styles.cta} onClick={onUpgrade}>
          {config.ctaLabel}
        </button>
      ) : null}
    </div>
  );
};

export default KYCDashboardBanner;
