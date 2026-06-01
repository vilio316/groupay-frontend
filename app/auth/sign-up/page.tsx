"use client";

import { EyeIcon, ShieldIcon, UsersIcon } from "@phosphor-icons/react/dist/ssr";
import { CreditCardIcon } from "@phosphor-icons/react/dist/ssr";
import { soraClass } from "@/app/fonts";
import Link from "next/link";
import { signUp, signIn } from "@/lib/authClient";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isPasswordShown, togglePasswordShow] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-10">
      <div className="w-full max-w-125 ">
        <div className="md:mb-8 mb:mt-4">
          <p className={`text-3xl ${soraClass} font-bold text-forest mb-2`}>
            Create Account
          </p>
          <p className="font-semibold text-ink-mid">
            Already have one?{" "}
            <Link href="/auth/sign-in" className="hover:text-green text-teal">
              Log in →{" "}
            </Link>
          </p>
        </div>

        <div className="oauth-buttons flex gap-3 my-4 md:mb-6">
          <button
            className="oauth-btn flex-1 flex items-center justify-center gap-2 rounded-[10px] border border-solid border-card-border font-semibold text-ink cursor-pointer hover:border-mist transition-all hover: shadow-sm hover:shadow-teal/25 p-3"
            onClick={async () => {
              const data = await signIn.social(
                {
                  provider: "google",
                },
                {
                  onSuccess: () => redirect("/dashboard"),
                },
              );
            }}
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>

          <button className="oauth-btn  flex-1 flex items-center justify-center gap-2 rounded-[10px] border border-solid border-card-border font-semibold text-ink cursor-pointer hover:border-mist transition-all hover: shadow-sm hover:shadow-teal/25 p-3">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4.5 h-4.5"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Apple
          </button>
        </div>

        <div className="divider text-center flex items-center gap-2 text-sm mb-4 text-ink-mid before:h-0.5 before:bg-card-border/65 after:h-0.5 after:bg-card-border/65 before:flex-1 after:flex-1">
          or sign up with email
        </div>

        <form id="signUp">
          <div className="grid md:grid-cols-2 gap-x-2">
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="uppercase block text-sm font-semibold text-forest mb-1.5"
              >
                First name
              </label>
              <input
                className="h-12 px-3 outline-none transition-colors placeholder:text-[#bobec5] focus:border-green border border-card-border rounded-xl"
                type="text"
                id="firstName"
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Amara"
                autoComplete="given-name"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="uppercase block text-sm font-semibold text-forest mb-1.5"
              >
                Last name
              </label>
              <input
                className="h-12 px-3 outline-none transition-colors placeholder:text-[#bobec5] focus:border-green border border-card-border rounded-xl"
                type="text"
                id="lastName"
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Okafor"
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="field mb-4">
            <label
              htmlFor="email"
              className="uppercase block text-sm font-semibold text-forest mb-1.5"
            >
              Email address
            </label>
            <input
              className="h-12 px-3 w-full outline-none transition-colors placeholder:text-[#bobec5] focus:border-green border border-card-border rounded-xl"
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="amara@example.com"
              autoComplete="email"
            />
          </div>

          <div className=" mb-4 ">
            <label
              htmlFor="phone"
              className="text-forest mb-1.5 uppercase block text-sm font-semibold"
            >
              Phone number{" "}
              <span className="text-ink-mid font-medium ">(optional)</span>
            </label>
            <input
              className="h-12 px-3 w-full outline-none transition-colors placeholder:text-[#bobec5] focus:border-green border border-card-border rounded-xl"
              type="tel"
              id="phone"
              placeholder="+234 800 000 0000"
              autoComplete="tel"
            />
          </div>

          <div className=" mb-4">
            <label
              htmlFor="password"
              className=" text-forest mb-1.5 uppercase block text-sm font-semibold"
            >
              Password
            </label>
            <div className="password-wrap relative">
              <input
                className="h-12 px-11 w-full outline-none transition-colors placeholder:text-[#bobec5] focus:border-green border border-card-border rounded-xl"
                type={isPasswordShown ? `text` : "password"}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-pw"
                aria-label="Show/hide password"
              >
                <EyeIcon
                  weight="light"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 flex border-0 h-4.5 w-4.5"
                  onClick={() => togglePasswordShow(!isPasswordShown)}
                />
              </button>
            </div>
          </div>

          <div>
            <div className="checkbox-field flex items-start justify-center gap-2.5 mb-6">
              <input type="checkbox" id="terms" className="h-5 w-5" />
              <label htmlFor="terms">
                I have read and agree to GrouPay's Terms of Use and Privacy
                Policy
              </label>
            </div>

            <div className="checkbox-field flex items-start justify-center gap-2.5 mb-6">
              <input type="checkbox" id="updates" className="h-5 w-5" />
              <label htmlFor="updates">
                Send me product updates and money-saving tips (unsubscribe
                anytime)
              </label>
            </div>
          </div>

          <button
            onClick={async (e) => {
              e.preventDefault();
              await signUp.email(
                { email, password, name: `${firstName} ${lastName}` },
                {
                  onSuccess: () => redirect("/auth/sign-in"),
                },
              );
            }}
            type="button"
            className="submit-btn h-13 w-full rounded-full bg-green text-white font-bold hover:bg-[#3db029] hover:-translate-y-px flex  hover:shadow-sm hover:shadow-card-border/40 items-center justify-center gap-2 "
          >
            <UsersIcon weight="light" />
            Create my account
          </button>
        </form>

        <div className="trust-row flex items justify-center gap-3 mt-6 pt-4">
          <div className="trust-item flex items-center gap-1 text-sm text-ink-mid">
            <ShieldIcon className="h-6 w-6" weight="bold" />
            256-bit encrypted
          </div>

          <div className="trust-item flex items-center gap-1 text-sm text-ink-mid">
            <CreditCardIcon className="h-6 w-6" weight="bold" />
            Free forever
          </div>
        </div>
      </div>
    </div>
  );
}
