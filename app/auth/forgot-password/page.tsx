"use client";

import { soraClass } from "@/app/fonts";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeftIcon } from "@phosphor-icons/react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simulate sending reset email
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="p-6 grid items-center h-full justify-center md:justify-start">
        <div className="md:w-125 text-center">
          <p className={`${soraClass} text-3xl font-bold text-[#0d2b1f] my-3`}>
            Check your email
          </p>
          <p className="text-sm text-[#4a5568] mb-6">
            If an account with <strong>{email}</strong> exists, we&apos;ve sent
            password reset instructions.
          </p>
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#49c635] hover:text-[#3db029] transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" weight="bold" />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 grid items-center h-full justify-center md:justify-start">
      <div className="md:w-125">
        <div className="mb-6">
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#00bd9d] hover:text-[#49c635] transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" weight="bold" />
            Back to sign in
          </Link>
          <p className={`${soraClass} text-3xl font-bold text-[#0d2b1f] my-2`}>
            Forgot Password?
          </p>
          <p className="text-sm text-[#4a5568]">
            Enter your email address and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="resetEmail"
              className="uppercase block text-sm font-semibold text-[#0d2b1f] mb-1.5"
            >
              Email address
            </label>
            <input
              type="email"
              id="resetEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="h-12 px-3 w-full outline-none transition-colors placeholder:text-[#8bd7d2] focus:border-[#49c635] focus:ring-2 focus:ring-[rgba(73,198,53,0.15)] border border-[rgba(139,215,210,0.4)] rounded-xl bg-[#fffbfa] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="h-11 w-full rounded-[9999px] bg-[#49c635] text-[#fffbfa] text-xs font-semibold uppercase tracking-wider hover:bg-[#3db029] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="text-center text-sm text-[#4a5568] mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="text-[#49c635] hover:text-[#3db029] hover:underline font-semibold"
          >
            Sign up →
          </Link>
        </p>
      </div>
    </div>
  );
}
