"use client";

import { useState, useEffect } from "react";
import { soraClass } from "../../../fonts";
import { LockIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/lib/authClient";
import { usePinStatus } from "@/app/hooks/queryHooks";

export default function PinPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPin, isLoading: checkingStatus } = usePinStatus();

  const [mode, setMode] = useState<"set" | "change" | "done">("set");
  const [currentPin, setCurrentPin] = useState(["", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [step, setStep] = useState<"current" | "new" | "confirm" | "done">("new");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!checkingStatus) {
      setMode(hasPin ? "change" : "set");
      setStep(hasPin ? "current" : "new");
    }
  }, [checkingStatus, hasPin]);

  const handleDigitInput = (
    value: string,
    index: number,
    target: "current" | "new" | "confirm",
  ) => {
    if (value === "" || /^\d$/.test(value)) {
      const update =
        target === "current"
          ? [...currentPin]
          : target === "new"
            ? [...newPin]
            : [...confirmPin];
      update[index] = value;
      if (target === "current") setCurrentPin(update);
      else if (target === "new") setNewPin(update);
      else setConfirmPin(update);
      setError("");
      if (value && index < 3) {
        const nextInput = document.getElementById(`pin-${target}-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    target: "current" | "new" | "confirm",
  ) => {
    const arr = target === "current" ? currentPin : target === "new" ? newPin : confirmPin;
    if (e.key === "Backspace" && !arr[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${target}-${index - 1}`);
      prevInput?.focus();
    }
  };

  const { mutateAsync: setPin, isPending: isSetting } = useMutation({
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
            pin: newPin.join(""),
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to set PIN");
      }
      return res.json();
    },
    onSuccess: () => {
      setStep("done");
      setSuccessMsg("Your transaction PIN has been created successfully.");
      queryClient.invalidateQueries({ queryKey: ["pinStatus"] });
    },
    onError: (e: Error) => setError(e.message),
  });

  const { mutateAsync: changePin, isPending: isChanging } = useMutation({
    mutationFn: async () => {
      const { data } = await getSession();
      if (!data?.user) throw new Error("Not authenticated");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/pin/change`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            userId: data.user.id,
            currentPin: currentPin.join(""),
            newPin: newPin.join(""),
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to change PIN");
      }
      return res.json();
    },
    onSuccess: () => {
      setStep("done");
      setSuccessMsg("Your transaction PIN has been changed successfully.");
      queryClient.invalidateQueries({ queryKey: ["pinStatus"] });
    },
    onError: (e: Error) => setError(e.message),
  });

  const handleAdvance = () => {
    if (mode === "set") {
      if (step === "new") {
        if (newPin.join("").length !== 4) {
          setError("Please enter a 4-digit PIN");
          return;
        }
        setStep("confirm");
        setError("");
      } else if (step === "confirm") {
        const newStr = newPin.join("");
        const confirmStr = confirmPin.join("");
        if (newStr !== confirmStr) {
          setError("PINs do not match. Try again.");
          setConfirmPin(["", "", "", ""]);
          return;
        }
        setPin();
      }
    } else {
      if (step === "current") {
        if (currentPin.join("").length !== 4) {
          setError("Please enter your current PIN");
          return;
        }
        setStep("new");
        setError("");
      } else if (step === "new") {
        if (newPin.join("").length !== 4) {
          setError("Please enter a new 4-digit PIN");
          return;
        }
        setStep("confirm");
        setError("");
      } else if (step === "confirm") {
        const newStr = newPin.join("");
        const confirmStr = confirmPin.join("");
        if (newStr !== confirmStr) {
          setError("PINs do not match. Try again.");
          setConfirmPin(["", "", "", ""]);
          return;
        }
        changePin();
      }
    }
  };

  const isNextDisabled = () => {
    if (mode === "set") {
      if (step === "new") return newPin.join("").length !== 4;
      if (step === "confirm") return confirmPin.join("").length !== 4 || isSetting;
    } else {
      if (step === "current") return currentPin.join("").length !== 4;
      if (step === "new") return newPin.join("").length !== 4;
      if (step === "confirm") return confirmPin.join("").length !== 4 || isChanging;
    }
    return true;
  };

  const getButtonLabel = () => {
    if (isSetting || isChanging) {
      return mode === "set" ? "Setting PIN..." : "Changing PIN...";
    }
    if (mode === "set") {
      return step === "confirm" ? "Set PIN" : "Next";
    }
    return step === "confirm" ? "Change PIN" : "Next";
  };

  const showGoBack = mode === "change" ? step !== "current" : step === "confirm";

  const renderPinInputs = (
    arr: string[],
    target: "current" | "new" | "confirm",
  ) => (
    <div className="flex justify-center gap-3">
      {arr.map((digit, i) => (
        <input
          key={i}
          id={`pin-${target}-${i}`}
          type="tel"
          maxLength={1}
          value={digit}
          onChange={(e) => handleDigitInput(e.target.value, i, target)}
          onKeyDown={(e) => handleKeyDown(e, i, target)}
          onFocus={(e) => e.target.select()}
          className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-card-border focus:border-teal focus:ring-2 focus:ring-teal/30 outline-none transition-all"
          inputMode="numeric"
          autoComplete="off"
        />
      ))}
    </div>
  );

  if (checkingStatus) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal border-t-transparent rounded-full" />
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="h-full p-2 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-8 h-8 fill-green" weight="bold" />
          </div>
          <h3 className={`${soraClass} text-xl font-bold text-forest mb-2`}>
            {mode === "set" ? "PIN Set Successfully" : "PIN Changed Successfully"}
          </h3>
          <p className="text-sm text-ink-mid mb-6">{successMsg}</p>
          <button
            onClick={() => router.push("/profile")}
            className="w-full py-3 rounded-full bg-green text-white font-bold hover:bg-greener transition-all"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-2 max-w-lg mx-auto">
      <p className={`${soraClass} text-3xl text-green my-2 font-bold`}>
        {mode === "set" ? "Set Transaction PIN" : "Change Transaction PIN"}
      </p>
      <p className="text-sm text-ink-mid mb-6">
        {mode === "set"
          ? "Create a 4-digit PIN to secure your wallet transfers, cluster funding, and plan contributions."
          : "Update your 4-digit transaction PIN."}
      </p>

      <div className="border border-card-border rounded-2xl p-6">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-3">
            <LockIcon className="w-7 h-7 fill-teal" weight="fill" />
          </div>
        </div>

        {mode === "change" && step === "current" && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-forest mb-3 text-center">
              Enter Current PIN
            </p>
            {renderPinInputs(currentPin, "current")}
          </div>
        )}

        {step === "new" && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-forest mb-3 text-center">
              {mode === "change" ? "Enter New PIN" : "Enter PIN"}
            </p>
            {renderPinInputs(newPin, "new")}
          </div>
        )}

        {step === "confirm" && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-forest mb-3 text-center">
              Confirm PIN
            </p>
            {renderPinInputs(confirmPin, "confirm")}
          </div>
        )}

        {error && (
          <p className="text-sm text-red bg-red/5 rounded-xl px-3 py-2 mb-4 text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleAdvance}
          disabled={isNextDisabled()}
          className="w-full py-3 rounded-full bg-green text-white font-bold hover:bg-greener transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {(isSetting || isChanging) ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              {getButtonLabel()}
            </span>
          ) : (
            getButtonLabel()
          )}
        </button>

        {showGoBack && (
          <button
            onClick={() => {
              const prev = step === "confirm" ? "new" : "current";
              setStep(prev);
              setError("");
            }}
            className="w-full mt-2 py-2 text-sm text-ink-mid font-medium hover:text-ink transition-colors"
          >
            Go back
          </button>
        )}
      </div>
    </div>
  );
}
