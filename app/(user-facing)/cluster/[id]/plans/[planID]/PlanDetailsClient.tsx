"use client";
import Avatars from "@/app/components/AvatarsCircles";
import PaymentModal from "@/app/components/PaymentModal";
import { soraClass } from "@/app/fonts";
import {
  CheckCircleIcon,
  HandDepositIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { getSession, useSession } from "@/lib/authClient";
import { PlanDetails } from "../../ClusterDetailsClient";
import { useParams } from "next/navigation";
import { redirect } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useClusterDetails } from "@/app/hooks/queryHooks";
import { makeDate } from "@/app/(user-facing)/notifications/page";
import InlineError from "@/app/components/InlineError";

export default function PlanPage({ planObj }: { planObj: PlanDetails }) {
  const [isPaying, updatePaymentStatus] = useState(false);
  const { data } = useSession();
  const userId = data?.user.id;
  const params = useParams();
  const { clusterDetailsResponse, isLoading, isSuccess, clusterDetailsError, refetchCluster } = useClusterDetails(
    String(params.id),
  );
  const { name, desc, minimumContribution, id, members, planType, dueDate } =
    planObj;

  async function handlePlanMembership(isMember: boolean) {
    if (!isMember) {
      const { data } = await getSession();
      const addReq = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/${params.id}/plans/${params.planID}/members`,
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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/${params.id}/plans/${params.planID}/members/${userId}`,
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
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/notifications`, {
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

  const userDetails = planObj.members.filter(
    (member) => member.user.id === userId,
  );
  const userDetailsInCluster = userDetails.length > 0;

  const planTransactions = planObj.transactions || [];
  const minContribNaira = Number(minimumContribution) || 500;
  const minContribKobo = minContribNaira * 100;

  const memberTotalMap: Record<string, number> = {};
  for (const t of planTransactions) {
    const sid = (t as any).senderId;
    memberTotalMap[sid] =
      (memberTotalMap[sid] || 0) +
      (t.channel.includes("virt") ? t.amount * 100 : (t as any).amount || 0);
  }

  const currentUserTotalKobo = memberTotalMap[userId || ""] || 0;
  const hasContributed = currentUserTotalKobo >= minContribKobo;
  const userPercentPaid =
    minContribKobo > 0
      ? Math.min(100, Math.round((currentUserTotalKobo / minContribKobo) * 100))
      : 0;

  const paidMembers = planObj.members.filter(
    (m) => (memberTotalMap[m.userId] || 0) >= minContribKobo,
  );
  const unpaidMembers = planObj.members.filter(
    (m) => !((memberTotalMap[m.userId] || 0) >= minContribKobo),
  );
  const paidCount = paidMembers.length;
  const totalCount = planObj.members.length;

  if (clusterDetailsError) {
    return (
      <div className="p-4">
        <InlineError
          message="Could not load cluster details"
          retry={refetchCluster}
        />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="flex items-center">
        <div className="md:w-4/5 w-3/5 p-2">
          <p
            className={`
                ${soraClass} md:my-3 my-1 font-bold text-green md:text-3xl text-2xl
                `}
          >
            {planObj ? name : "PlanName"}
          </p>
          <span className="inline-flex items-center px-3 py-1 rounded-[9999px] text-[11px] font-semibold bg-aqua/40 text-ink-mid">
            {planType || "Subscription"}
          </span>
        </div>

        <div className="md:w-1/5 w-2/5 flex justify-end p-1 gap-x-4 shrink-0">
          <button
            onClick={() => handleMembership()}
            className={`rounded-[9999px] px-5 py-2.5 text-sm font-semibold uppercase transition-all shrink-0 ${
              userDetailsInCluster
                ? "border border-red text-red hover:bg-red hover:text-white"
                : "bg-teal text-white hover:bg-teal/90"
            }`}
          >
            {!isPending && userDetailsInCluster && "Exit Plan"}
            {!isPending && !userDetailsInCluster && "Join"}
            {isPending && "Processing..."}
          </button>
        </div>
      </div>
      <div className="border border-card-border shadow-card rounded-xl p-6 my-4 bg-white">
        <div className="flex gap-x-4 my-2 items-end">
          <p className="uppercase text-ink-mid text-xl font-bold my-2 w-4/5">
            Details
          </p>

          <Link
            href={`../plans/${id}/members`}
            className="flex justify-end p-1 text-end flex-col w-1/5"
          >
            <p className="text-xs capitalize text-ink-mid">
              {paidCount}/{totalCount} members paid
            </p>
            <Avatars className="justify-end" members={members} />
          </Link>
        </div>
        <div className="details">
          <div className="flex flex-col md:flex-row gap-x-4 items-center">
            <div className="details-text md:w-4/5 w-full space-y-2">
              <p className="text-forest-text font-semibold">
                Your Contribution Amount: &#8358;{" "}
                {Number(minimumContribution) > 0
                  ? Number(minimumContribution).toLocaleString()
                  : "500"}
              </p>
              <p className="text-ink-mid">
                Contribution Status: {userPercentPaid}%
              </p>
              <p>Due Date: {makeDate(dueDate)}</p>
            </div>

            <div className="md:w-1/5 flex justify-end p-2 w-full">
              <button
                className={`text-white bg-green hover:bg-greener rounded-[9999px] uppercase transition-all px-5 py-2.5 flex items-center gap-2 text-sm font-semibold disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-green disabled:cursor-not-allowed`}
                onClick={() => updatePaymentStatus(true)}
                disabled={hasContributed || !userDetailsInCluster}
              >
                {hasContributed ? (
                  <CheckCircleIcon
                    className="text-white w-4 h-4"
                    weight="bold"
                  />
                ) : (
                  <HandDepositIcon
                    className="text-white w-4 h-4"
                    weight="bold"
                  />
                )}
                {hasContributed ? "Contributed" : "Contribute"}
              </button>
            </div>
          </div>

          <div className="description my-6">
            <p className="uppercase text-ink-mid font-bold text-lg">
              Description
            </p>
            <p className="text-ink mt-2 leading-relaxed">
              {desc ? desc : "Plan Desc."}
            </p>
          </div>

          <div className="recentActions my-4">
            <p className="text-ink-mid font-bold uppercase text-lg">
              Recent Transactions
            </p>
            <div className="transactions">
              {planObj.members.length > 0 && (
                <div className="space-y-3 my-2">
                  <p className="text-sm text-forest-text font-semibold">
                    Payment Status
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {planObj.members.map((member) => {
                      const memberTotalKobo =
                        memberTotalMap[member.userId] || 0;
                      const memberPaidNaira = memberTotalKobo / 100;
                      const metMinimum = memberTotalKobo >= minContribKobo;
                      return (
                        <div
                          key={member.id}
                          className={`flex items-center gap-x-3 p-2 rounded-lg text-sm ${
                            metMinimum ? "bg-green/5" : "bg-red/5"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-green/10 flex items-center justify-center text-green font-bold text-xs uppercase shrink-0">
                            {member.user?.name?.charAt(0) || "?"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-forest-text font-medium text-xs">
                              {member.user?.name || "Unknown"}
                            </p>
                            <p className="text-[10px] text-ink-mid/70">
                              &#8358;{" "}
                              {memberPaidNaira.toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })}{" "}
                              / &#8358; {minContribNaira.toLocaleString()}
                            </p>
                          </div>
                          {metMinimum ? (
                            <CheckCircleIcon
                              className="w-4 h-4 text-green shrink-0"
                              weight="bold"
                            />
                          ) : (
                            <XCircleIcon
                              className="w-4 h-4 text-red shrink-0"
                              weight="bold"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <PaymentModal
        isShown={isPaying}
        onClick={() => updatePaymentStatus(false)}
        prompter="plan"
        planId={id}
        accountNumber={String(clusterDetailsResponse?.accountNumber)}
      />
    </div>
  );
}
