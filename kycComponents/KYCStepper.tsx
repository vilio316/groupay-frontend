// ============================================================
// KYCProgressStepper.tsx
// Visual progress indicator for multi-step KYC flows
// ============================================================
import React from "react";

export interface KYCStep {
  id: string;
  label: string;
  sublabel?: string;
  status: "complete" | "active" | "upcoming" | "error";
}

interface KYCProgressStepperProps {
  steps: KYCStep[];
  tier: 1 | 2 | 3;
}

const tierColors = {
  1: "#49c635",
  2: "#00bd9d",
  3: "#54defd",
} as const;

export const KYCProgressStepper: React.FC<KYCProgressStepperProps> = ({
  steps,
  tier,
}) => {
  const accent = tierColors[tier];
  const completedCount = steps.filter((s) => s.status === "complete").length;
  const progress = Math.round((completedCount / steps.length) * 100);

  const s = {
    wrapper: {
      fontFamily: "Inter, sans-serif",
      background: "#fffbfa",
      border: "1px solid rgba(139,215,210,0.35)",
      borderRadius: 16,
      padding: "20px 24px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    title: {
      fontFamily: "Sora, sans-serif",
      fontWeight: 700,
      fontSize: 14,
      color: "#0d2b1f",
    },
    pct: { fontSize: 13, fontWeight: 700, color: accent },
    track: {
      height: 6,
      background: "rgba(139,215,210,0.25)",
      borderRadius: 9999,
      marginBottom: 20,
      overflow: "hidden",
    },
    fill: {
      height: "100%",
      width: `${progress}%`,
      background: `linear-gradient(90deg, ${accent}, #49c635)`,
      borderRadius: 9999,
      transition: "width 0.5s ease",
    },
    stepsRow: { display: "flex", flexDirection: "column" as const, gap: 0 },
    step: (status: KYCStep["status"]) => ({
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      padding: "10px 0",
      opacity: status === "upcoming" ? 0.5 : 1,
    }),
    nodeWrap: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
    },
    node: (status: KYCStep["status"]) => ({
      width: 28,
      height: 28,
      borderRadius: "50%",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: 700,
      background:
        status === "complete"
          ? accent
          : status === "active"
            ? "rgba(73,198,53,0.12)"
            : status === "error"
              ? "rgba(229,55,58,0.12)"
              : "rgba(139,215,210,0.2)",
      border: `2px solid ${
        status === "complete"
          ? accent
          : status === "active"
            ? accent
            : status === "error"
              ? "#e5373a"
              : "rgba(139,215,210,0.4)"
      }`,
      color:
        status === "complete"
          ? "#fffbfa"
          : status === "active"
            ? accent
            : status === "error"
              ? "#e5373a"
              : "#8bd7d2",
    }),
    connector: (isLast: boolean) => ({
      width: 2,
      flex: isLast ? "0" : "1",
      minHeight: isLast ? 0 : 12,
      background: "rgba(139,215,210,0.3)",
      marginTop: 2,
      marginBottom: 2,
    }),
    stepContent: { paddingTop: 4 },
    stepLabel: (status: KYCStep["status"]) => ({
      fontSize: 14,
      fontWeight: status === "active" ? 700 : 500,
      color: status === "error" ? "#e5373a" : "#0d2b1f",
      margin: 0,
    }),
    stepSub: {
      fontSize: 12,
      color: "#4a5568",
      marginTop: 2,
    },
  };

  const nodeContent = (status: KYCStep["status"], idx: number) => {
    if (status === "complete") return "✓";
    if (status === "error") return "✕";
    if (status === "active")
      return (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: accent,
            display: "block",
          }}
        />
      );
    return idx + 1;
  };

  return (
    <div style={s.wrapper}>
      <div style={s.header}>
        <span style={s.title}>Verification Progress</span>
        <span style={s.pct}>{progress}% complete</span>
      </div>
      <div style={s.track}>
        <div style={s.fill} />
      </div>
      <div style={s.stepsRow}>
        {steps.map((step, idx) => (
          <div key={step.id} style={s.step(step.status)}>
            <div style={s.nodeWrap}>
              <div style={s.node(step.status)}>
                {nodeContent(step.status, idx)}
              </div>
              <div style={s.connector(idx === steps.length - 1)} />
            </div>
            <div style={s.stepContent}>
              <p style={s.stepLabel(step.status)}>{step.label}</p>
              {step.sublabel && <p style={s.stepSub}>{step.sublabel}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KYCProgressStepper;
