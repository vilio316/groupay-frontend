"use client";

import { ShieldCheckIcon, XIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { useState } from "react";
import Link from "next/link";

export default function PinReminderBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Link
      href="/profile/pin"
      className="bg-amber/10 border border-amber/30 rounded-xl px-4 py-3 flex items-center justify-between gap-3 mb-4 hover:bg-amber/15 transition-all group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-amber/20 flex items-center justify-center shrink-0">
          <ShieldCheckIcon className="w-5 h-5 fill-amber" weight="fill" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-forest-text group-hover:text-amber-800 transition-colors">
            Set up your transaction PIN
          </p>
          <p className="text-xs text-ink-mid truncate">
            Secure your wallet transfers, cluster funding, and plan
            contributions with a 4-digit PIN.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.preventDefault()}>
        <span className="text-xs font-bold bg-amber text-white px-3 py-1.5 rounded-full hover:bg-amber/90 transition-all whitespace-nowrap flex items-center gap-1">
          Set PIN <ArrowRightIcon className="w-3 h-3" weight="bold" />
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDismissed(true);
          }}
          className="text-ink-mid hover:text-ink transition-colors p-1"
          title="Dismiss"
        >
          <XIcon className="w-4 h-4" weight="bold" />
        </button>
      </div>
    </Link>
  );
}
