// ============================================================
// PhoneOTPVerification.tsx
// OTP verification for BVN/NIN-registered phone number
// ============================================================
import React, { useState, useRef, useEffect } from "react";

interface PhoneOTPVerificationProps {
  phone: string; // masked phone from BVN/NIN lookup
  onVerified: () => void;
  onResend?: () => void;
}

const OTP_LENGTH = 6;
const EXPIRY_SECONDS = 600; // 10 minutes

export const PhoneOTPVerification: React.FC<PhoneOTPVerificationProps> = ({
  phone,
  onVerified,
  onResend,
}) => {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXPIRY_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const tick = setInterval(
      () => setTimeLeft((t) => Math.max(0, t - 1)),
      1000,
    );
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    setError("");
    if (digit && idx < OTP_LENGTH - 1) inputRefs.current[idx + 1]?.focus();
    if (next.every((d) => d !== "") && digit) verify(next.join(""));
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (pasted.length === OTP_LENGTH) {
      const next = pasted.split("");
      setDigits(next);
      inputRefs.current[OTP_LENGTH - 1]?.focus();
      verify(pasted);
    }
    e.preventDefault();
  };

  const verify = async (code: string) => {
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1500));
    // Simulated: accept "123456" as correct
    if (code === "123456") {
      setSuccess(true);
      setLoading(false);
      setTimeout(onVerified, 800);
    } else {
      setError("Incorrect code. Please check and try again.");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setDigits(Array(OTP_LENGTH).fill(""));
    setError("");
    setTimeLeft(EXPIRY_SECONDS);
    setResendCooldown(60);
    onResend?.();
  };

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const s = {
    container: { fontFamily: "Inter, sans-serif", maxWidth: 420 },
    heading: {
      fontFamily: "Sora, sans-serif",
      fontSize: 20,
      fontWeight: 700,
      color: "#0d2b1f",
      marginBottom: 6,
    },
    sub: { fontSize: 14, color: "#4a5568", marginBottom: 4, lineHeight: 1.6 },
    phone: {
      fontSize: 14,
      fontWeight: 700,
      color: "#0d2b1f",
      marginBottom: 28,
    },
    otpRow: {
      display: "flex",
      gap: 10,
      justifyContent: "center",
      marginBottom: 16,
    },
    digit: (filled: boolean, hasError: boolean, isSuccess: boolean) => ({
      width: 52,
      height: 60,
      borderRadius: 12,
      textAlign: "center" as const,
      fontSize: 22,
      fontWeight: 700,
      fontFamily: "Sora, sans-serif",
      border: `2px solid ${hasError ? "#e5373a" : isSuccess ? "#49c635" : filled ? "#49c635" : "rgba(139,215,210,0.5)"}`,
      background: isSuccess ? "rgba(73,198,53,0.08)" : "#fffbfa",
      color: "#0d2b1f",
      outline: "none",
      transition: "border-color 0.15s",
    }),
    error: {
      fontSize: 13,
      color: "#e5373a",
      textAlign: "center" as const,
      marginBottom: 16,
    },
    timer: {
      fontSize: 13,
      color: "#4a5568",
      textAlign: "center" as const,
      marginBottom: 8,
    },
    resendRow: { textAlign: "center" as const },
    resendBtn: (canResend: boolean) => ({
      background: "none",
      border: "none",
      cursor: canResend ? "pointer" : "not-allowed",
      fontSize: 14,
      fontWeight: 600,
      color: canResend ? "#00bd9d" : "#8bd7d2",
      fontFamily: "Inter, sans-serif",
    }),
    successState: {
      textAlign: "center" as const,
      padding: "24px 0",
    },
    loadingOverlay: {
      display: "flex",
      justifyContent: "center",
      gap: 8,
      marginTop: 8,
    },
    dot: (i: number) => ({
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "#49c635",
      animation: `otpbounce 0.8s ${i * 0.15}s ease-in-out infinite`,
    }),
  };

  if (success) {
    return (
      <div style={{ ...s.container, ...s.successState }}>
        <style>{`@keyframes popin{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        <div style={{ fontSize: 56, animation: "popin 0.4s ease-out" }}>✅</div>
        <h2 style={{ ...s.heading, textAlign: "center", marginTop: 12 }}>
          Phone Verified!
        </h2>
        <p style={{ ...s.sub, textAlign: "center" }}>
          Your phone number has been confirmed.
        </p>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <style>{`@keyframes otpbounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
      <h2 style={s.heading}>Verify Your Phone</h2>
      <p style={s.sub}>We sent a 6-digit code to</p>
      <p style={s.phone}>
        {phone}{" "}
        <span style={{ fontSize: 12, color: "#4a5568", fontWeight: 400 }}>
          (your BVN/NIN-registered number)
        </span>
      </p>

      <div style={s.otpRow} onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            style={s.digit(!!d, !!error, success)}
            type="tel"
            maxLength={1}
            value={loading ? "•" : d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={loading || success}
            inputMode="numeric"
          />
        ))}
      </div>

      {loading && (
        <div style={s.loadingOverlay}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={s.dot(i)} />
          ))}
        </div>
      )}

      {error && <p style={s.error}>⚠ {error}</p>}

      {timeLeft > 0 ? (
        <p style={s.timer}>
          Code expires in <strong>{fmt(timeLeft)}</strong>
        </p>
      ) : (
        <p style={{ ...s.timer, color: "#e5373a" }}>
          Code expired. Please request a new one.
        </p>
      )}

      <div style={s.resendRow}>
        <button
          style={s.resendBtn(resendCooldown === 0)}
          onClick={handleResend}
          disabled={resendCooldown > 0}
        >
          {resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : "Resend code via SMS"}
        </button>
      </div>

      <p
        style={{
          fontSize: 12,
          color: "#4a5568",
          marginTop: 20,
          textAlign: "center",
        }}
      >
        OTP is delivered to your BVN/NIN-registered phone for security purposes.
        <br />
        For testing, use <strong>123456</strong>.
      </p>
    </div>
  );
};

export default PhoneOTPVerification;
