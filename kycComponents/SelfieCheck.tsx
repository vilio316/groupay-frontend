// ============================================================
// LivenessCheck.tsx
// Facial liveness detection + selfie capture component
// Integrates with Smile ID SmartSelfie™ or iProov SDK
// ============================================================
import React, { useState, useRef, useEffect } from "react";

type LivenessStage =
  | "intro"
  | "instructions"
  | "capturing"
  | "processing"
  | "success"
  | "failed";

interface LivenessCheckProps {
  tier?: 1 | 3; // Tier 3 requires enhanced (3D) liveness
  onComplete: (score: number, imageDataUrl: string) => void;
  onFailed: (reason: string) => void;
}

// Challenge instructions for Tier 3
const TIER3_CHALLENGES = [
  { label: "Turn head slightly left", icon: "←" },
  { label: "Turn head slightly right", icon: "→" },
  { label: "Blink slowly", icon: "👁" },
  { label: "Smile naturally", icon: "😊" },
];

export const LivenessCheck: React.FC<LivenessCheckProps> = ({
  tier = 1,
  onComplete,
  onFailed,
}) => {
  const [stage, setStage] = useState<LivenessStage>("intro");
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const ms = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 480, height: 480 },
      });
      setStream(ms);
      setStage("capturing");
      if (videoRef.current) {
        videoRef.current.srcObject = ms;
        videoRef.current.play();
      }
      if (tier === 1) {
        simulateCaptureCountdown(ms);
      } else {
        runTier3Challenges(ms);
      }
    } catch {
      setStage("failed");
      onFailed(
        "Camera access denied. Please allow camera access and try again.",
      );
    }
  };

  const simulateCaptureCountdown = (ms: MediaStream) => {
    let c = 3;
    setCountdown(3);
    timerRef.current = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(timerRef.current!);
        captureAndProcess(ms);
      }
    }, 1000);
  };

  const runTier3Challenges = (ms: MediaStream) => {
    let idx = 0;
    const advance = () => {
      if (idx >= TIER3_CHALLENGES.length) {
        captureAndProcess(ms);
        return;
      }
      setChallengeIdx(idx);
      idx++;
      setTimeout(advance, 2500);
    };
    advance();
  };

  const captureAndProcess = (ms: MediaStream) => {
    setStage("processing");
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0);
    }
    ms.getTracks().forEach((t) => t.stop());

    // Simulate API liveness scoring (replace with Smile ID / iProov SDK call)
    setTimeout(() => {
      const mockScore = 85 + Math.floor(Math.random() * 14);
      setScore(mockScore);
      const imageUrl = canvas?.toDataURL("image/jpeg") || "";
      if (mockScore >= 80) {
        setStage("success");
        onComplete(mockScore, imageUrl);
      } else {
        setStage("failed");
        onFailed("Liveness check failed. Please try again in good lighting.");
      }
    }, 2800);
  };

  const s: Record<string, React.CSSProperties> = {
    container: { fontFamily: "Inter, sans-serif", maxWidth: 420 },
    heading: {
      fontFamily: "Sora, sans-serif",
      fontSize: 20,
      fontWeight: 700,
      color: "#0d2b1f",
      marginBottom: 6,
    },
    sub: { fontSize: 14, color: "#4a5568", marginBottom: 24, lineHeight: 1.6 },
    cameraBox: {
      width: "100%",
      aspectRatio: "1/1",
      maxWidth: 340,
      background: "#0d2b1f",
      borderRadius: 20,
      position: "relative" as const,
      overflow: "hidden",
      margin: "0 auto 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    video: {
      width: "100%",
      height: "100%",
      objectFit: "cover" as const,
      transform: "scaleX(-1)",
    },
    overlay: {
      position: "absolute" as const,
      inset: 0,
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none" as const,
    },
    ovalGuide: {
      width: "65%",
      aspectRatio: "3/4",
      border: "3px solid rgba(73,198,53,0.7)",
      borderRadius: "50%",
      boxShadow: "0 0 0 999px rgba(13,43,31,0.35)",
    },
    countdownBadge: {
      position: "absolute" as const,
      bottom: 20,
      background: "rgba(73,198,53,0.85)",
      color: "#fffbfa",
      borderRadius: 9999,
      padding: "6px 16px",
      fontWeight: 700,
      fontSize: 20,
    },
    challengeBadge: {
      position: "absolute" as const,
      bottom: 20,
      background: "rgba(0,0,0,0.6)",
      color: "#fffbfa",
      borderRadius: 9999,
      padding: "8px 18px",
      fontWeight: 600,
      fontSize: 14,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    processingOverlay: {
      position: "absolute" as const,
      inset: 0,
      background: "rgba(13,43,31,0.75)",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      color: "#fffbfa",
    },
    processingText: { fontSize: 14, fontWeight: 600 },
    introIcon: {
      fontSize: 64,
      textAlign: "center" as const,
      margin: "0 0 16px",
    },
    tipList: {
      background: "rgba(84,222,253,0.08)",
      border: "1px solid rgba(84,222,253,0.25)",
      borderRadius: 12,
      padding: "14px 16px",
      marginBottom: 24,
    },
    tip: {
      fontSize: 13,
      color: "#4a5568",
      marginBottom: 6,
      display: "flex",
      gap: 8,
    },
    startBtn: {
      width: "100%",
      height: 52,
      borderRadius: 9999,
      border: "none",
      background: "#49c635",
      color: "#fffbfa",
      fontWeight: 700,
      fontSize: 16,
      cursor: "pointer",
      fontFamily: "Inter, sans-serif",
    },
    successCard: {
      background: "rgba(73,198,53,0.08)",
      border: "1px solid rgba(73,198,53,0.3)",
      borderRadius: 16,
      padding: 24,
      textAlign: "center" as const,
    },
    successIcon: { fontSize: 48, marginBottom: 12 },
    successTitle: {
      fontFamily: "Sora, sans-serif",
      fontSize: 18,
      fontWeight: 700,
      color: "#0d2b1f",
      marginBottom: 6,
    },
    successSub: { fontSize: 14, color: "#4a5568" },
    scoreBadge: {
      display: "inline-block",
      background: "#49c635",
      color: "#fffbfa",
      borderRadius: 9999,
      padding: "4px 14px",
      fontSize: 13,
      fontWeight: 700,
      margin: "12px 0 0",
    },
    failCard: {
      background: "rgba(229,55,58,0.06)",
      border: "1px solid rgba(229,55,58,0.25)",
      borderRadius: 16,
      padding: 24,
      textAlign: "center" as const,
    },
    retryBtn: {
      marginTop: 16,
      width: "100%",
      height: 48,
      borderRadius: 9999,
      border: "none",
      background: "#e5373a",
      color: "#fffbfa",
      fontWeight: 700,
      fontSize: 15,
      cursor: "pointer",
      fontFamily: "Inter, sans-serif",
    },
    canvas: { display: "none" },
    tierBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: tier === 3 ? "rgba(84,222,253,0.15)" : "rgba(73,198,53,0.12)",
      color: tier === 3 ? "#006e8a" : "#1a6b0e",
      border: `1px solid ${tier === 3 ? "rgba(84,222,253,0.35)" : "rgba(73,198,53,0.3)"}`,
      borderRadius: 9999,
      padding: "4px 12px",
      fontSize: 12,
      fontWeight: 600,
      marginBottom: 16,
    },
  };

  if (stage === "intro" || stage === "instructions") {
    return (
      <div style={s.container}>
        <div style={s.tierBadge}>
          {tier === 3
            ? "🔬 Enhanced Liveness (Tier 3)"
            : "📷 Selfie Verification"}
        </div>
        <h2 style={s.heading}>Liveness Check</h2>
        <p style={s.sub}>
          {tier === 3
            ? "We'll guide you through a short challenge to confirm you're physically present. This protects your account against deepfake and spoofing attacks."
            : "We'll take a quick selfie to match your face against your BVN/NIN record."}
        </p>
        <div style={s.introIcon}>📸</div>
        <div style={s.tipList}>
          {[
            ["☀️", "Ensure your face is well-lit — no harsh shadows"],
            ["👓", "Remove glasses or hats if possible"],
            ["📱", "Hold your device at eye level"],
            tier === 3
              ? ["👀", "Follow the on-screen prompts carefully"]
              : ["🙂", "Look directly at the camera and keep still"],
          ].map(([icon, text], i) => (
            <div key={i} style={s.tip}>
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <button style={s.startBtn} onClick={startCamera}>
          Open Camera →
        </button>
      </div>
    );
  }

  if (stage === "success") {
    return (
      <div style={s.container}>
        <div style={s.successCard}>
          <div style={s.successIcon}>✅</div>
          <div style={s.successTitle}>Liveness Verified!</div>
          <p style={s.successSub}>
            Your selfie has been matched against your identity record.
          </p>
          <div style={s.scoreBadge}>Match confidence: {score}%</div>
        </div>
        <canvas ref={canvasRef} style={s.canvas} />
      </div>
    );
  }

  if (stage === "failed") {
    return (
      <div style={s.container}>
        <div style={s.failCard}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>❌</div>
          <div
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#0d2b1f",
              marginBottom: 6,
            }}
          >
            Verification Failed
          </div>
          <p style={{ fontSize: 14, color: "#4a5568" }}>
            Please ensure your face is clearly visible and try again.
          </p>
          <button
            style={s.retryBtn}
            onClick={() => {
              setStage("intro");
              setScore(0);
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <h2 style={s.heading}>
        {stage === "processing" ? "Analysing..." : "Look at the camera"}
      </h2>
      <div style={s.cameraBox}>
        <video ref={videoRef} style={s.video} autoPlay playsInline muted />
        <canvas ref={canvasRef} style={s.canvas} />
        {stage !== "processing" && (
          <div style={s.overlay}>
            <div style={s.ovalGuide} />
            {stage === "capturing" && tier === 1 && countdown > 0 && (
              <div style={s.countdownBadge}>{countdown}</div>
            )}
            {stage === "capturing" && tier === 3 && (
              <div style={s.challengeBadge}>
                <span>{TIER3_CHALLENGES[challengeIdx]?.icon}</span>
                <span>{TIER3_CHALLENGES[challengeIdx]?.label}</span>
              </div>
            )}
          </div>
        )}
        {stage === "processing" && (
          <div style={s.processingOverlay}>
            <ProcessingSpinner />
            <p style={s.processingText}>Checking liveness & matching face…</p>
          </div>
        )}
      </div>
      {stage === "capturing" && (
        <p style={{ textAlign: "center", fontSize: 13, color: "#4a5568" }}>
          {tier === 1
            ? `Keep still — capturing in ${countdown}…`
            : `Follow the prompts: ${TIER3_CHALLENGES[challengeIdx]?.label}`}
        </p>
      )}
    </div>
  );
};

const ProcessingSpinner = () => (
  <div style={{ position: "relative", width: 56, height: 56 }}>
    <style>{`@keyframes lspin{to{transform:rotate(360deg)}}`}</style>
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        border: "4px solid rgba(73,198,53,0.2)",
        borderTopColor: "#49c635",
        animation: "lspin 0.9s linear infinite",
      }}
    />
    <span
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
      }}
    >
      🔍
    </span>
  </div>
);

export default LivenessCheck;
