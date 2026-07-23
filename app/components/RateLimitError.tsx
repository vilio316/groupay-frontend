"use client";

import { ClockIcon } from "@phosphor-icons/react";

export default function RateLimitError({
  onDismiss,
}: {
  onDismiss: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-red/10 flex items-center justify-center mb-4">
        <ClockIcon className="w-7 h-7 text-red" weight="fill" />
      </div>
      <h3 className="text-lg font-bold text-forest-text mb-1">
        Too Many Attempts
      </h3>
      <p className="text-sm text-ink-mid mb-6 max-w-80">
        You have made too many PIN attempts. Please wait a moment before trying
        again.
      </p>
      <button
        onClick={onDismiss}
        className="w-full py-3 rounded-full border border-card-border text-ink-mid font-semibold hover:bg-gray-50 dark:hover:bg-[#162c20] transition-all"
      >
        Dismiss
      </button>
    </div>
  );
}
