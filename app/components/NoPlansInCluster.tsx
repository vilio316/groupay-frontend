"use client";

import { ClipboardTextIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { soraClass } from "../fonts";
import Link from "next/link";

export default function NoPlansInCluster({
  clusterId,
}: {
  clusterId: string;
}) {
  return (
    <div className="border border-card-border p-4 my-4 rounded-xl text-center">
      <div className="flex flex-col items-center gap-4 py-4">
        <ClipboardTextIcon
          className="w-16 h-16 text-mist"
          weight="duotone"
        />
        <div>
          <p className={`${soraClass} text-lg font-bold text-forest-text`}>
            No Plans Yet
          </p>
          <p className="text-sm text-ink-mid mt-1 max-w-xs mx-auto leading-relaxed">
            This cluster doesn't have any saving plans yet. Create one to
            help your group reach a shared goal.
          </p>
        </div>
        <Link
          href={`/cluster/${clusterId}/manage`}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-green text-white font-medium text-sm hover:bg-greener transition-all"
        >
          Create Plan
          <ArrowRightIcon className="w-4 h-4" weight="bold" />
        </Link>
      </div>
    </div>
  );
}
