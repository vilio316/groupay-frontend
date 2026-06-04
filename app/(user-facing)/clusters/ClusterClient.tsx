"use client";

import ClusterCard from "@/app/components/ClusterCard";
import { soraClass } from "@/app/fonts";
import { PlusIcon, UsersThreeIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { clusterDetailsType } from "../cluster/[id]/ClusterDetailsClient";

export default function ClusterClient({
  clusterObj,
}: {
  clusterObj: clusterDetailsType[];
}) {
  const hasClusters = true;
  return (
    <div className="min-h-full">
      <div className="flex gap-x-4 my-3 items-center">
        <p
          className={`${soraClass} font-bold text-green text-3xl md:w-4/5 w-3/5`}
        >
          Your Clusters
        </p>{" "}
        <Link
          href={"/clusters/new"}
          className="text-white md:text-lg hover:bg-greener bg-green hover:scale-105 rounded-full p-2 md:p-1 items-center justify-center md:w-1/5 w-auto text-center flex gap-x-4 shrink-0 text-sm"
        >
          <PlusIcon />
          <span>New Cluster</span>
        </Link>
      </div>
      {!hasClusters ? (
        <div className="clusterBody mx-6 p-4 border border-card-border grid justify-center text-center rounded-lg">
          <div className="grid justify-center p-2">
            <UsersThreeIcon
              className="h-18 w-18 fill-green bg-green/20 p-2 rounded-xl"
              weight="duotone"
            />
          </div>
          <p className="text-center text-2xl font-bold my-2">No Clusters Yet</p>
          <p>
            You haven't joined or created any clusters yet. Create your first
            cluster now and add other users too!
          </p>

          <Link
            href="/clusters/new"
            className="flex justify-self-center items-center p-2 gap-x-2 bg-green rounded-xl w-auto my-4 text-white hover:font-bold hover:bg-greener hover:translate-y-0.5 transition-all"
          >
            <PlusIcon weight="bold" />
            Create Cluster
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 gap-3">
          {clusterObj.map((cluster) => (
            <ClusterCard key={cluster.id} valuesObj={cluster} />
          ))}
        </div>
      )}
    </div>
  );
}
