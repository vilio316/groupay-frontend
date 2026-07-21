"use client";

import { useState } from "react";
import { XIcon, LockIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { soraClass } from "../fonts";
import { useMutation } from "@tanstack/react-query";
import { getSession } from "@/lib/authClient";

export default function PinVerifyModal({
  isShown,
  onClose,
  onSuccess,
  title = "Verify PIN",
  description = "Enter your 4-digit PIN to authorise this transaction.",
}: {
  isShown: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
  title?: string;
  description?: string;
}) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");

  const { mutateAsync: verify, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await getSession();
      if (!data?.user) throw new Error("Not authenticated");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/pin/verify`,
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
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "PIN verification failed");
      }
      return res.json();
    },
    onSuccess: () => {
      const enteredPin = pin.join("");
      setPin(["", "", "", ""]);
      onSuccess(enteredPin);
    },
    onError: (e: Error) => {
      setError(e.message || "PIN verification failed");
    },
  });

  const handleDigitInput = (value: string, index: number) => {
    if (value === "" || /^\d$/.test(value)) {
      const update = [...pin];
      update[index] = value;
      setPin(update);
      setError("");
      if (value && index < 3) {
        const nextInput = document.getElementById(`verify-pin-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`verify-pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    const pinStr = pin.join("");
    if (pinStr.length !== 4) {
      setError("Please enter your 4-digit PIN");
      return;
    }
    verify();
  };

  const handleReset = () => {
    setPin(["", "", "", ""]);
    setError("");
    onClose();
  };

  if (!isShown) return null;

  const pinComplete = pin.join("").length === 4;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-forest/50 p-3">
      <div className="bg-white rounded-[20px] max-w-100 w-full p-6 shadow-modal relative">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 text-ink hover:text-red transition-colors"
        >
          <XIcon className="w-6 h-6" weight="bold" />
        </button>

        <div className="text-center mb-6 mt-2">
          <div className="w-14 h-14 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-3">
            <LockIcon className="w-7 h-7 fill-amber" weight="fill" />
          </div>
          <h3 className={`${soraClass} text-xl font-bold text-forest mb-1`}>
            {title}
          </h3>
          <p className="text-sm text-ink-mid">{description}</p>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {pin.map((digit, i) => (
            <input
              key={i}
              id={`verify-pin-${i}`}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitInput(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onFocus={(e) => e.target.select()}
              className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-card-border focus:border-teal focus:ring-2 focus:ring-teal/30 outline-none transition-all"
              inputMode="numeric"
              autoComplete="off"
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-red bg-red/5 rounded-xl px-3 py-2 mb-4 text-center flex items-center justify-center gap-1.5">
            <WarningCircleIcon className="w-4 h-4" weight="fill" />
            {error}
          </p>
        )}

        <button
          onClick={handleVerify}
          disabled={!pinComplete || isPending}
          className="w-full py-3 rounded-full bg-green text-white font-bold hover:bg-greener transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Verifying...
            </span>
          ) : (
            "Authorise"
          )}
        </button>

        <button
          onClick={handleReset}
          className="w-full mt-2 py-2 text-sm text-ink-mid font-medium hover:text-ink transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
