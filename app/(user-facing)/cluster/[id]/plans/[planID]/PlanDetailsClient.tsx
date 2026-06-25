"use client";
import Avatars from "@/app/components/AvatarsCircles";
import PaymentModal from "@/app/components/PaymentModal";
import { TransactionBlock } from "@/app/components/TransactionStatusBlocks";
import { soraClass } from "@/app/fonts";
import { CheckCircleIcon, HandDepositIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { getSession, useSession } from "@/lib/authClient";
import { PlanDetails } from "../../ClusterDetailsClient";
import { useParams } from "next/navigation";
import { redirect } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function PlanPage({ planObj }: { planObj: PlanDetails }) {
  const [isPaying, updatePaymentStatus] = useState(false);
  const { data } = useSession();
  const userId = data?.user.id;
  const params = useParams();

  async function handlePlanMembership(isMember: boolean) {
    if (!isMember) {
      const { data } = await getSession();
      const addReq = await fetch(
        `http://localhost:3000/clusters/${params.id}/plans/${params.planID}/members`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            userId: String(data?.user.id),
          }),
        },
      );
    } else {
      await fetch(
        `http://localhost:3000/clusters/${params.id}/plans/${params.planID}/members/${userId}`,
        {
          credentials: "include",
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  }

  async function sendJoinNotification(id: string) {
    const { data } = await getSession();
    const userId = data?.user.id;

    if (id !== userId) {
      await fetch(`http://localhost:3000/notifications`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          senderId: userId,
          recipientId: id,
          type: "join",
          message: `${data?.user.name} joined your plan`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  const queryClient = useQueryClient();
  const { isPending, mutateAsync: handleMembership } = useMutation({
    mutationFn: async () => {
      await handlePlanMembership(userDetailsInCluster);
      await sendJoinNotification(members[0].userId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["userPlans"],
      });
      redirect("/plans");
    },
  });

  const [hasContributed] = useState(false);

  const userDetails = planObj.members.filter(
    (member) => member.user.id === userId,
  );
  const userDetailsInCluster = userDetails.length > 0;

  const { name, desc, minimumContribution, id, members } = planObj;
  return (
    <div className="md:px-4 px-2 md:my-2 my-1 mx-auto">
      <div className="flex items-center">
        <div className="w-4/5 p-2">
          <p
            className={`
                ${soraClass} my-3 font-bold text-green text-3xl
                `}
          >
            {planObj ? name : "PlanName"}
          </p>
          <span className="text-right uppercase bg-aqua/40 rounded-full p-2 text-ink-mid text-[11px]">
            Subscription
          </span>
        </div>

        <div className="w-1/5 flex justify-end p-1 gap-x-4 shrink-0">
          <button
            onClick={() => handleMembership()}
            className={`rounded-xl p-2 uppercase w-full text-red ${userDetailsInCluster ? `border border-red hover:bg-red` : `bg-teal text-white`} hover:text-white hover:scale-105 transition-all shrink-0`}
          >
            {!isPending && userDetailsInCluster && "Exit Plan"}
            {!isPending && !userDetailsInCluster && "Join"}
            {isPending && "Processing..."}
          </button>
        </div>
      </div>
      <div className="border border-card-border shadow-sm shadow-card-border rounded-xl md:p-4 p-2 my-2">
        <div className="flex gap-x-4 my-2 items-end">
          <p className="uppercase text-ink-mid text-xl font-bold my-2 w-4/5">
            Details
          </p>

          <Link
            href={`../plans/${id}/members`}
            className="flex justify-end p-1 text-end flex-col w-1/5"
          >
            <p className="text-[10px] md:text-sm capitalize text-ink-mid">
              3/6 members paid
            </p>
            <Avatars className="justify-end" members={members} />
          </Link>
        </div>
        <div className="details">
          <div className="flex flex-col md:flex-row gap-x-4 items-center">
            <div className="details-text md:w-4/5 w-full">
              <p>
                Your Contribution Amount: &#8358;{" "}
                {Number(minimumContribution) > 0
                  ? Number(minimumContribution).toLocaleString()
                  : "500"}
              </p>
              <p>Contribution Status: 60%</p>
            </div>

            <div className="md:w-1/5 flex justify-end p-2 w-full">
              <button
                className={`text-white bg-green hover:bg-greener rounded-xl uppercase hover:scale-105 transition-all p-2 flex items-center gap-x-2 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-green disabled:cursor-not-allowed `}
                onClick={() => updatePaymentStatus(true)}
                disabled={hasContributed || !userDetailsInCluster}
              >
                {hasContributed ? (
                  <CheckCircleIcon
                    className="text-white text-xl"
                    weight="bold"
                  />
                ) : (
                  <HandDepositIcon
                    className="text-white text-xl"
                    weight="bold"
                  />
                )}
                {hasContributed ? "Contributed" : "Contribute"}
              </button>
            </div>
          </div>

          <div className="description my-4">
            <p className="uppercase text-ink-mid font-bold text-lg">
              Description
            </p>
            <p className="indent-4 text-justify">
              {desc ? desc : "Plan Desc."}
            </p>
          </div>

          <div className="recentActions my-4">
            <p className="text-ink-mid font-bold uppercase text-lg">
              Recent Transactions
            </p>
            <div className="transactions"></div>
          </div>
        </div>
      </div>
      <PaymentModal
        isShown={isPaying}
        onClick={() => updatePaymentStatus(false)}
        prompter="plan"
      />
    </div>
  );
}
