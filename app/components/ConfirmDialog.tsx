"use client";

import { WarningIcon, XIcon } from "@phosphor-icons/react";
import { soraClass } from "@/app/fonts";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  confirmClass,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-ink-mid hover:text-ink transition-colors"
        >
          <XIcon className="w-5 h-5" weight="bold" />
        </button>

        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <WarningIcon className="w-6 h-6 text-red" weight="fill" />
          </div>

          <h3 className={`${soraClass} text-lg font-bold text-forest-text`}>
            {title}
          </h3>

          <p className="text-sm text-ink-mid leading-relaxed">{message}</p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-11 rounded-[9999px] border border-card-border text-ink-mid text-sm font-semibold hover:bg-mist/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 h-11 rounded-[9999px] text-sm font-semibold text-white transition-colors ${
              confirmClass || "bg-red hover:bg-red/80"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
