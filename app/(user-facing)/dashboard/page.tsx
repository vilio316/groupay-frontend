"use client";

import { useRef } from "react";
import {
  PlusIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsLeftRightIcon,
} from "@phosphor-icons/react";
import { soraClass } from "../../fonts";
import Link from "next/link";
import {
  EmptyTransaction,
  TransactionBlock,
} from "@/app/components/TransactionStatusBlocks";
import ClusterCard from "@/app/components/ClusterCard";
import { BalanceCard } from "@/app/components/BalanceCard";
import PaymentModal from "@/app/components/PaymentModal";
import OnboardingStatusCard from "@/app/components/OnboardingStatusCard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSession, useSession } from "@/lib/authClient";
import { clusterDetailsType } from "../cluster/[id]/ClusterDetailsClient";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function DashboardPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [showModal, updateModalState] = useState(false);
  const [prompter, updatePrompter] = useState<"add" | "withdraw" | "transfer">(
    "add",
  );
  const { data } = useSession();

  async function fetchClust(id: string) {
    const request = await fetch(`http://localhost:3000/clusters/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    const response: clusterDetailsType = await request.json();
    return response;
  }

  async function eleba() {
    const { data } = await getSession();
    const postReq = await fetch("http://localhost:3000/clusters/myClusters", {
      method: "POST",
      body: JSON.stringify({ userId: data?.user.id }),
      headers: { "Content-Type": "application/json" },
    });
    const postRes = await postReq.json();
    const fetchedClustIds = postRes.map((clust: any) => clust.clusterId);
    const results = await Promise.all(
      fetchedClustIds.map((clust: any) => fetchClust(clust)),
    );
    return results;
  }

  async function getTransactions() {
    const transactionsRequest = await fetch(
      "http://localhost:3000/transactions",
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    const transactionsResponse = await transactionsRequest.json();
    return transactionsResponse;
  }

  const {
    data: clusterResponse,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["userClusters"],
    queryFn: eleba,
    staleTime: 1 * 60 * 60 * 1000,
  });

  const {
    data: transactionData,
    isLoading: isGettingTxns,
    isSuccess: transactionsGotten,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    staleTime: 1 * 60 * 60 * 1000,
  });

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: 0.05,
        });

        tl.fromTo(
          ".dash-greeting",
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
        )
          .fromTo(
            ".dash-balance",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            "-=0.2",
          )
          .fromTo(
            ".dash-quick-actions .action-btn",
            { y: 20, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.4 },
            "-=0.3",
          )
          .fromTo(
            ".dash-onboarding",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            "-=0.2",
          );

        gsap.utils
          .toArray<HTMLElement>(".cluster-card-item")
          .forEach((card) => {
            gsap.fromTo(
              card,
              { x: 30, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.5,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "left 90%",
                  horizontal: false,
                  once: true,
                },
              },
            );
          });

        gsap.utils.toArray<HTMLElement>(".transaction-item").forEach((item) => {
          gsap.fromTo(
            item,
            { x: -24, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.45,
              ease: "power2.out",
              scrollTrigger: { trigger: item, start: "top 92%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>(".section-heading").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            },
          );
        });

        gsap.fromTo(
          ".fab-btn",
          { scale: 0, opacity: 0, rotate: -90 },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: 0.8,
          },
        );

        const refresh = () => ScrollTrigger.refresh();
        document.fonts?.ready.then(refresh);
        window.addEventListener("load", refresh);
        return () => window.removeEventListener("load", refresh);
      }, rootRef);

      return () => ctx.revert();
    },
    { scope: rootRef },
  );

  const firstName = data?.user.name ? data.user.name.split(" ")[0] : "there";

  return (
    <div ref={rootRef} className="min-h-screen bg-[#f7faf7] pb-24">
      <PaymentModal
        isShown={showModal}
        onClick={() => updateModalState(!showModal)}
        prompter={prompter}
      />

      <div className="bg-white border-b border-[#e8efe8] px-6 py-5">
        <div className="dash-greeting opacity-0 flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-ink-mid font-medium mb-0.5">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <h1
              className={`${soraClass} text-2xl font-bold text-forest leading-tight`}
            >
              Good day, <span className="text-green">{firstName}</span> 👋
            </h1>
          </div>
          <Link
            href="#transactions"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-forest border border-teal/30 hover:border-forest/30 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-teal/5"
          >
            Transactions
            <ArrowDownIcon className="w-4 h-4" weight="bold" />
          </Link>
        </div>

        <div className="dash-balance opacity-0">
          <BalanceCard
            payFunct={(string: any) => {
              updateModalState(true);
              updatePrompter(string);
            }}
          />
        </div>

        <div className="dash-quick-actions flex gap-3 mt-4">
          {[
            {
              label: "Add Money",
              type: "add" as const,
              Icon: ArrowDownIcon,
              color:
                "bg-green/10 text-green hover:bg-green hover:text-white border border-green/20",
            },
            {
              label: "Withdraw",
              type: "withdraw" as const,
              Icon: ArrowUpIcon,
              color:
                "bg-teal/10 text-teal hover:bg-teal hover:text-white border border-teal/20",
            },
            {
              label: "Transfer",
              type: "transfer" as const,
              Icon: ArrowsLeftRightIcon,
              color:
                "bg-forest/10 text-forest hover:bg-forest hover:text-white border border-forest/20",
            },
          ].map(({ label, type, Icon, color }) => (
            <button
              key={type}
              onClick={() => {
                updateModalState(true);
                updatePrompter(type);
              }}
              className={`action-btn opacity-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-px hover:shadow-md ${color}`}
            >
              <Icon weight="bold" className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="dash-onboarding opacity-0 px-6 pt-5">
        <OnboardingStatusCard />
      </div>

      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-3">
          <p
            className={`section-heading opacity-0 ${soraClass} font-bold text-forest text-lg`}
          >
            Your Clusters
          </p>
          <Link
            href="/clusters"
            className="section-heading flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-forest transition-colors"
          >
            View all
            <ArrowRightIcon className="w-4 h-4" weight="bold" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-56 h-36 rounded-2xl bg-white border border-[#e8efe8] animate-pulse"
              />
            ))}
          {isSuccess &&
            clusterResponse.map((cluster) => (
              <div
                key={cluster.id}
                className="cluster-card-item opacity-0 shrink-0"
              >
                <ClusterCard valuesObj={cluster} />
              </div>
            ))}
          {isSuccess && clusterResponse.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full py-10 text-center">
              <p className="text-ink-mid text-sm mb-3">No clusters yet</p>
              <Link
                href="/clusters/new"
                className="inline-flex items-center gap-2 bg-green text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-greener transition-all"
              >
                <PlusIcon className="w-4 h-4" /> Create your first cluster
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 mt-7" id="transactions">
        <p
          className={`section-heading ${soraClass} font-bold text-forest text-lg`}
        >
          Recent Transactions
        </p>
        {transactionsGotten &&
          transactionData.length > 0 &&
          transactionData.map((transaction: any) => (
            <TransactionBlock
              transactionObject={transaction}
              key={transaction.id}
            />
          ))}
        {transactionData && transactionData.length === 0 && (
          <EmptyTransaction />
        )}
        {isGettingTxns && <p>Loading transactions...</p>}
        <span className="section-heading opacity-0 text-xs font-semibold text-ink-mid/60 uppercase tracking-wider">
          Last 30 days
        </span>
      </div>

      {/* <div className="flex flex-col gap-2">
          {[
            { status: "success", amount: 4000 },
            { status: "pending", amount: 3450.56 },
            { status: "fail", amount: 4500.56 },
          ].map((tx, i) => (
            <div key={i} className="transaction-item opacity-0">
              <TransactionBlock transactionObject={tx as any} />
            </div>
          ))} 
        </div> */}

      <div className="fixed bottom-8 right-8 z-40">
        <Link
          href="/clusters/new"
          title="Create New Cluster"
          className="fab-btn opacity-0 flex items-center justify-center w-14 h-14 bg-green hover:bg-greener text-white rounded-full shadow-xl shadow-green/30 hover:shadow-2xl hover:shadow-green/40 hover:-translate-y-1 transition-all duration-200"
        >
          <PlusIcon className="w-6 h-6" weight="bold" />
        </Link>
      </div>
    </div>
  );
}
