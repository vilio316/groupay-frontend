import { useQuery } from "@tanstack/react-query";

import { clusterDetailsType } from "../(user-facing)/cluster/[id]/ClusterDetailsClient";
import { PlanDetails } from "../(user-facing)/cluster/[id]/ClusterDetailsClient";

async function fetchCluster(id: string) {
  const clusterDetailsRequest = await fetch(
    `http://localhost:3000/clusters/${id}`,
    {
      credentials: "include",
    },
  );
  const clusterDetailsResponse: clusterDetailsType =
    await clusterDetailsRequest.json();
  return clusterDetailsResponse;
}

export const useClusterDetails = (id: string) => {
  const {
    data: clusterDetailsResponse,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["cluster", id],
    queryFn: async () => await fetchCluster(id),
    staleTime: 1 * 60 * 60 * 1000,
  });

  return { clusterDetailsResponse, isSuccess, isLoading };
};

async function fetchPlan(clusterId: string, planId: string) {
  const planDetailsRequest = await fetch(
    `http://localhost:3000/clusters/${clusterId}/plans/${planId}`,
  );
  const planDetailsResponse: PlanDetails = await planDetailsRequest.json();
  return planDetailsResponse;
}

export const usePlanDetails = (clusterId: string, planId: string) => {
  const {
    data: planResponse,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["plan", planId],
    queryFn: async () => await fetchPlan(clusterId, planId),
    staleTime: 1 * 60 * 60 * 1000,
  });

  return { planResponse, isSuccess, isLoading };
};
