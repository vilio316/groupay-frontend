"use client";

import { useState } from "react";
import { XIcon, Envelope } from "@phosphor-icons/react";
import { soraClass } from "../fonts";
import { useMutation } from "@tanstack/react-query";

export default function InviteMemberModal({
  open,
  clusterId,
  onClose,
  onSuccess,
}: {
  open: boolean;
  clusterId: string;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { mutateAsync: sendInvite, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/${clusterId}/invite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to send invitation");
      }
      return res.json();
    },
    onSuccess: () => {
      setSuccess(`Invitation sent to ${email}`);
      setEmail("");
      setError("");
      onSuccess?.();
    },
    onError: (e: Error) => {
      setError(e.message);
    },
  });

  const handleSend = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setSuccess("");
    sendInvite();
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setSuccess("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-ink-mid hover:text-ink transition-colors"
        >
          <XIcon className="w-5 h-5" weight="bold" />
        </button>

        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
            <Envelope className="w-6 h-6 text-teal" weight="fill" />
          </div>

          <h3 className={`${soraClass} text-lg font-bold text-forest-text`}>
            Invite Member
          </h3>

          <p className="text-sm text-ink-mid leading-relaxed">
            Enter the email address of the person you want to invite.
          </p>
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); setSuccess(""); }}
          placeholder="email@example.com"
          className="h-12 w-full px-4 rounded-xl border border-card-border bg-white outline-none transition-all placeholder:text-mist focus:border-green focus:ring-2 focus:ring-green/20 text-sm text-ink mb-4"
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
        />

        {error && (
          <p className="text-sm text-red bg-red/5 rounded-xl px-3 py-2 mb-4 text-center">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green bg-green/5 rounded-xl px-3 py-2 mb-4 text-center">
            {success}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 h-11 rounded-[9999px] border border-card-border text-ink-mid text-sm font-semibold hover:bg-mist/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!email.trim() || isPending}
            className="flex-1 h-11 rounded-[9999px] text-sm font-semibold text-white bg-teal hover:bg-teal/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Sending...
              </span>
            ) : (
              "Send Invite"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
