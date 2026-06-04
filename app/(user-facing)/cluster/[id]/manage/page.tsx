"use client";
import { soraClass } from "@/app/fonts";
import { MemberCard } from "../members/page";
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
import PlanCard from "@/app/components/PlanCard";
import Link from "next/link";
export default function ManageClusterPage() {
  const [activeTabs, updateActiveTabs] = useState<string[]>([]);

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
      count: 22,
    },
    {
      categoryName: "Plans",
      icon: <ArticleIcon className="text-2xl" weight="duotone" />,
      childElement: <PlansChild />,
      count: 3,
    },
    {
      categoryName: "Settings",
      icon: <GearIcon className="text-2xl" weight="duotone" />,
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
    <div className="p-4 mx-4 border-2 border-card-border rounded-xl">
      <div className="flex gap-x-4">
        <p
          className={`${soraClass} p-1 my-2 text-3xl text-green w-1/2 font-bold`}
        >
          <Link href="./">ClusterName</Link> / Manager View
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
            <p className={`${soraClass} text-xl font-bold`}>Cluster Details</p>
            <p>Name: ClusterName</p>
            <p>Date of Creation: 22 Feb 3004</p>
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
  );
}

function MembersChild() {
  return (
    <div className="">
      <p>fahh!</p>
    </div>
  );
}

function PlansChild() {
  return (
    <div className="flex overflow-x-scroll gap-6">
      <p>heh</p>
    </div>
  );
}
