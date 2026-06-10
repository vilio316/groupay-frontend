"use client";
import { soraClass } from "@/app/fonts";
import { useSession } from "@/lib/authClient";
import {
  UsersThreeIcon,
  CreditCardIcon,
  BasketIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

export default function PlanCreationClient({ clusters }: { clusters: any[] }) {
  const [clusterId, updateClusterId] = useState(clusters[0].id);
  const [planDesc, updatePlanDesc] = useState("");
  const [planName, updatePlanName] = useState("");
  const [type, alterType] = useState("subscription");
  const [minimumContribution, updateMinimum] = useState("");
  const { data } = useSession();

  async function createPlan(e: any) {
    e.preventDefault();
    await fetch(`http://localhost:3000/clusters/${clusterId}/plans`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        desc: planDesc,
        memberIds: [data?.user.id],
        name: planName,
        planType: type,
        minimumContribution: minimumContribution,
      }),
      method: "POST",
    });
  }

  return (
    <>
      <div className="py-4 px-6 border-4 border-card-border place-self-center w-3/4 shadow-card-border shadow-2xl rounded-xl md:min-h-3/4">
        <p
          className={`${soraClass} font-bold text-2xl my-4 text-green flex gap-2`}
        >
          <UsersThreeIcon weight="duotone" />
          Create A New Plan
        </p>
        <div>
          <form onSubmit={createPlan}>
            <label
              htmlFor="clusterFunct"
              className="font-semibold text-sm text-ink-mid block my-2 uppercase"
            >
              plan Name
            </label>
            <input
              type="text"
              required
              id="planFunct"
              onChange={(e) => updatePlanName(e.target.value)}
              autoFocus
              placeholder="The name of your plan"
              className="w-3/4 block mb-4 mt-2 p-2 indent-4 border-card-border border-2 rounded-[10px] outline-none focus:border-green"
            />

            <label
              htmlFor="clusterFunct"
              className="font-semibold text-sm text-ink-mid block my-2 uppercase"
            >
              parent cluster
            </label>
            <select
              className="p-2 outline-none border border-card-border rounded-[10px] w-4/5"
              onChange={(e) => updateClusterId(e.target.value)}
            >
              {clusters.map((cluster) => (
                <option key={cluster.id} value={cluster.id}>
                  {cluster.name} - {cluster.id}
                </option>
              ))}
            </select>

            <div className="my-3">
              <label className="font-semibold text-sm text-ink-mid block my-3 uppercase">
                {" "}
                What's this plan for?
              </label>
              <div className="flex items-center gap-x-4  group border border-card-border md:w-3/5 w-full my-4 p-2 rounded-xl hover:border-2 hover:border-green hover:translate-y-0.5 transition-all duration-75">
                <input
                  type="radio"
                  name="purpose"
                  id="subs"
                  value={"subscription"}
                  required
                  onChange={(e) => alterType(e.target.value)}
                />
                <label htmlFor="subs">
                  <div className="flex gap-x-3 items-center">
                    <CreditCardIcon
                      weight="duotone"
                      className="fill-green w-6 h-6"
                    />
                    <p className="text-xl">Subscriptions </p>
                  </div>
                  <p>
                    For recurring local and international payments. Comes with a
                    virtual card
                  </p>
                </label>
              </div>

              <div className="flex items-center gap-x-4 group border border-card-border p-2 rounded-xl hover:border-2 hover:border-green hover:translate-y-0.5 transition-all duration-75 md:w-3/5 w-full">
                <input
                  type="radio"
                  name="purpose"
                  id="general"
                  required
                  value={"general"}
                  onChange={(e) => alterType(e.target.value)}
                />
                <label htmlFor="general">
                  <div className="flex gap-x-3 items-center">
                    <BasketIcon
                      className="w-6 h-6 fill-green"
                      weight="duotone"
                    />
                    <p className="text-xl">General Purpose</p>
                  </div>
                  <p>
                    Multipurpose cash bucket suitable for collections, savings
                    or long-term holdings
                  </p>
                </label>
              </div>
            </div>
            <label
              htmlFor="planFunct"
              className="font-semibold text-sm text-ink-mid block my-3 uppercase"
            >
              plan Description
            </label>
            <input
              type="text"
              required
              onChange={(e) => updatePlanDesc(e.target.value)}
              id="planDesc"
              placeholder="A brief description for the members of your plan..."
              className="w-3/4 block mb-4 p-2 indent-4 border-card-border focus:border-green border-2 rounded-[10px] outline-none"
            />

            <label
              htmlFor="planFunct"
              className="font-semibold text-sm text-ink-mid block my-3 uppercase"
            >
              minimum contribution
            </label>
            <input
              type="number"
              required
              min={100}
              step={100}
              max={100000}
              onChange={(e) => updateMinimum(e.target.value)}
              id="planDesc"
              placeholder="Minimum contribution amount"
              className="w-3/4 block mb-4 p-2 indent-4 border-card-border focus:border-green border-2 rounded-[10px] outline-none"
            />

            <button
              className="text-white flex gap-x-2 bg-green items-center p-3 rounded-[10px] font-bold text-center uppercase hover:bg-greener hover:translate-y-px transition-all"
              type="submit"
            >
              Create plan
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
