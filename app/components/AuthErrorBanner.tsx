"use client";

import { WarningCircleIcon } from "@phosphor-icons/react";

function parseAuthError(raw: string): { message: string; suggestion?: string } {
  const lower = raw.toLowerCase();

  if (lower.includes("invalid email") || lower.includes("email not found") || lower.includes("user not found")) {
    return { message: "No account found with this email address.", suggestion: "Check the spelling or sign up for a new account." };
  }

  if (lower.includes("invalid password") || lower.includes("incorrect password") || lower.includes("wrong password")) {
    return { message: "Incorrect password.", suggestion: "Reset your password if you've forgotten it." };
  }

  if (lower.includes("invalid email or password") || lower.includes("invalid credentials")) {
    return { message: "The email or password you entered is incorrect.", suggestion: "Double-check your credentials or reset your password." };
  }

  if (lower.includes("email already")) {
    return { message: "An account with this email already exists.", suggestion: "Sign in instead, or reset your password if you've forgotten it." };
  }

  if (lower.includes("password too short") || lower.includes("password must be")) {
    return { message: "Password must be at least 8 characters long." };
  }

  if (lower.includes("rate limit") || lower.includes("too many") || lower.includes("429")) {
    return { message: "Too many attempts. Please wait a moment and try again." };
  }

  if (lower.includes("network") || lower.includes("fetch") || lower.includes("connect")) {
    return { message: "Unable to connect to the server.", suggestion: "Check your internet connection and try again." };
  }

  return { message: raw };
}

export default function AuthErrorBanner({ error }: { error: string | null }) {
  if (!error || error.length === 0) return null;

  const { message, suggestion } = parseAuthError(error);

  return (
    <div className="bg-red/5 border border-red/20 rounded-xl px-4 py-3 mb-4">
      <div className="flex items-start gap-2">
        <WarningCircleIcon className="w-5 h-5 text-red shrink-0 mt-0.5" weight="fill" />
        <div className="text-sm text-red">
          <p className="font-semibold">{message}</p>
          {suggestion && <p className="mt-1 text-red/80 text-xs">{suggestion}</p>}
        </div>
      </div>
    </div>
  );
}
