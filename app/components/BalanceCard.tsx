"use client";

import { getSession, useSession } from "@/lib/authClient";
import {
  PaperPlaneTiltIcon,
  BankIcon,
  XIcon,
  CopyIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react";
import {
  HandDepositIcon,
  HandWithdrawIcon,
} from "@phosphor-icons/react/dist/ssr";
import { usePathname } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { soraClass } from "../fonts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMyAccountDetails } from "../hooks/queryHooks";

export function BalanceCard({
  payFunct,
  balance,
  onAccountClick,
}: {
  payFunct: (string?: string) => void;
  balance?: number;
  onAccountClick?: () => void;
}) {
  const session = useSession();
  const pathname = usePathname();
  const isDashboard = !pathname.includes("cluster");
  return (
    <div className="grid md:w-[90%] md:grid-cols-8 items-center border border-card-border shadow-md p-4 rounded-xl shadow-card-border/40 my-2">
      {isDashboard && (
        <div className="col-span-1">
          <img
            src={`${session.data?.user.image ? session.data.user.image : "/family.jpg"}`}
            className="rounded-full p-1 drop-shadow-xl drop-shadow-card-border md:h-24 md:w-24 h-12 w-12 object-cover"
          />
        </div>
      )}
      <div className={`${!isDashboard ? "col-span-4" : "col-span-3"}`}>
        <p className="text-ink-mid font-semibold uppercase my-2">
          Total Balance:
        </p>
        <p className="font-bold text-2xl ">
          &#8358;{" "}
          {balance ? (balance / 100).toLocaleString() : (0).toLocaleString()}
        </p>
      </div>
      <div className="col-span-4 justify-end flex items-center gap-x-4 text-center">
        {isDashboard && onAccountClick && (
          <button title="My Account">
            <div className="flex justify-center">
              <BankIcon
                weight="duotone"
                className="rounded-full bg-teal/30 text-teal shadow-xl shadow-card-border h-8 w-8 md:h-12 md:w-12 p-2 hover:bg-teal hover:text-white hover:font-bold hover:scale-105 transition-all duration-100"
                onClick={onAccountClick}
              />
            </div>
            <span className="text-sm text-ink-mid">Account</span>
          </button>
        )}
        <button title="Add Money">
          <div className="flex justify-center">
            <HandDepositIcon
              weight="duotone"
              className="rounded-full bg-green/40 text-black shadow-xl shadow-card-border h-8 w-8 md:h-12 md:w-12 p-2 hover:bg-greener hover:font-bold hover:scale-105 transition-all duration-100"
              onClick={() => payFunct("add")}
            />
          </div>
          <span className="text-sm text-ink-mid">Add money</span>
        </button>

        <button title="Request Withdrawal">
          <div className="flex justify-center">
            <HandWithdrawIcon
              weight="duotone"
              className="rounded-full bg-green/40 text-black shadow-xl shadow-card-border h-8 w-8 md:h-12 md:w-12 p-2 hover:bg-greener hover:font-bold hover:scale-105 transition-all duration-100"
              onClick={() => payFunct("withdraw")}
            />
          </div>
          <span className="text-ink-mid text-sm">Withdraw</span>
        </button>

        {isDashboard && (
          <button title="Make Transfer">
            <div className="flex justify-center">
              <PaperPlaneTiltIcon
                weight="duotone"
                className="rounded-full bg-green/40 text-black shadow-xl shadow-card-border h-8 w-8 md:h-12 md:w-12 p-2 hover:bg-greener hover:font-bold hover:scale-105 transition-all duration-100"
                onClick={() => payFunct("transfer")}
              />
            </div>
            <span className="text-ink-mid text-sm">Transfer</span>
          </button>
        )}
      </div>
    </div>
  );
}

const DEFAULT_ACCOUNT_NUMBER = "1234567890";

export function UserAccountModal({
  isShown,
  onClose,
}: {
  isShown: boolean;
  onClose: () => void;
}) {
  const { data } = useSession();
  const [accountData, setAccountData] = useState<{
    accountNumber: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const { isFetching, isSuccess, accountDetails } = useMyAccountDetails();

  if (!isShown) return null;

  if (showRequestForm) {
    return (
      <RequestAccountFormModal
        onBack={() => setShowRequestForm(false)}
        onClose={onClose}
      />
    );
  }

  const userName = data?.user?.name || "User";

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-forest/50 p-3">
      <div className="bg-white rounded-[20px] max-w-130 w-full p-6 shadow-modal relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink hover:text-red transition-colors"
        >
          <XIcon className="w-6 h-6" weight="bold" />
        </button>

        {isFetching ? (
          <div className="text-center py-10">
            <div className="animate-spin w-8 h-8 border-2 border-teal border-t-transparent rounded-full mx-auto" />
            <p className="text-ink-mid mt-4">Loading account info...</p>
          </div>
        ) : accountDetails && accountDetails.accountNumber !== "1234567890" ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-4">
              <BankIcon className="w-8 h-8 fill-teal" weight="fill" />
            </div>
            <h3 className={`${soraClass} text-xl font-bold text-forest mb-2`}>
              Your Account
            </h3>
            <p className="text-sm text-ink-mid mb-6">
              Your GrouPay account number is shown below.
            </p>

            <div className="border border-card-border rounded-xl p-4 mb-4 text-left space-y-3">
              <div>
                <p className="text-xs uppercase font-semibold text-ink-mid tracking-wider mb-1">
                  Account Name
                </p>
                <p className="text-forest font-bold text-lg">{userName}</p>
              </div>
              <div className="border-t border-card-border/50" />
              <div>
                <p className="text-xs uppercase font-semibold text-ink-mid tracking-wider mb-1">
                  Account Number
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-forest font-bold text-lg tracking-widest">
                    {accountDetails.accountNumber}
                  </p>
                  <CopyButton text={accountDetails.accountNumber} />
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-teal text-white font-bold hover:bg-teal/90 transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-mist/20 flex items-center justify-center mx-auto mb-4">
              <BankIcon className="w-8 h-8 fill-mist" weight="duotone" />
            </div>
            <h3 className={`${soraClass} text-xl font-bold text-forest mb-2`}>
              No Account Yet
            </h3>
            <p className="text-sm text-ink-mid mb-6">
              You haven&apos;t set up your GrouPay account yet. Request one to
              get started.
            </p>

            <button
              onClick={() => {
                setShowRequestForm(true);
              }}
              className="w-full py-3 rounded-full bg-teal text-white font-bold hover:bg-teal/90 transition-all mb-3"
            >
              Request Account
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full border border-card-border text-ink-mid font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg hover:bg-teal/10 transition-all shrink-0"
      title="Copy account number"
    >
      {copied ? (
        <CheckCircleIcon className="w-5 h-5 fill-teal" weight="bold" />
      ) : (
        <CopyIcon className="w-5 h-5 text-ink-mid" weight="bold" />
      )}
    </button>
  );
}

function RequestAccountFormModal({
  onBack,
  onClose,
}: {
  onBack: () => void;
  onClose: () => void;
}) {
  const { data } = useSession();
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const formatDOB = (date: string) => {
    const stringChunks = date.split("-");
    return `${stringChunks[1]}/${stringChunks[2]}/${stringChunks[0]}`;
  };
  const nameParts = (data?.user?.name || "").split(" ");
  const prefillFirstName = nameParts[0] || "";
  const prefillLastName = nameParts.slice(1).join(" ") || "";
  const prefillEmail = data?.user?.email || "";
  const prefillPhone = data?.user?.phone || "";

  const [formData, setFormData] = useState({
    first_name: prefillFirstName,
    last_name: prefillLastName,
    email: prefillEmail,
    mobile_num: prefillPhone,
    bvn: "",
    dob: "",
    address: "",
    gender: "",
  });

  const isComplete =
    formData.first_name.trim() &&
    formData.last_name.trim() &&
    formData.email.trim() &&
    formData.mobile_num.trim() &&
    formData.bvn.trim() &&
    formData.dob.trim() &&
    formData.address.trim() &&
    formData.gender.trim();

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const {
    isPending,
    mutateAsync: createAccount,
    isSuccess,
  } = useMutation({
    mutationFn: async () => {
      if (!isComplete) return;
      try {
        const { data } = await getSession();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/squad/virtual/${data?.user.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              dob: formatDOB(formData.dob),
              customer_identifier: prefillEmail,
              beneficiary_account: process.env.NEXT_PUBLIC_BENEFICIARY_ACCOUNT,
            }),
            credentials: "include",
          },
        );
        const resJSON = await res.json();
        return resJSON;
      } catch (error) {
        throw new Error("An error occurred!");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account_details"] });
      onBack();
    },
  });

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-forest/50 p-3">
      <div className="bg-white rounded-[20px] max-w-130 w-full p-6 shadow-modal relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-ink hover:text-teal transition-colors"
          title="Go back"
        >
          <ArrowLeftIcon className="w-6 h-6" weight="bold" />
        </button>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink hover:text-red transition-colors"
        >
          <XIcon className="w-6 h-6" weight="bold" />
        </button>

        <div className="text-center mb-6 mt-4">
          <h3 className={`${soraClass} text-xl font-bold text-forest`}>
            Request Account
          </h3>
          <p className="text-sm text-ink-mid mt-1">
            Fill in your details to create a GrouPay account.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="First Name"
              value={formData.first_name}
              onChange={(v) => updateField("first_name", v)}
              placeholder="John"
            />
            <FormField
              label="Last Name"
              value={formData.last_name}
              onChange={(v) => updateField("last_name", v)}
              placeholder="Doe"
            />
          </div>
          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(v) => updateField("email", v)}
            placeholder="john@example.com"
          />
          <FormField
            label="Mobile Number"
            type="tel"
            value={formData.mobile_num}
            onChange={(v) => updateField("mobile_num", v)}
            placeholder="08012345678"
          />
          <FormField
            label="BVN"
            value={formData.bvn}
            onChange={(v) => updateField("bvn", v)}
            placeholder="Enter your BVN"
            maxLength={11}
          />
          <FormField
            label="Date of Birth"
            type="date"
            value={formData.dob}
            onChange={(v) => updateField("dob", v)}
          />
          <FormField
            label="Address"
            value={formData.address}
            onChange={(v) => updateField("address", v)}
            placeholder="Your residential address"
          />
          <div>
            <label className="block text-xs uppercase font-semibold text-ink-mid tracking-wider mb-1">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => updateField("gender", e.target.value)}
              className="w-full rounded-xl border border-card-border px-4 py-2.5 text-sm text-forest bg-white focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-all"
            >
              <option value="">Select gender</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
              <option value="null">Other</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red/5 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <button
            onClick={() => createAccount()}
            disabled={!isComplete || isPending}
            className="w-full py-3 rounded-full bg-teal text-white font-bold hover:bg-teal/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-2"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Submitting...
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs uppercase font-semibold text-ink-mid tracking-wider mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-xl border border-card-border px-4 py-2.5 text-sm text-forest bg-white focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-all"
      />
    </div>
  );
}
