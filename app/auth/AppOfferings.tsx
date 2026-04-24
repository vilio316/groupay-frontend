"use client";

import { CheckCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { sora } from "../fonts";

export function AppOfferings() {
  const benefitList = [
    "Split any bill equally: by percentage or by custom amounts",
    "Pool money towards shared goals with progress tracking",
    "Smart reminders — no more 'hey, you still owe me...' texts",
    "Settle quickly with simplified debt calclulations and transfers",
    "Transparent payments — no hidden charges or unexpected fees",
  ];

  const Benefit = ({
    icon,
    benefitText,
  }: {
    icon: React.ReactNode;
    benefitText: string;
  }) => {
    return (
      <div className="flex md:gap-4 sm:gap-3">
        <div>{icon}</div>
        <div>{benefitText}</div>
      </div>
    );
  };

  return (
    <div
      className="flex flex-col justify-between
    relative overflow-hidden items-center bg-forest text-white p-12 before:absolute before:w-125 before:h-125 before:-top-25 before:-right-25 after:absolute after:w-87.5 after:h-87.5 after:-bottom-20 after:-left-20 before:bg-radial before:from-green/15 before:to-transparent before:to-70% after:bg-radial after:from-teal/10 after:to-transparent after:to-70% min-h-screen"
    >
      <div className="h-full content-center">
        <Link
          href="/"
          className={`panel-logo ${sora.className} flex gap-x-3 items-center font-bold text-2xl`}
        >
          <div className="logo-mark w-9 h-9 bg-green flex justify-center items-center rounded-[10px]">
            <svg viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4zm-1 3v4l3.5 2-.7 1.2L8 12.2V7h1z" />
            </svg>
          </div>
          GrouPay
        </Link>

        <div className="panel-hero relative z-1">
          <p
            className={`md:text-4xl ${sora.className} font-bold md:my-4 text-white tracking-tight`}
          >
            All things money, done{" "}
            <span className="text-green">together.</span>{" "}
          </p>
          <p className="text-mist md:mb-9 md:text-[15px]/1.7">
            Join other users who have replaced awkward conversations and
            reminders with effortless clicks
          </p>
          <div className="benefitList flex flex-col gap-3.5">
            {benefitList.map((benefit) => (
              <Benefit
                icon={
                  <CheckCircleIcon
                    weight="fill"
                    className="w-6 h-6 inline fill-green"
                  />
                }
                benefitText={benefit}
              />
            ))}
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
