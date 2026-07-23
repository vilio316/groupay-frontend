// ============================================================
// GovernmentIDUpload.tsx
// Tier 2 — Government-issued ID document capture & upload
// ============================================================
import React, { useState, useRef } from "react";
import { IDType } from "./tokens";

interface IDUploadResult {
  idType: IDType;
  idNumber: string;
  idExpiry: string;
  frontUrl: string;
  backUrl?: string;
}

interface GovernmentIDUploadProps {
  onComplete: (result: IDUploadResult) => void;
}

const ID_OPTIONS: {
  value: IDType;
  label: string;
  icon: string;
  hasBack: boolean;
  apiNote: string;
}[] = [
  {
    value: "nin_card",
    label: "National ID Card / NIN Slip",
    icon: "🪪",
    hasBack: true,
    apiNote: "NIMC API",
  },
  {
    value: "passport",
    label: "International Passport",
    icon: "📕",
    hasBack: false,
    apiNote: "NIS API",
  },
  {
    value: "drivers_licence",
    label: "Driver's Licence",
    icon: "🚗",
    hasBack: true,
    apiNote: "FRSC API",
  },
  {
    value: "voters_card",
    label: "Voter's Card (PVC)",
    icon: "🗳️",
    hasBack: false,
    apiNote: "INEC API",
  },
];

export const GovernmentIDUpload: React.FC<GovernmentIDUploadProps> = ({
  onComplete,
}) => {
  const [selectedType, setSelectedType] = useState<IDType | null>(null);
  const [frontImg, setFrontImg] = useState<string | null>(null);
  const [backImg, setBackImg] = useState<string | null>(null);
  const [idNumber, setIDNumber] = useState("");
  const [idExpiry, setIDExpiry] = useState("");
  const [processing, setProcessing] = useState(false);
  const [ocrResult, setOCRResult] = useState<{
    name?: string;
    number?: string;
    expiry?: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);

  const selectedOption = ID_OPTIONS.find((o) => o.value === selectedType);

  const readFile = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

  const handleFront = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await readFile(file);
    setFrontImg(url);
    runOCR(url);
  };

  const handleBack = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackImg(await readFile(file));
  };

  const runOCR = async (imageUrl: string) => {
    setProcessing(true);
    setOCRResult(null);
    // Simulated OCR — replace with AWS Textract / Smile ID
    await new Promise((r) => setTimeout(r, 2000));
    const mockOCR = {
      name: "AMARA CHIDINMA OKAFOR",
      number:
        selectedType === "passport"
          ? "A12345678"
          : selectedType === "drivers_licence"
            ? "GEO/AG/123456/2020"
            : "12345678901",
      expiry: "2029-05-15",
    };
    setOCRResult(mockOCR);
    setIDNumber(mockOCR.number);
    setIDExpiry(mockOCR.expiry);
    setProcessing(false);
  };

  const handleSubmit = async () => {
    if (!selectedType || !frontImg || !idNumber) {
      setError("Please upload the front of your ID and confirm the details.");
      return;
    }
    if (selectedOption?.hasBack && !backImg) {
      setError("Please also upload the back of your ID.");
      return;
    }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setDone(true);
    setProcessing(false);
    onComplete({
      idType: selectedType,
      idNumber,
      idExpiry,
      frontUrl: frontImg,
      backUrl: backImg || undefined,
    });
  };

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
    typeGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      marginBottom: 24,
    },
    typeCard: (active: boolean) => ({
      padding: "14px 12px",
      borderRadius: 12,
      cursor: "pointer",
      border: `2px solid ${active ? "#49c635" : "rgba(139,215,210,0.4)"}`,
      background: active ? "rgba(73,198,53,0.07)" : "#fffbfa",
      transition: "all 0.15s",
    }),
    typeIcon: { fontSize: 22, marginBottom: 6 },
    typeLabel: (active: boolean) => ({
      fontSize: 13,
      fontWeight: active ? 700 : 500,
      color: active ? "#0d2b1f" : "#4a5568",
      lineHeight: 1.4,
    }),
    apiNote: { fontSize: 11, color: "#8bd7d2", marginTop: 3, fontWeight: 600 },
    uploadRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginBottom: 16,
    },
    uploadBox: (hasImg: boolean) => ({
      aspectRatio: "16/10",
      borderRadius: 12,
      cursor: "pointer",
      border: `2px dashed ${hasImg ? "#49c635" : "rgba(139,215,210,0.5)"}`,
      background: hasImg ? "rgba(73,198,53,0.05)" : "rgba(139,215,210,0.05)",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      overflow: "hidden",
      position: "relative" as const,
      transition: "all 0.15s",
    }),
    uploadImg: { width: "100%", height: "100%", objectFit: "cover" as const },
    uploadLabel: {
      fontSize: 12,
      fontWeight: 600,
      color: "#4a5568",
      textAlign: "center" as const,
      padding: "0 8px",
    },
    uploadIcon: { fontSize: 28 },
    ocrCard: {
      background: "rgba(84,222,253,0.08)",
      border: "1px solid rgba(84,222,253,0.25)",
      borderRadius: 12,
      padding: "14px 16px",
      marginBottom: 16,
    },
    ocrTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: "#006e8a",
      marginBottom: 10,
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    ocrRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    ocrLabel: { fontSize: 13, color: "#4a5568" },
    ocrVal: { fontSize: 13, fontWeight: 600, color: "#0d2b1f" },
    fieldRow: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: 12,
      marginBottom: 16,
    },
    label: {
      display: "block",
      fontSize: 12,
      fontWeight: 600,
      color: "#0d2b1f",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      marginBottom: 6,
    },
    input: {
      width: "100%",
      height: 44,
      padding: "0 12px",
      boxSizing: "border-box" as const,
      border: "1.5px solid rgba(139,215,210,0.5)",
      borderRadius: 10,
      background: "#fffbfa",
      fontFamily: "Inter, sans-serif",
      fontSize: 14,
      color: "#0d2b1f",
      outline: "none",
    },
    error: { fontSize: 13, color: "#e5373a", marginBottom: 14 },
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

  if (done) {
    return (
      <div style={s.container}>
        <div style={s.success}>
          <span>✅</span>
          {selectedOption?.label} verified — ID ending {idNumber.slice(-4)}
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <h2 style={s.heading}>Government-Issued ID</h2>
      <p style={s.sub}>
        Upload a valid government-issued photo ID. The details will be verified
        against the issuing authority's database.
      </p>

      {!selectedType && (
        <div style={s.typeGrid}>
          {ID_OPTIONS.map((opt) => (
            <div
              key={opt.value}
              style={s.typeCard(false)}
              onClick={() => {
                setSelectedType(opt.value);
                setFrontImg(null);
                setBackImg(null);
                setOCRResult(null);
              }}
            >
              <div style={s.typeIcon}>{opt.icon}</div>
              <div style={s.typeLabel(false)}>{opt.label}</div>
              <div style={s.apiNote}>via {opt.apiNote}</div>
            </div>
          ))}
        </div>
      )}

      {selectedType && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 18 }}>{selectedOption?.icon}</span>
            <span style={{ fontWeight: 700, color: "#0d2b1f", fontSize: 15 }}>
              {selectedOption?.label}
            </span>
            <button
              onClick={() => {
                setSelectedType(null);
                setFrontImg(null);
                setBackImg(null);
                setOCRResult(null);
              }}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                color: "#00bd9d",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
              }}
            >
              Change
            </button>
          </div>

          <div style={s.uploadRow}>
            <div>
              <label style={s.label}>Front of ID</label>
              <div
                style={s.uploadBox(!!frontImg)}
                onClick={() => frontRef.current?.click()}
              >
                {frontImg ? (
                  <img src={frontImg} alt="ID front" style={s.uploadImg} />
                ) : (
                  <>
                    <div style={s.uploadIcon}>📷</div>
                    <div style={s.uploadLabel}>Tap to photograph or upload</div>
                  </>
                )}
              </div>
              <input
                ref={frontRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={handleFront}
              />
            </div>
            {selectedOption?.hasBack && (
              <div>
                <label style={s.label}>Back of ID</label>
                <div
                  style={s.uploadBox(!!backImg)}
                  onClick={() => backRef.current?.click()}
                >
                  {backImg ? (
                    <img src={backImg} alt="ID back" style={s.uploadImg} />
                  ) : (
                    <>
                      <div style={s.uploadIcon}>📷</div>
                      <div style={s.uploadLabel}>Back side</div>
                    </>
                  )}
                </div>
                <input
                  ref={backRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={handleBack}
                />
              </div>
            )}
          </div>

          {processing && !ocrResult && (
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 16,
                fontSize: 13,
                color: "#4a5568",
              }}
            >
              <span>🔍 Reading document details…</span>
            </div>
          )}

          {ocrResult && (
            <div style={s.ocrCard}>
              <div style={s.ocrTitle}>
                <span>✨</span> Details auto-extracted — please review
              </div>
              <div style={s.ocrRow}>
                <span style={s.ocrLabel}>Name on document</span>
                <span style={s.ocrVal}>{ocrResult.name}</span>
              </div>
              <div style={s.ocrRow}>
                <span style={s.ocrLabel}>ID number</span>
                <span style={s.ocrVal}>{ocrResult.number}</span>
              </div>
              <div style={s.ocrRow}>
                <span style={s.ocrLabel}>Expiry</span>
                <span style={s.ocrVal}>{ocrResult.expiry}</span>
              </div>
            </div>
          )}

          {frontImg && (
            <div style={s.fieldRow}>
              <div>
                <label style={s.label}>ID Number</label>
                <input
                  style={s.input}
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIDNumber(e.target.value)}
                  placeholder="Confirm number"
                />
              </div>
              <div>
                <label style={s.label}>Expiry Date</label>
                <input
                  style={s.input}
                  type="date"
                  value={idExpiry}
                  onChange={(e) => setIDExpiry(e.target.value)}
                />
              </div>
            </div>
          )}

          {error && <p style={s.error}>⚠ {error}</p>}
          {frontImg && (
            <button style={s.btn} onClick={handleSubmit} disabled={processing}>
              {processing
                ? "Verifying with issuing authority…"
                : "Submit ID for Verification →"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default GovernmentIDUpload;
