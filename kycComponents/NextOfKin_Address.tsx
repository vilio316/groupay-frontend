// ============================================================
// NextOfKin.tsx — Tier 2 next of kin capture
// ProofOfAddress.tsx — Tier 2 address document upload
// ============================================================
import React, { useState, useRef } from "react";
import { AddressDocType, NextOfKin } from "./tokens";

// ─────────────────────────────────────────────────────────
// NEXT OF KIN
// ─────────────────────────────────────────────────────────
interface NextOfKinProps {
  onComplete: (data: NextOfKin) => void;
}

const RELATIONSHIPS = [
  "Spouse",
  "Parent",
  "Sibling",
  "Child",
  "Relative",
  "Friend",
  "Colleague",
];

export const NextOfKinCapture: React.FC<NextOfKinProps> = ({ onComplete }) => {
  const [form, setForm] = useState<NextOfKin>({
    fullName: "",
    phone: "",
    relationship: "",
  });
  const [errors, setErrors] = useState<Partial<NextOfKin>>({});
  const [done, setDone] = useState(false);

  const set = (k: keyof NextOfKin, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const submit = () => {
    const e: Partial<NextOfKin> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!/^\+?[0-9\s]{10,14}$/.test(form.phone))
      e.phone = "Enter a valid phone number";
    if (!form.relationship) e.relationship = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    setDone(true);
    onComplete(form);
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
    infoBox: {
      background: "rgba(139,215,210,0.1)",
      border: "1px solid rgba(139,215,210,0.3)",
      borderRadius: 10,
      padding: "12px 14px",
      marginBottom: 20,
      fontSize: 13,
      color: "#4a5568",
      display: "flex",
      gap: 8,
    },
    row: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: 14,
      marginBottom: 16,
    },
    field: { marginBottom: 16 },
    label: {
      display: "block",
      fontSize: 12,
      fontWeight: 600,
      color: "#0d2b1f",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      marginBottom: 6,
    },
    input: (err: boolean) => ({
      width: "100%",
      height: 48,
      padding: "0 14px",
      boxSizing: "border-box" as const,
      border: `1.5px solid ${err ? "#e5373a" : "rgba(139,215,210,0.5)"}`,
      borderRadius: 10,
      background: "#fffbfa",
      fontFamily: "Inter, sans-serif",
      fontSize: 15,
      color: "#0d2b1f",
      outline: "none",
    }),
    select: (err: boolean) => ({
      width: "100%",
      height: 48,
      padding: "0 14px",
      boxSizing: "border-box" as const,
      border: `1.5px solid ${err ? "#e5373a" : "rgba(139,215,210,0.5)"}`,
      borderRadius: 10,
      background: "#fffbfa",
      fontFamily: "Inter, sans-serif",
      fontSize: 15,
      color: form.relationship ? "#0d2b1f" : "#b0bec5",
      outline: "none",
      appearance: "none" as const,
    }),
    error: { fontSize: 12, color: "#e5373a", marginTop: 4 },
    btn: {
      width: "100%",
      height: 52,
      borderRadius: 9999,
      border: "none",
      background: "#49c635",
      color: "#fffbfa",
      fontWeight: 700,
      fontSize: 15,
      cursor: "pointer",
      fontFamily: "Inter, sans-serif",
    },
    success: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "14px 16px",
      background: "rgba(73,198,53,0.1)",
      border: "1px solid rgba(73,198,53,0.3)",
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 600,
      color: "#1a6b0e",
    },
  };

  if (done)
    return (
      <div style={s.container}>
        <div style={s.success}>
          <span>✅</span>Next of kin saved — {form.fullName} (
          {form.relationship})
        </div>
      </div>
    );

  return (
    <div style={s.container}>
      <h2 style={s.heading}>Next of Kin</h2>
      <p style={s.sub}>
        Please provide your next of kin details. This is required by the CBN for
        all Tier 2 accounts.
      </p>
      <div style={s.infoBox}>
        <span>🔒</span>
        <span>
          This information is stored securely and will only be used in the event
          of a dispute or emergency.
        </span>
      </div>
      <div style={s.row}>
        <div>
          <label style={s.label}>Full Legal Name</label>
          <input
            style={s.input(!!errors.fullName)}
            type="text"
            placeholder="e.g. Emeka Okafor"
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
          />
          {errors.fullName && <p style={s.error}>⚠ {errors.fullName}</p>}
        </div>
        <div>
          <label style={s.label}>Relationship</label>
          <select
            style={s.select(!!errors.relationship)}
            value={form.relationship}
            onChange={(e) => set("relationship", e.target.value)}
          >
            <option value="">Select</option>
            {RELATIONSHIPS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.relationship && (
            <p style={s.error}>⚠ {errors.relationship}</p>
          )}
        </div>
      </div>
      <div style={s.field}>
        <label style={s.label}>Phone Number</label>
        <input
          style={s.input(!!errors.phone)}
          type="tel"
          placeholder="+234 800 000 0000"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
        {errors.phone && <p style={s.error}>⚠ {errors.phone}</p>}
      </div>
      <button style={s.btn} onClick={submit}>
        Save Next of Kin →
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// PROOF OF ADDRESS
// ─────────────────────────────────────────────────────────
interface ProofOfAddressProps {
  onComplete: (docType: AddressDocType, docUrl: string) => void;
}

const ADDRESS_DOC_OPTIONS: {
  value: AddressDocType;
  label: string;
  icon: string;
  note: string;
}[] = [
  {
    value: "utility_bill",
    label: "Utility Bill",
    icon: "💡",
    note: "PHCN, water board, etc. — max 3 months old",
  },
  {
    value: "bank_statement",
    label: "Bank Statement",
    icon: "🏦",
    note: "Official letterhead — max 3 months old",
  },
  {
    value: "tenancy_agreement",
    label: "Tenancy Agreement",
    icon: "🏠",
    note: "Signed by landlord — within current year",
  },
];

export const ProofOfAddress: React.FC<ProofOfAddressProps> = ({
  onComplete,
}) => {
  const [docType, setDocType] = useState<AddressDocType | null>(null);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [ocrAddress, setOCRAddress] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const selected = ADDRESS_DOC_OPTIONS.find((o) => o.value === docType);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const url = reader.result as string;
      setDocUrl(url);
      setProcessing(true);
      await new Promise((r) => setTimeout(r, 2200));
      setOCRAddress("14B Adeola Odeku Street, Victoria Island, Lagos");
      setProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!docType || !docUrl) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setDone(true);
    setProcessing(false);
    onComplete(docType, docUrl);
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
    optionGrid: {
      display: "flex",
      flexDirection: "column" as const,
      gap: 10,
      marginBottom: 20,
    },
    option: (active: boolean) => ({
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 16px",
      border: `2px solid ${active ? "#49c635" : "rgba(139,215,210,0.4)"}`,
      background: active ? "rgba(73,198,53,0.06)" : "#fffbfa",
      borderRadius: 12,
      cursor: "pointer",
      transition: "all 0.15s",
    }),
    optIcon: { fontSize: 24, flexShrink: 0 },
    optLabel: (active: boolean) => ({
      fontWeight: active ? 700 : 500,
      fontSize: 14,
      color: "#0d2b1f",
    }),
    optNote: { fontSize: 12, color: "#4a5568", marginTop: 2 },
    uploadArea: (hasFile: boolean) => ({
      border: `2px dashed ${hasFile ? "#49c635" : "rgba(139,215,210,0.5)"}`,
      borderRadius: 12,
      padding: 24,
      textAlign: "center" as const,
      cursor: "pointer",
      background: hasFile ? "rgba(73,198,53,0.05)" : "rgba(139,215,210,0.04)",
      marginBottom: 16,
      transition: "all 0.15s",
    }),
    uploadIcon: { fontSize: 36, marginBottom: 8 },
    uploadText: { fontSize: 14, fontWeight: 600, color: "#4a5568" },
    uploadSub: { fontSize: 12, color: "#8bd7d2", marginTop: 4 },
    ocrCard: {
      background: "rgba(84,222,253,0.08)",
      border: "1px solid rgba(84,222,253,0.25)",
      borderRadius: 10,
      padding: "12px 14px",
      marginBottom: 16,
      fontSize: 13,
    },
    btn: {
      width: "100%",
      height: 52,
      borderRadius: 9999,
      border: "none",
      background: processing ? "#8bd7d2" : "#49c635",
      color: "#fffbfa",
      fontWeight: 700,
      fontSize: 15,
      cursor: processing ? "not-allowed" : "pointer",
      fontFamily: "Inter, sans-serif",
    },
    success: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "14px 16px",
      background: "rgba(73,198,53,0.1)",
      border: "1px solid rgba(73,198,53,0.3)",
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 600,
      color: "#1a6b0e",
    },
  };

  if (done)
    return (
      <div style={s.container}>
        <div style={s.success}>
          <span>✅</span>
          {selected?.label} uploaded and address confirmed.
        </div>
      </div>
    );

  return (
    <div style={s.container}>
      <h2 style={s.heading}>Proof of Address</h2>
      <p style={s.sub}>
        Upload a document showing your name and current Nigerian residential
        address. It must be dated within the last 3 months.
      </p>

      <div style={s.optionGrid}>
        {ADDRESS_DOC_OPTIONS.map((opt) => (
          <div
            key={opt.value}
            style={s.option(docType === opt.value)}
            onClick={() => {
              setDocType(opt.value);
              setDocUrl(null);
              setOCRAddress(null);
            }}
          >
            <span style={s.optIcon}>{opt.icon}</span>
            <div>
              <div style={s.optLabel(docType === opt.value)}>{opt.label}</div>
              <div style={s.optNote}>{opt.note}</div>
            </div>
            {docType === opt.value && (
              <span
                style={{ marginLeft: "auto", color: "#49c635", fontSize: 18 }}
              >
                ✓
              </span>
            )}
          </div>
        ))}
      </div>

      {docType && (
        <>
          <div
            style={s.uploadArea(!!docUrl)}
            onClick={() => fileRef.current?.click()}
          >
            {docUrl ? (
              <>
                <div style={{ fontSize: 36 }}>📄</div>
                <div style={s.uploadText}>Document uploaded ✓</div>
                <div style={s.uploadSub}>Tap to replace</div>
              </>
            ) : (
              <>
                <div style={s.uploadIcon}>📤</div>
                <div style={s.uploadText}>Tap to upload {selected?.label}</div>
                <div style={s.uploadSub}>JPG, PNG, or PDF — max 10MB</div>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf"
            style={{ display: "none" }}
            onChange={handleFile}
          />

          {processing && !ocrAddress && (
            <p style={{ fontSize: 13, color: "#4a5568", marginBottom: 14 }}>
              🔍 Extracting address from document…
            </p>
          )}
          {ocrAddress && (
            <div style={s.ocrCard}>
              <strong>✨ Address found:</strong> {ocrAddress}
            </div>
          )}

          {docUrl && (
            <button style={s.btn} onClick={handleSubmit} disabled={processing}>
              {processing ? "Processing…" : "Confirm Proof of Address →"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default { NextOfKinCapture, ProofOfAddress };
