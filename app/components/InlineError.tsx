"use client";

import { WarningCircleIcon, ArrowClockwiseIcon } from "@phosphor-icons/react";

export default function InlineError({
  message = "Something went wrong",
  retry,
}: {
  message?: string;
  retry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-red/10 flex items-center justify-center">
        <WarningCircleIcon
          className="w-7 h-7 text-red"
          weight="fill"
        />
      </div>
      <div>
        <p className="font-semibold text-ink text-base">{message}</p>
        <p className="text-sm text-ink-mid mt-1">
          Please try again or refresh the page.
        </p>
      </div>
      {retry && (
        <button
          onClick={retry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green text-white text-sm font-semibold hover:bg-greener transition-all"
        >
          <ArrowClockwiseIcon className="w-4 h-4" weight="bold" />
          Retry
        </button>
      )}
    </div>
  );
}
