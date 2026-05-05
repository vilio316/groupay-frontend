"use client";
import { soraClass } from "@/app/fonts";
import { MemberCard } from "../members/page";
import { CaretDownIcon } from "@phosphor-icons/react";

export default function ManageClusterPage() {
  return (
    <div className="p-4 mx-4 border-2 border-card-border rounded-xl">
      <div className="flex gap-x-4">
        <p className={`${soraClass} p-1 my-2 text-3xl text-green w-1/2`}>
          Cluster/Manager View
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
            <p className={`${soraClass} text-lg font-bold`}>Cluster Details</p>
            <p>Name: ClusterName</p>
            <p>Members: 22</p>
          </div>
        </div>

        <div className="content">
          <div
            className={`rounded-xl p-3 text-2xl font-bold text-forest ${soraClass} hover:bg-aqua/25 flex items-center gap-x-3 my-2 `}
          >
            <p>Members</p>
            <CaretDownIcon />
          </div>
          <div
            className={`rounded-xl p-3 text-2xl font-bold text-forest ${soraClass} hover:bg-aqua/25 `}
          >
            <p>Plans</p>
            <CaretDownIcon />
          </div>
          <div
            className={`rounded-xl p-2 text-2xl font-bold text-forest ${soraClass}`}
          >
            <p>Settings</p>
            <CaretDownIcon />
          </div>
          <div
            className={`rounded-xl p-2 text-2xl font-bold text-forest ${soraClass}`}
          >
            <p>Transactions</p>
            <CaretDownIcon />
          </div>
          <div
            className={`rounded-xl p-2 text-2xl font-bold text-forest ${soraClass}`}
          >
            <p>Requests</p>
            <CaretDownIcon />
          </div>
          <div
            className={`rounded-xl p-2 text-2xl font-bold text-forest ${soraClass} flex gap-x-4 items-center`}
          >
            <p>Cards</p>
            <CaretDownIcon />
          </div>
        </div>

        {/* <div className="p-2">
          <MemberCard />
          <MemberCard />
          <MemberCard />
          <MemberCard />
          <MemberCard />
          <MemberCard />
        </div> */}
      </div>
    </div>
  );
}
