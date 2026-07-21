"use client";

import { soraClass } from "@/app/fonts";
import { signOut } from "@/lib/authClient";
import {
  SignOutIcon,
  EnvelopeSimpleIcon,
  ChatTextIcon,
  WhatsappLogoIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr";
import { redirect } from "next/navigation";
import { useSession } from "@/lib/authClient";
import Link from "next/link";
import {
  PencilSimpleLineIcon,
  LockIcon,
  LockOpenIcon,
} from "@phosphor-icons/react";
import { useMyUserData, usePinStatus } from "@/app/hooks/queryHooks";
import { useState } from "react";
import PinSetupModal from "@/app/components/PinSetupModal";
import InlineError from "@/app/components/InlineError";

function ToggleCard({
  icon,
  label,
  desc,
  defaultChecked,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  defaultChecked?: boolean;
}) {
  const [enabled, setEnabled] = useState(defaultChecked ?? true);
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between p-4 border border-card-border rounded-xl hover:border-teal/30 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center shrink-0 text-teal group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-sm text-forest-text">{label}</p>
          <p className="text-xs text-ink-mid">{desc}</p>
        </div>
      </div>
      <input
        type="checkbox"
        id={id}
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
        className="sr-only peer"
      />
      <div className="relative w-11 h-6 bg-mist rounded-full peer-checked:bg-green transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />
    </label>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-mist/30 animate-pulse rounded-xl ${className ?? ""}`} />
  );
}

export default function ProfilePage() {
  const session = useSession();
  const { userDetails, isLoading, isSuccess, myDataError, refetchUserData } = useMyUserData();
  const { hasPin, PINError } = usePinStatus();
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [loading, updateLoading] = useState(false);

  if (myDataError) {
    return (
      <div className="p-6">
        <InlineError
          message="Could not load your profile"
          retry={refetchUserData}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center gap-4 p-4 border border-card-border rounded-xl">
          <Skeleton className="h-28 w-28 rounded-full" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className={`text-3xl font-bold text-forest-text ${soraClass}`}>
          Your Profile
        </h1>
        <Link
          href="/profile/edit"
          className="inline-flex items-center gap-2 bg-teal text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-teal/90 transition-all hover:-translate-y-px hover:shadow-md shadow-teal/20"
        >
          <PencilSimpleLineIcon className="text-lg" weight="bold" />
          Edit Profile
        </Link>
      </div>

      {/* User Info Card */}
      <div className="flex gap-5 items-center p-6 border border-card-border rounded-xl shadow-card">
        <img
          className="rounded-full md:h-28 md:w-28 w-20 h-20 object-cover border-2 border-green/30 shrink-0"
          src={`${session.data?.user.image ? session.data.user.image : "/family.jpg"}`}
          alt="Profile"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xl font-bold text-forest-text truncate">
            {isSuccess && userDetails ? userDetails.name : "User Name"}
          </p>
          <p className="text-ink-mid text-sm font-medium truncate">
            @
            {isSuccess && userDetails
              ? userDetails.email.split("@")[0]
              : "username"}
          </p>
          <p className="text-sm text-ink-mid mt-1">
            {isSuccess && userDetails
              ? `${userDetails.clusters.length} `
              : "0 "}
            <Link
              href="/clusters"
              className="text-green font-semibold hover:underline"
            >
              Clusters
            </Link>
          </p>
          {/* Verification badge */}
          <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-green/15 text-paid-text text-xs font-bold rounded-full">
            <ShieldCheckIcon weight="fill" className="text-sm" />
            Tier 1
          </span>
        </div>
        <button
          className="hidden md:inline-flex items-center gap-2 text-red border border-red/30 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red hover:text-white transition-all shrink-0"
          onClick={async (e) => {
            e.preventDefault();
            updateLoading(true);
            await signOut({
              fetchOptions: {
                onSuccess: () => {
                  updateLoading(false);
                  redirect("/auth/sign-in");
                },
              },
            });
          }}
        >
          {loading ? (
            <>
              <span className="w-5 h-5 rounded-full animate-spin border-2 border-white border-t-red" />{" "}
              <span>Signing out...</span>
            </>
          ) : (
            <>
              <SignOutIcon className="text-lg" />
              <span>Log Out</span>
            </>
          )}
        </button>
      </div>

      {/* Notification Preferences */}
      <div className="border border-card-border rounded-xl p-6 shadow-card">
        <h2 className={`text-lg font-bold text-forest-text mb-4 ${soraClass}`}>
          Notification Preferences
        </h2>
        <p className="text-sm text-ink-mid mb-4">
          Choose how you'd like to receive alerts about payments, invites and
          group activity.
        </p>
        <div className="space-y-3">
          <ToggleCard
            icon={<EnvelopeSimpleIcon weight="duotone" className="text-xl" />}
            label="Email Alerts"
            desc="Payment confirmations, reminders and weekly summaries"
            defaultChecked={true}
          />
          <ToggleCard
            icon={<ChatTextIcon weight="duotone" className="text-xl" />}
            label="SMS Alerts"
            desc="Time-sensitive payment notifications and OTPs"
            defaultChecked={false}
          />
          <ToggleCard
            icon={<WhatsappLogoIcon weight="duotone" className="text-xl" />}
            label="WhatsApp Alerts"
            desc="Group activity, invites and casual payment nudges"
            defaultChecked={false}
          />
        </div>
      </div>

      {/* Account Settings */}
      <div className="border border-card-border rounded-xl p-6 shadow-card">
        <h2 className={`text-lg font-bold text-forest-text mb-4 ${soraClass}`}>
          Account Settings
        </h2>
        <div className="space-y-3 text-sm text-ink-mid">
          <div className="flex items-center justify-between p-3 border border-card-border rounded-xl">
            <span className="font-medium text-forest-text">Email</span>
            <span className="text-ink-mid">
              {isSuccess && userDetails ? userDetails.email : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 border border-card-border rounded-xl">
            <span className="font-medium text-forest-text">Phone</span>
            <span className="text-ink-mid">
              {isSuccess && userDetails && userDetails.phone
                ? userDetails.phone
                : "Not set"}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 border border-card-border rounded-xl">
            <span className="font-medium text-forest-text">Joined</span>
            <span className="text-ink-mid">
              {isSuccess && userDetails
                ? new Date(
                    userDetails.clusters[0]?.joinedAt ?? Date.now(),
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Transaction PIN */}
      <div className="border border-card-border rounded-xl p-6 shadow-card">
        <h2 className={`text-lg font-bold text-forest-text mb-4 ${soraClass}`}>
          Transaction PIN
        </h2>
        {PINError ? (
          <div className="p-4 border border-card-border rounded-xl">
            <p className="text-red text-sm font-semibold">Could not check PIN status</p>
          </div>
        ) : (
        <div className="flex items-center justify-between p-4 border border-card-border rounded-xl hover:border-teal/30 transition-all">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${hasPin ? "bg-green/10 text-green" : "bg-amber/10 text-amber"}`}
            >
              {hasPin ? (
                <LockIcon weight="fill" className="text-xl" />
              ) : (
                <LockOpenIcon weight="fill" className="text-xl" />
              )}
            </div>
            <div>
              <p className="font-semibold text-sm text-forest-text">
                {hasPin ? "PIN Active" : "No PIN Set"}
              </p>
              <p className="text-xs text-ink-mid">
                {hasPin
                  ? "Your transactions are PIN-protected"
                  : "Secure your wallet transfers and contributions"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (hasPin) {
                window.location.href = "/profile/pin";
              } else {
                setShowPinSetup(true);
              }
            }}
            className="inline-flex items-center gap-1.5 bg-teal text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-teal/90 transition-all shrink-0"
          >
            {hasPin ? "Change" : "Set PIN"}
          </button>
        </div>
        )}
      </div>

      <PinSetupModal
        isShown={showPinSetup}
        onClose={() => setShowPinSetup(false)}
        onSuccess={() => setShowPinSetup(false)}
      />

      {/* Mobile logout */}
      <div className="md:hidden flex justify-center">
        <button
          className="inline-flex items-center gap-2 text-red border border-red/30 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-red hover:text-white transition-all"
          onClick={async (e) => {
            e.preventDefault();
            updateLoading(true);
            await signOut({
              fetchOptions: {
                onSuccess: () => {
                  updateLoading(false);
                  redirect("/auth/sign-in");
                },
              },
            });
          }}
        >
          {loading ? (
            <>
              <span className="w-5 h-5 rounded-full animate-spin border-2 border-white border-t-red" />{" "}
              <span>Signing out...</span>
            </>
          ) : (
            <>
              <SignOutIcon className="text-lg" />
              <span>Log Out</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
