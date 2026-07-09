"use client";

import { soraClass } from "./fonts";
import { WarningCircleIcon, ArrowClockwiseIcon, BugIcon, CopyIcon, CheckCircleIcon, HouseLineIcon } from "@phosphor-icons/react";
import { useState, useCallback } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const [showStack, setShowStack] = useState(false);
  const [copied, setCopied] = useState(false);
  const ts = new Date().toLocaleString();

  const handleCopyError = useCallback(async () => {
    const text = [
      `Error: ${error.name}: ${error.message}`,
      error.digest ? `Digest: ${error.digest}` : "",
      `Time: ${ts}`,
      `URL: ${typeof window !== "undefined" ? window.location.href : ""}`,
      `User Agent: ${typeof navigator !== "undefined" ? navigator.userAgent : ""}`,
      error.stack ? `\nStack:\n${error.stack}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [error, ts]);

  return (
    <html>
      <body className="bg-[#fffbfa] text-[#1a1a1a] min-h-screen flex items-center justify-center p-4">
        <div
          className="w-full max-w-[520px] bg-[#fffbfa] border border-[rgba(139,215,210,0.4)] rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#49c635] via-[#54defd] to-[#00bd9d]" />

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[rgba(229,55,58,0.12)] flex items-center justify-center mx-auto mb-4">
              <WarningCircleIcon className="w-8 h-8 text-[#e5373a]" weight="fill" />
            </div>
            <h1 className={`${soraClass} text-xl font-bold text-[#0d2b1f] mb-1`}>
              Something went wrong
            </h1>
            <p className="text-sm text-[#4a5568]">
              An unexpected error occurred. Our team has been notified.
            </p>
          </div>

          <div className="border border-[rgba(139,215,210,0.4)] rounded-xl p-4 mb-4 space-y-3">
            <div>
              <p className="text-xs uppercase font-semibold text-[#4a5568] tracking-wider mb-1">
                Error
              </p>
              <p className="text-sm text-[#0d2b1f] font-medium break-words">
                {error.name}: {error.message}
              </p>
            </div>
            {error.digest && (
              <>
                <div className="border-t border-[rgba(139,215,210,0.4)]" />
                <div>
                  <p className="text-xs uppercase font-semibold text-[#4a5568] tracking-wider mb-1">
                    Digest
                  </p>
                  <p className="text-sm text-[#0d2b1f] font-mono break-all">
                    {error.digest}
                  </p>
                </div>
              </>
            )}
            <div className="border-t border-[rgba(139,215,210,0.4)]" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-semibold text-[#4a5568] tracking-wider mb-1">
                  Occurred
                </p>
                <p className="text-sm text-[#0d2b1f]">{ts}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase font-semibold text-[#4a5568] tracking-wider mb-1">
                  Page
                </p>
                <p className="text-sm text-[#4a5568] font-mono max-w-[200px] truncate">
                  {typeof window !== "undefined" ? window.location.pathname : "—"}
                </p>
              </div>
            </div>
          </div>

          {error.stack && (
            <div className="mb-4">
              <button
                onClick={() => setShowStack((v) => !v)}
                className="flex items-center gap-2 text-xs font-semibold text-[#00bd9d] hover:text-[#49c635] transition-colors uppercase tracking-wider"
              >
                <BugIcon className="w-4 h-4" weight="bold" />
                {showStack ? "Hide" : "Show"} stack trace
              </button>
              {showStack && (
                <pre className="mt-2 p-3 bg-[rgba(139,215,210,0.1)] border border-[rgba(139,215,210,0.4)] rounded-xl text-xs text-[#4a5568] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {error.stack}
                </pre>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => unstable_retry()}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-[9999px] bg-[#49c635] text-[#fffbfa] text-xs font-semibold uppercase tracking-wider hover:bg-[#3db029] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowClockwiseIcon className="w-4 h-4" weight="bold" />
              Try again
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleCopyError}
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-[9999px] border border-[#49c635] text-[#49c635] text-xs font-semibold uppercase tracking-wider hover:bg-[rgba(73,198,53,0.08)] transition-all"
              >
                {copied ? (
                  <>
                    <CheckCircleIcon className="w-4 h-4" weight="bold" />
                    Copied
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-4 h-4" weight="bold" />
                    Copy details
                  </>
                )}
              </button>
              <a
                href="/dashboard"
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-[9999px] border border-[rgba(139,215,210,0.4)] text-[#4a5568] text-xs font-semibold uppercase tracking-wider hover:bg-[rgba(139,215,210,0.1)] transition-all no-underline"
              >
                <HouseLineIcon className="w-4 h-4" weight="bold" />
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
