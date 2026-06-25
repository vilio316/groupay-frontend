import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/authClient";
import type { PlanByUser } from "../(user-facing)/plans/page";

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

async function fetchPlan(clusterId: string, planId: string) {
  const planDetailsRequest = await fetch(
    `http://localhost:3000/clusters/${clusterId}/plans/${planId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
  const planDetailsResponse: PlanDetails = await planDetailsRequest.json();
  return planDetailsResponse;
}

async function eleba() {
  const { data } = await getSession();
  const postReq = await fetch("http://localhost:3000/clusters/myClusters", {
    method: "POST",
    body: JSON.stringify({
      userId: data?.user.id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const postRes = await postReq.json();
  const fetchedClustIds = postRes.map((clust: any) => clust.clusterId);
  const promise: clusterDetailsType[] = await Promise.all(
    fetchedClustIds.map((clust: any) => fetchCluster(clust)),
  );
  return promise;
}

const getUserDetails = async () => {
  const { data } = await getSession();
  const userRequest = await fetch(
    `http://localhost:3000/userData?id=${data?.user.id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
  const userResponse = await userRequest.json();
  return userResponse;
};

async function getUserPlans() {
  const { data } = await getSession();
  const userPlansRequest = await fetch(
    `http://localhost:3000/users/${data?.user.id}/plans`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const userPlansResponse: PlanByUser[] = await userPlansRequest.json();
  const requiredIds = userPlansResponse.map((plan) => ({
    planId: plan.id,
    clustId: plan.cluster.id,
  }));
  const results = await Promise.all(
    requiredIds.map(({ planId, clustId }) => fetchPlan(clustId, planId)),
  );
  return results;
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

export const useMyClusters = () => {
  const {
    data: clusterResponse,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["userClusters"],
    queryFn: eleba,
    staleTime: 1 * 60 * 60 * 1000,
  });

  return { clusterResponse, isLoading, isSuccess };
};

export const useMyPlans = () => {
  const {
    data: userPlans,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["userPlans"],
    queryFn: getUserPlans,
    staleTime: 1 * 60 * 60 * 1000,
  });

  return {
    userPlans,
    isLoading,
    isSuccess,
  };
};

export const useMyUserData = () => {
  const {
    data: userDetails,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["userDetails"],
    queryFn: getUserDetails,
    staleTime: 1 * 60 * 60 * 1000,
  });

  return {
    userDetails,
    isLoading,
    isSuccess,
  };
};
