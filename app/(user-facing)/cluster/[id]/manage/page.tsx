"use client";

import { soraClass } from "@/app/fonts";
import {
  ArrowLeftIcon,
  TrashIcon,
  CrownIcon,
  UsersThreeIcon,
  CalendarBlankIcon,
  IdentificationCardIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/authClient";
import { useClusterDetails } from "@/app/hooks/queryHooks";
import { makeDate } from "@/app/(user-facing)/notifications/page";
import { CardSkeleton, ListSkeleton } from "@/app/components/Spinner";
import InlineError from "@/app/components/InlineError";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ManageClusterPage() {
  const { id } = useParams();
  const router = useRouter();
  const clusterId = String(id);
  const queryClient = useQueryClient();

  const { data: session } = useSession();
  const {
    clusterDetailsResponse,
    isSuccess,
    isLoading,
    clusterDetailsError,
    refetchCluster,
  } = useClusterDetails(clusterId);

  const currentMember = clusterDetailsResponse?.members.find(
    (m) => m.user.id === session?.user?.id,
  );
  const isOwner = currentMember?.role === "owner";

  const [confirmState, setConfirmState] = useState<{
    type: "delete-cluster" | "remove-member";
    userId?: string;
    userName?: string;
  } | null>(null);

  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/${clusterId}/members/${userId}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to remove member");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cluster", clusterId] });
    },
    onSettled: () => {
      setConfirmState(null);
    },
  });

  const deleteClusterMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/${clusterId}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete cluster");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-clusters"] });
      router.push("/dashboard");
    },
    onSettled: () => {
      setConfirmState(null);
    },
  });

  const mutationError =
    removeMemberMutation.error || deleteClusterMutation.error;

  if (clusterDetailsError) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <InlineError
          message="Could not load cluster details"
          retry={refetchCluster}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="h-6 bg-mist/20 rounded animate-pulse w-1/3" />
        <CardSkeleton />
        <ListSkeleton rows={4} />
      </div>
    );
  }

  if (!isSuccess || !clusterDetailsResponse) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <InlineError message="Cluster not found" retry={refetchCluster} />
      </div>
    );
  }

  return (
    <div className="min-h-full p-3 md:p-6 mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Link
          href={`/cluster/${clusterId}`}
          className="md:w-9 md:h-9 h-6 w-6 rounded-full border border-card-border flex items-center justify-center hover:bg-mist/30 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 text-ink-mid" weight="bold" />
        </Link>
        <h1 className={`${soraClass} text-xl font-bold text-forest-text`}>
          Manage Cluster
        </h1>
      </div>

      {mutationError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red/20 text-red text-sm">
          {mutationError.message}
        </div>
      )}

      {!isOwner ? (
        <div className="bg-white border border-card-border rounded-xl shadow-card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 mx-auto flex items-center justify-center mb-4">
            <WarningCircleIcon
              className="w-8 h-8 text-amber-600"
              weight="fill"
            />
          </div>
          <h2
            className={`${soraClass} text-lg font-bold text-forest-text mb-2`}
          >
            Access Restricted
          </h2>
          <p className="text-sm text-ink-mid max-w-sm mx-auto">
            Only the cluster owner can access the management panel. Contact the
            cluster owner to make changes.
          </p>
        </div>
      ) : (
        <>
          {/* Cluster Details */}
          <section className="bg-white border border-card-border rounded-xl shadow-card p-5">
            <h2
              className={`${soraClass} text-base font-bold text-forest-text mb-4 flex items-center gap-2`}
            >
              <IdentificationCardIcon
                className="w-5 h-5 text-green"
                weight="fill"
              />
              Cluster Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-ink-mid text-xs uppercase tracking-wider font-semibold">
                  Name
                </span>
                <p className="text-forest-text font-medium mt-0.5">
                  {clusterDetailsResponse.name || "Untitled"}
                </p>
              </div>
              {clusterDetailsResponse.desc && (
                <div className="sm:col-span-2">
                  <span className="text-ink-mid text-xs uppercase tracking-wider font-semibold">
                    Description
                  </span>
                  <p className="text-forest-text mt-0.5">
                    {clusterDetailsResponse.desc}
                  </p>
                </div>
              )}
              <div>
                <span className="text-ink-mid text-xs uppercase tracking-wider font-semibold">
                  Account Number
                </span>
                <p className="text-forest-text font-medium mt-0.5 font-mono">
                  {clusterDetailsResponse.accountNumber || "Not set"}
                </p>
              </div>
              <div>
                <span className="text-ink-mid text-xs uppercase tracking-wider font-semibold">
                  Created
                </span>
                <p className="text-forest-text font-medium mt-0.5 flex items-center gap-1.5">
                  <CalendarBlankIcon className="w-4 h-4 text-ink-mid" />
                  {makeDate(clusterDetailsResponse.createdAt)}
                </p>
              </div>
              <div>
                <span className="text-ink-mid text-xs uppercase tracking-wider font-semibold">
                  Members
                </span>
                <p className="text-forest-text font-medium mt-0.5">
                  {clusterDetailsResponse.members.length}
                </p>
              </div>
              <div>
                <span className="text-ink-mid text-xs uppercase tracking-wider font-semibold">
                  Plans
                </span>
                <p className="text-forest-text font-medium mt-0.5">
                  {clusterDetailsResponse.plans.length}
                </p>
              </div>
            </div>
          </section>

          {/* Members */}
          <section className="bg-white border border-card-border rounded-xl shadow-card p-5">
            <h2
              className={`${soraClass} text-base font-bold text-forest-text mb-4 flex items-center gap-2`}
            >
              <UsersThreeIcon className="w-5 h-5 text-green" weight="fill" />
              Members ({clusterDetailsResponse.members.length})
            </h2>
            <div className="space-y-1">
              {clusterDetailsResponse.members.map((member) => {
                const isMemberOwner = member.role === "owner";
                const name = member.user.name || "Unknown";
                const emailName = member.user.email.split("@")[0];
                const isRemoving =
                  removeMemberMutation.isPending &&
                  removeMemberMutation.variables === member.userId;

                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-mist/20 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#8bd7d2] flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {name
                        .split(" ")
                        .filter(Boolean)
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-forest-text truncate">
                        {name}
                      </p>
                      <p className="text-xs text-ink-mid truncate">
                        @{emailName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isMemberOwner && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[9999px] text-[11px] font-semibold bg-amber-100 text-amber-800">
                          <CrownIcon className="w-3 h-3" weight="bold" />
                          Owner
                        </span>
                      )}
                      {!isMemberOwner && (
                        <button
                          onClick={() =>
                            setConfirmState({
                              type: "remove-member",
                              userId: member.userId,
                              userName: name,
                            })
                          }
                          disabled={isRemoving}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-ink-mid hover:bg-red-50 hover:text-red transition-colors disabled:opacity-40"
                          title={`Remove ${name}`}
                        >
                          {isRemoving ? (
                            <span className="w-4 h-4 border-2 border-ink-mid border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <TrashIcon className="w-4 h-4" weight="bold" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Danger Zone */}
          <section className="border border-red/20 rounded-xl shadow-card p-5 bg-red-50/50">
            <h2
              className={`${soraClass} text-base font-bold text-red mb-1 flex items-center gap-2`}
            >
              <WarningCircleIcon className="w-5 h-5" weight="fill" />
              Danger Zone
            </h2>
            <p className="text-xs text-ink-mid mb-4">
              Irreversible actions for this cluster.
            </p>
            <button
              onClick={() => setConfirmState({ type: "delete-cluster" })}
              disabled={deleteClusterMutation.isPending}
              className="flex items-center gap-2 h-11 px-5 rounded-[9999px] border border-red/30 text-red text-sm font-semibold hover:bg-red hover:text-white transition-colors disabled:opacity-40"
            >
              {deleteClusterMutation.isPending ? (
                <span className="w-4 h-4 border-2 border-red border-t-transparent rounded-full animate-spin" />
              ) : (
                <TrashIcon className="w-4 h-4" weight="bold" />
              )}
              Delete this cluster
            </button>
          </section>
        </>
      )}

      {/* Confirm Delete Cluster */}
      <ConfirmDialog
        open={confirmState?.type === "delete-cluster"}
        title="Delete Cluster?"
        message="This will permanently delete the cluster, all its plans, transactions, and member associations. This action cannot be undone."
        confirmLabel={
          deleteClusterMutation.isPending ? "Deleting..." : "Delete Cluster"
        }
        onConfirm={() => deleteClusterMutation.mutate()}
        onCancel={() => setConfirmState(null)}
      />

      {/* Confirm Remove Member */}
      <ConfirmDialog
        open={confirmState?.type === "remove-member"}
        title={`Remove ${confirmState?.userName || "member"}?`}
        message="This member will be removed from the cluster and all its plans. They can be re-invited later."
        confirmLabel={
          removeMemberMutation.isPending ? "Removing..." : "Remove"
        }
        onConfirm={() => {
          if (confirmState?.userId) {
            removeMemberMutation.mutate(confirmState.userId);
          }
        }}
        onCancel={() => setConfirmState(null)}
      />
    </div>
  );
}
