// ============================================================
// BVNNINVerification.tsx
// Step 1 of Tier 1 KYC — BVN/NIN capture + API lookup
// ============================================================
import React, { useState } from "react";

type IdentifierType = "bvn" | "nin";

interface VerifiedData {
  fullName: string;
  dateOfBirth: string;
  phone: string;
  idType: IdentifierType;
  idNumber: string;
}

interface BVNNINVerificationProps {
  onVerified: (data: VerifiedData) => void;
  onError?: (msg: string) => void;
}

// Simulated API call — replace with real NIBSS/NIMC integration
const mockLookup = async (
  type: IdentifierType,
  value: string,
): Promise<VerifiedData> => {
  await new Promise((r) => setTimeout(r, 2000));
  if (value === "00000000000")
    throw new Error("Record not found. Please check your number.");
  return {
    fullName: "Amara Chidinma Okafor",
    dateOfBirth: "1995-08-14",
    phone: "+234 801 234 5678",
    idType: type,
    idNumber: value,
  };
};

export const BVNNINVerification: React.FC<BVNNINVerificationProps> = ({
  onVerified,
  onError,
}) => {
  const [idType, setIdType] = useState<IdentifierType>("bvn");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifiedData | null>(null);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleLookup = async () => {
    if (value.length !== 11) {
      setError(`${idType.toUpperCase()} must be exactly 11 digits.`);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await mockLookup(idType, value);
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Verification failed. Please try again.");
      onError?.(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!result) return;
    setConfirmed(true);
    onVerified(result);
  };

  const s = {
    container: { fontFamily: "Inter, sans-serif", maxWidth: 480 },
    heading: {
      fontFamily: "Sora, sans-serif",
      fontSize: 20,
      fontWeight: 700,
      color: "#0d2b1f",
      marginBottom: 6,
    },
    sub: { fontSize: 14, color: "#4a5568", marginBottom: 24, lineHeight: 1.6 },
    toggle: {
      display: "flex",
      background: "rgba(139,215,210,0.15)",
      borderRadius: 10,
      padding: 4,
      marginBottom: 20,
      width: "fit-content",
    },
    toggleBtn: (active: boolean) => ({
      padding: "8px 20px",
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 600,
      fontFamily: "Inter, sans-serif",
      background: active ? "#49c635" : "transparent",
      color: active ? "#fffbfa" : "#4a5568",
      transition: "all 0.18s",
    }),
    label: {
      display: "block",
      fontSize: 12,
      fontWeight: 600,
      color: "#0d2b1f",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      marginBottom: 6,
    },
    inputRow: { display: "flex", gap: 10, marginBottom: 8 },
    input: {
      flex: 1,
      height: 48,
      padding: "0 14px",
      border: `1.5px solid ${error ? "#e5373a" : "rgba(139,215,210,0.5)"}`,
      borderRadius: 10,
      background: "#fffbfa",
      fontFamily: "Inter, sans-serif",
      fontSize: 16,
      letterSpacing: "0.08em",
      color: "#0d2b1f",
      outline: "none",
    },
    btn: (disabled: boolean) => ({
      height: 48,
      padding: "0 20px",
      borderRadius: 10,
      border: "none",
      background: disabled ? "#8bd7d2" : "#49c635",
      color: "#fffbfa",
      fontWeight: 700,
      fontSize: 14,
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "Inter, sans-serif",
      whiteSpace: "nowrap" as const,
      display: "flex",
      alignItems: "center",
      gap: 6,
    }),
    error: { fontSize: 12, color: "#e5373a", marginBottom: 12 },
    hint: { fontSize: 12, color: "#4a5568", marginBottom: 20 },
    resultCard: {
      background: "rgba(73,198,53,0.06)",
      border: "1px solid rgba(73,198,53,0.25)",
      borderRadius: 12,
      padding: 20,
      marginTop: 16,
    },
    resultTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: "#1a6b0e",
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 14,
    },
    row: { display: "flex", justifyContent: "space-between", marginBottom: 10 },
    rowLabel: { fontSize: 13, color: "#4a5568" },
    rowVal: {
      fontSize: 13,
      fontWeight: 600,
      color: "#0d2b1f",
      textAlign: "right" as const,
    },
    divider: {
      height: 1,
      background: "rgba(73,198,53,0.15)",
      margin: "12px 0",
    },
    confirmNote: {
      fontSize: 12,
      color: "#4a5568",
      marginBottom: 14,
      lineHeight: 1.6,
    },
    confirmBtn: {
      width: "100%",
      height: 48,
      borderRadius: 9999,
      border: "none",
      background: "#49c635",
      color: "#fffbfa",
      fontWeight: 700,
      fontSize: 15,
      cursor: "pointer",
      fontFamily: "Inter, sans-serif",
    },
    successBadge: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "12px 16px",
      background: "rgba(73,198,53,0.1)",
      border: "1px solid rgba(73,198,53,0.3)",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 600,
      color: "#1a6b0e",
    },
  };

  if (confirmed && result) {
    return (
      <div style={s.container}>
        <div style={s.successBadge}>
          <span>✅</span>
          {result.idType.toUpperCase()} verified — {result.fullName}
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <h2 style={s.heading}>Identity Number</h2>
      <p style={s.sub}>
        Enter your BVN or NIN to verify your identity. Your details will be
        retrieved directly from {idType === "bvn" ? "NIBSS" : "NIMC"}.
      </p>

      <div style={s.toggle}>
        <button
          style={s.toggleBtn(idType === "bvn")}
          onClick={() => {
            setIdType("bvn");
            setValue("");
            setError("");
            setResult(null);
          }}
        >
          BVN
        </button>
        <button
          style={s.toggleBtn(idType === "nin")}
          onClick={() => {
            setIdType("nin");
            setValue("");
            setError("");
            setResult(null);
          }}
        >
          NIN
        </button>
      </div>

      <label style={s.label}>Enter your {idType.toUpperCase()}</label>
      <div style={s.inputRow}>
        <input
          style={s.input}
          type="tel"
          maxLength={11}
          placeholder="11-digit number"
          value={value}
          onChange={(e) => {
            setValue(e.target.value.replace(/\D/g, ""));
            setError("");
            setResult(null);
          }}
        />
        <button
          style={s.btn(loading || value.length !== 11)}
          onClick={handleLookup}
          disabled={loading || value.length !== 11}
        >
          {loading ? (
            <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <Spinner />
              Verifying
            </span>
          ) : (
            "Verify"
          )}
        </button>
      </div>

      {error && <p style={s.error}>⚠ {error}</p>}
      <p style={s.hint}>
        Your {idType.toUpperCase()} is{" "}
        {idType === "bvn"
          ? "the 11-digit number on your bank account"
          : "on your National ID slip or NIMC mobile app"}
        .
      </p>

      {result && (
        <div style={s.resultCard}>
          <div style={s.resultTitle}>
            <span>✅</span> Record found — please confirm your details
          </div>
          <div style={s.row}>
            <span style={s.rowLabel}>Full name</span>
            <span style={s.rowVal}>{result.fullName}</span>
          </div>
          <div style={s.row}>
            <span style={s.rowLabel}>Date of birth</span>
            <span style={s.rowVal}>
              {new Date(result.dateOfBirth).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div style={s.row}>
            <span style={s.rowLabel}>Phone</span>
            <span style={s.rowVal}>
              {result.phone.replace(/(\d{4})(\d{3})(\d{4})/, "•••• ••• $3")}
            </span>
          </div>
          <div style={s.row}>
            <span style={s.rowLabel}>{result.idType.toUpperCase()}</span>
            <span style={s.rowVal}>
              {value.slice(0, 4) + "•••••" + value.slice(-2)}
            </span>
          </div>
          <div style={s.divider} />
          <p style={s.confirmNote}>
            By confirming, you consent to GrouPay retrieving and storing your
            identity information for KYC purposes in accordance with the NDPA
            2023 and CBN AML/CFT regulations.
          </p>
          <button style={s.confirmBtn} onClick={handleConfirm}>
            Confirm — this is me ✓
          </button>
        </div>
      )}
    </div>
  );
};

// Inline spinner
const Spinner = () => (
  <span
    style={{
      width: 14,
      height: 14,
      border: "2px solid rgba(255,255,255,0.3)",
      borderTopColor: "#fffbfa",
      borderRadius: "50%",
      display: "inline-block",
      animation: "kspin 0.7s linear infinite",
    }}
  >
    <style>{`@keyframes kspin{to{transform:rotate(360deg)}}`}</style>
  </span>
);

export default BVNNINVerification;
