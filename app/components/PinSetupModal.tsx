"use client";

import { useState } from "react";
import { XIcon, CheckCircleIcon, LockIcon } from "@phosphor-icons/react";
import { soraClass } from "../fonts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/lib/authClient";
import RateLimitError from "./RateLimitError";

export default function PinSetupModal({
  isShown,
  onClose,
  onSuccess,
}: {
  isShown: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [step, setStep] = useState<"set" | "confirm" | "done">("set");
  const [error, setError] = useState("");
  const [rateLimited, setRateLimited] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync: savePin, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await getSession();
      if (!data?.user) throw new Error("Not authenticated");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/pin/set`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            userId: data.user.id,
            pin: pin.join(""),
          }),
        },
      );
      if (!res.ok) {
        if (res.status === 429) throw new Error("RATE_LIMITED");
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to set PIN");
      }
      return res.json();
    },
    onSuccess: () => {
      setStep("done");
      queryClient.invalidateQueries({ queryKey: ["pinStatus"] });
    },
    onError: (e: Error) => {
      if (e.message === "RATE_LIMITED") {
        setRateLimited(true);
      } else {
        setError(e.message);
      }
    },
  });

  const handleDigitInput = (
    value: string,
    index: number,
    target: "set" | "confirm",
  ) => {
    const update = target === "set" ? [...pin] : [...confirmPin];
    if (value === "" || /^\d$/.test(value)) {
      update[index] = value;
      if (target === "set") setPin(update);
      else setConfirmPin(update);
      setError("");
      if (value && index < 3) {
        const nextInput = document.getElementById(
          `${target}-pin-${index + 1}`,
        );
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    target: "set" | "confirm",
  ) => {
    const update = target === "set" ? [...pin] : [...confirmPin];
    if (e.key === "Backspace" && !update[index] && index > 0) {
      const prevInput = document.getElementById(`${target}-pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleContinue = () => {
    const pinStr = pin.join("");
    if (pinStr.length !== 4) {
      setError("Please enter a 4-digit PIN");
      return;
    }
    setStep("confirm");
    setError("");
  };

  const handleConfirm = () => {
    const confirmStr = confirmPin.join("");
    if (confirmStr !== pin.join("")) {
      setError("PINs do not match. Try again.");
      setConfirmPin(["", "", "", ""]);
      return;
    }
    savePin();
  };

  const handleReset = () => {
    setPin(["", "", "", ""]);
    setConfirmPin(["", "", "", ""]);
    setStep("set");
    setError("");
    setRateLimited(false);
    onClose();
  };

  if (!isShown) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-forest/50 p-3">
      <div className="bg-white dark:bg-surface rounded-[20px] transition-colors max-w-100 w-full p-6 shadow-modal relative">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 text-ink hover:text-red transition-colors"
        >
          <XIcon className="w-6 h-6" weight="bold" />
        </button>

        {rateLimited ? (
          <RateLimitError onDismiss={handleReset} />
        ) : step === "done" ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-8 h-8 fill-green" weight="bold" />
            </div>
            <h3 className={`${soraClass} text-xl font-bold text-forest-text mb-2`}>
              PIN Set Successfully
            </h3>
            <p className="text-sm text-ink-mid mb-6">
              Your transaction PIN has been created. You'll need it for wallet
              transfers, cluster funding, and plan contributions.
            </p>
            <button
              onClick={() => {
                handleReset();
                onSuccess?.();
              }}
              className="w-full py-3 rounded-full bg-green text-white font-bold hover:bg-greener transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6 mt-2">
              <div className="w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-3">
                <LockIcon className="w-7 h-7 fill-teal" weight="fill" />
              </div>
              <h3 className={`${soraClass} text-xl font-bold text-forest-text mb-1`}>
                {step === "set" ? "Set Transaction PIN" : "Confirm Your PIN"}
              </h3>
              <p className="text-sm text-ink-mid">
                {step === "set"
                  ? "Create a 4-digit PIN to secure your transactions."
                  : "Re-enter your PIN to confirm."}
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {(step === "set" ? pin : confirmPin).map((digit, i) => (
                <input
                  key={i}
                  id={`${step}-pin-${i}`}
                  type="tel"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitInput(e.target.value, i, step)}
                  onKeyDown={(e) => handleKeyDown(e, i, step)}
                  onFocus={(e) => e.target.select()}
                  className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-card-border focus:border-teal focus:ring-2 focus:ring-teal/30 outline-none transition-all"
                  inputMode="numeric"
                  autoComplete="off"
                />
              ))}
            </div>

            {error && (
              <p className="text-sm text-red bg-red/5 rounded-xl px-3 py-2 mb-4 text-center">
                {error}
              </p>
            )}

            {step === "set" ? (
              <button
                onClick={handleContinue}
                disabled={pin.join("").length !== 4}
                className="w-full py-3 rounded-full bg-teal text-white font-bold hover:bg-teal/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={confirmPin.join("").length !== 4 || isPending}
                className="w-full py-3 rounded-full bg-teal text-white font-bold hover:bg-teal/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Saving...
                  </span>
                ) : (
                  "Confirm PIN"
                )}
              </button>
            )}

            {step === "confirm" && (
              <button
                onClick={() => {
                  setStep("set");
                  setConfirmPin(["", "", "", ""]);
                  setError("");
                }}
                className="w-full mt-2 py-2 text-sm text-ink-mid font-medium hover:text-ink transition-colors"
              >
                Go back
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
