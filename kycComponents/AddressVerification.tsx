// ============================================================
// AddressCapture.tsx
// Residential address capture with Nigerian LGA/State data
// ============================================================
"use client";
import React, { useState } from "react";

interface AddressData {
  street: string;
  lga: string;
  state: string;
}

interface AddressCaptureProps {
  prefilled?: Partial<AddressData>;
  onComplete?: (address: AddressData) => void;
}

const NIGERIA_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const LGAS_BY_STATE: Record<string, string[]> = {
  "FCT - Abuja": [
    "Abaji",
    "Bwari",
    "Gwagwalada",
    "Kuje",
    "Kwali",
    "Municipal Area Council",
  ],
  Lagos: [
    "Agege",
    "Ajeromi-Ifelodun",
    "Alimosho",
    "Amuwo-Odofin",
    "Apapa",
    "Badagry",
    "Epe",
    "Eti-Osa",
    "Ibeju-Lekki",
    "Ifako-Ijaiye",
    "Ikeja",
    "Ikorodu",
    "Kosofe",
    "Lagos Island",
    "Lagos Mainland",
    "Mushin",
    "Ojo",
    "Oshodi-Isolo",
    "Shomolu",
    "Surulere",
  ],
  Rivers: [
    "Port Harcourt",
    "Obio-Akpor",
    "Okrika",
    "Eleme",
    "Bonny",
    "Degema",
    "Ahoada East",
    "Ahoada West",
    "Andoni",
    "Asari-Toru",
  ],
  Kano: [
    "Kano Municipal",
    "Fagge",
    "Dala",
    "Gwale",
    "Tarauni",
    "Nassarawa",
    "Kumbotso",
    "Ungogo",
    "Dawakin Tofa",
    "Tofa",
  ],
};

const getLGAs = (state: string): string[] =>
  LGAS_BY_STATE[state] || [
    "Central LGA",
    "North LGA",
    "South LGA",
    "East LGA",
    "West LGA",
  ];

export const AddressCapture: React.FC<AddressCaptureProps> = ({
  prefilled,
  onComplete,
}) => {
  const [form, setForm] = useState<AddressData>({
    street: prefilled?.street || "",
    lga: prefilled?.lga || "",
    state: prefilled?.state || "",
  });
  const [errors, setErrors] = useState<Partial<AddressData>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof AddressData, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
    if (k === "state") setForm((f) => ({ ...f, state: v, lga: "" }));
  };

  const validate = () => {
    const e: Partial<AddressData> = {};
    if (!form.street.trim()) e.street = "Please enter your street address";
    if (!form.state) e.state = "Please select your state";
    if (!form.lga) e.lga = "Please select your LGA";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitted(true);
    onComplete?.(form);
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
    field: { marginBottom: 18 },
    label: {
      display: "block",
      fontSize: 12,
      fontWeight: 600,
      color: "#0d2b1f",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      marginBottom: 6,
    },
    input: (hasErr: boolean) => ({
      width: "100%",
      height: 48,
      padding: "0 14px",
      boxSizing: "border-box" as const,
      border: `1.5px solid ${hasErr ? "#e5373a" : "rgba(139,215,210,0.5)"}`,
      borderRadius: 10,
      background: "#fffbfa",
      fontFamily: "Inter, sans-serif",
      fontSize: 15,
      color: "#0d2b1f",
      outline: "none",
    }),
    select: (hasErr: boolean) => ({
      width: "100%",
      height: 48,
      padding: "0 14px",
      boxSizing: "border-box" as const,
      border: `1.5px solid ${hasErr ? "#e5373a" : "rgba(139,215,210,0.5)"}`,
      borderRadius: 10,
      background: "#fffbfa",
      fontFamily: "Inter, sans-serif",
      fontSize: 15,
      color: form.state ? "#0d2b1f" : "#b0bec5",
      outline: "none",
      appearance: "none" as const,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234a5568' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 14px center",
    }),
    error: { fontSize: 12, color: "#e5373a", marginTop: 4 },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
    infoBox: {
      background: "rgba(84,222,253,0.08)",
      border: "1px solid rgba(84,222,253,0.25)",
      borderRadius: 10,
      padding: "12px 14px",
      marginBottom: 20,
      fontSize: 13,
      color: "#4a5568",
      display: "flex",
      gap: 8,
      alignItems: "flex-start",
    },
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
    successBadge: {
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

  if (submitted) {
    return (
      <div style={s.container}>
        <div style={s.successBadge}>
          <span>✅</span>
          Address saved — {form.street}, {form.lga}, {form.state}
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <h2 style={s.heading}>Residential Address</h2>
      <p style={s.sub}>
        Please provide your current residential address. This must be in Nigeria
        and will be cross-referenced with your BVN/NIN record.
      </p>

      <div style={s.infoBox}>
        <span>ℹ️</span>
        <span>
          Per CBN June 2024 directive, physical address verification is required
          for all account tiers.
        </span>
      </div>

      <div style={s.field}>
        <label style={s.label}>Street Address</label>
        <input
          style={s.input(!!errors.street)}
          type="text"
          placeholder="e.g. 14B Adeola Odeku Street"
          value={form.street}
          onChange={(e) => set("street", e.target.value)}
        />
        {errors.street && <p style={s.error}>⚠ {errors.street}</p>}
      </div>

      <div style={s.row}>
        <div style={s.field}>
          <label style={s.label}>State</label>
          <div style={{ position: "relative" }}>
            <select
              style={s.select(!!errors.state)}
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
            >
              <option value="">Select state</option>
              {NIGERIA_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
          {errors.state && <p style={s.error}>⚠ {errors.state}</p>}
        </div>

        <div style={s.field}>
          <label style={s.label}>LGA</label>
          <div style={{ position: "relative" }}>
            <select
              style={s.select(!!errors.lga)}
              value={form.lga}
              onChange={(e) => set("lga", e.target.value)}
              disabled={!form.state}
            >
              <option value="">Select LGA</option>
              {form.state &&
                getLGAs(form.state).map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
            </select>
          </div>
          {errors.lga && <p style={s.error}>⚠ {errors.lga}</p>}
        </div>
      </div>

      <button style={s.btn} onClick={handleSubmit}>
        Save Address →
      </button>
    </div>
  );
};

export default AddressCapture;
