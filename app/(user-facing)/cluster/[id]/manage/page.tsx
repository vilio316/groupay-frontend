"use client";
import { soraClass } from "@/app/fonts";
import { ManagerViewCategory, ManagerViewItem } from "./ManagerViewItem";
import {
  ArticleIcon,
  CreditCardIcon,
  GearIcon,
  HandCoinsIcon,
  MoneyWavyIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { clusterDetailsType, PlanDetails } from "../ClusterDetailsClient";
import { useClusterDetails } from "@/app/hooks/queryHooks";
import { makeDate } from "@/app/(user-facing)/notifications/page";
import PlanCard from "@/app/components/PlanCard";

export default function ManageClusterPage() {
  const [activeTabs, updateActiveTabs] = useState<string[]>([]);
  const { id } = useParams();
  const { clusterDetailsResponse, isSuccess, isLoading } = useClusterDetails(
    String(id),
  );

  const handleCategoryClick = (category: string) => {
    if (activeTabs.includes(category)) {
      const popped = activeTabs.filter((cat) => cat !== category);
      updateActiveTabs(popped);
    } else {
      updateActiveTabs([...activeTabs, category]);
    }
  };

  const managerViewItems: ManagerViewItem[] = [
    {
      categoryName: "Members",
      icon: <UsersThreeIcon className="text-2xl" weight="duotone" />,
      childElement: <MembersChild />,
      count: clusterDetailsResponse?.members.length,
    },
    {
      categoryName: "Plans",
      icon: <ArticleIcon className="text-2xl" weight="duotone" />,
      childElement: <PlansChild plansObj={clusterDetailsResponse?.plans} />,
      count: clusterDetailsResponse?.plans.length,
    },
    {
      categoryName: "Transactions",
      icon: <MoneyWavyIcon className="text-2xl" weight="duotone" />,
    },
    {
      categoryName: "Requests",
      icon: <HandCoinsIcon className="text-xl" weight="duotone" />,
    },
    {
      categoryName: "Cards",
      icon: <CreditCardIcon className="text-xl" weight="duotone" />,
    },
  ];

  return (
    <>
      {isSuccess && clusterDetailsResponse && (
        <div className="p-4 mx-4 border-2 border-card-border rounded-xl">
          <div className="flex gap-x-4">
            <p
              className={`${soraClass} p-1 my-2 text-3xl text-green w-1/2 font-bold`}
            >
              <Link href="./">{clusterDetailsResponse.name}</Link> (Manager View
              )
            </p>
            <div className="grid justify-end text-end w-1/2">
              <p className="uppercase text-ink-mid text-sm font-bold">
                Cluster Balance:{" "}
              </p>
              <p className={`${soraClass} text-2xl font-bold my-2 text-green`}>
                {" "}
                &#8358;{(102345.69).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="p-2 mx-auto">
            <div className="flex gap-x-4 items-center">
              <img
                src={"/family.jpg"}
                className="rounded-full p-2 h-24 w-24 object-cover shadow-xl shadow-card-border"
              />
              <div>
                <p className={`${soraClass} text-xl font-bold`}>
                  Cluster Details
                </p>
                <p>Name: {clusterDetailsResponse.name}</p>
                <p>
                  Date of Creation: {makeDate(clusterDetailsResponse.createdAt)}
                </p>
                <p>
                  <u>Account Number:</u>{" "}
                  {clusterDetailsResponse.accountNumber || (
                    <span className="flex gap-x-4 items-center">
                      <span>UNAVAILABLE</span>
                      <button className="p-2 rounded-2xl font-bold uppercase bg-green text-white hover:bg-greener">
                        Generate
                      </button>
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="content my-4">
              {managerViewItems.map((item) => (
                <ManagerViewCategory
                  key={item.categoryName}
                  obj={item}
                  array={activeTabs}
                  click={() => handleCategoryClick(item.categoryName)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {isLoading && <p>Loading...</p>}
    </>
  );
}

function MembersChild() {
  return (
    <div className="">
      <p>fahh!</p>
    </div>
  );
}

function PlansChild({ plansObj }: { plansObj?: PlanDetails[] }) {
  return (
    <div className="flex overflow-x-scroll gap-6">
      {plansObj?.map((plan) => (
        <PlanCard planObject={plan} key={plan.id} />
      ))}
    </div>
  );
}
