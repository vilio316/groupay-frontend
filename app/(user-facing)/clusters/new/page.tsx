"use client";

import { useState } from "react";
import ClusterCreateSuccessCard from "@/app/components/ClusterCreateStatusCards";
import SpinnerLoader from "@/app/components/SpinnerLoader";
import { soraClass } from "@/app/fonts";
import { UsersThreeIcon } from "@phosphor-icons/react";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/authClient";

export default function NewClusterPage() {
  const { data } = useSession();
  const [clusterName, updateClusterName] = useState("");
  const [clusterDesc, updateClusterDesc] = useState("");

  async function createCluster() {
    await fetch("http://localhost:3000/clusters", {
      method: "POST",
      body: JSON.stringify({
        name: clusterName,
        desc: clusterDesc,
        memberIds: [data?.user.id],
      }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const queryClient = new QueryClient();

  const {
    isPending: isCreating,
    mutateAsync: create,
    isSuccess,
  } = useMutation({
    mutationFn: createCluster,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["userClusters"],
      });
    },
  });

  return (
    <>
      {!isSuccess ? (
        <div className="py-4 px-6 border-4 border-card-border place-self-center w-3/4 shadow-card-border shadow-2xl rounded-xl md:min-h-1/2">
          <p
            className={`${soraClass} font-bold text-2xl my-4 text-green flex gap-2`}
          >
            <UsersThreeIcon weight="duotone" />
            Create A New Cluster
          </p>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                create();
              }}
            >
              <label
                htmlFor="clusterFunct"
                className="font-semibold text-sm text-ink-mid block my-2 uppercase"
              >
                Cluster Name
              </label>
              <input
                type="text"
                id="clusterFunct"
                autoFocus
                required
                onChange={(e) => updateClusterName(e.target.value)}
                placeholder="The name of your cluster"
                className="w-3/4 block mb-4 mt-2 p-2 indent-4 border-card-border border-2 rounded-[10px] outline-none focus:border-green"
              />

              <label
                htmlFor="clusterFunct"
                className="font-semibold text-sm text-ink-mid block my-3 uppercase"
              >
                Cluster Description
              </label>
              <input
                type="text"
                id="clusterDesc"
                required
                onChange={(e) => updateClusterDesc(e.target.value)}
                placeholder="A brief description for the members of your cluster..."
                className="w-3/4 block mb-4 p-2 indent-4 border-card-border focus:border-green border-2 rounded-[10px] outline-none"
              />

              <button
                className="text-white flex gap-x-2 bg-green items-center p-3 rounded-[10px] font-bold text-center uppercase hover:bg-greener hover:translate-y-px transition-all"
                type="submit"
              >
                {isCreating ? (
                  <span className="flex gap-x-4">
                    <SpinnerLoader />
                    <span>Creating Cluster...</span>
                  </span>
                ) : (
                  "Create Cluster"
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <ClusterCreateSuccessCard clusterName={clusterName} />
      )}
    </>
  );
}
