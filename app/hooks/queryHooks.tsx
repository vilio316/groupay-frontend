import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/authClient";
import type { PlanByUser } from "../(user-facing)/plans/page";
import {
  clusterDetailsType,
  User,
} from "../(user-facing)/cluster/[id]/ClusterDetailsClient";
import { PlanDetails } from "../(user-facing)/cluster/[id]/ClusterDetailsClient";

interface Transaction {
  id: string;
  clusterId: string | null;
  planId: string | null;
  transactionRef: string;
  transactionHeading: string;
  amount: number;
  channel: string;
  status: string;
  createdAt: string;
}

type UserDetails = User & {
  clusters: {
    id: string;
    clusterId: string;
    userId: string;
    joinedAt: string;
  }[];
};

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
  try {
    const userRequest = await fetch(
      `http://localhost:3000/userData?id=${data?.user.id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    const userResponse: UserDetails = await userRequest.json();
    return userResponse;
  } catch (error) {
    console.log(error);
    return null;
  }
};

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
  const transactionsResponse: Transaction[] = await transactionsRequest.json();
  return transactionsResponse;
}

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

export const useMyAccountDetails = () => {
  const {
    isFetching,
    data: accountDetails,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["account_details"],
    queryFn: async () => {
      try {
        const { data } = await getSession();
        const account_details_request = await fetch(
          `http://localhost:3000/userData/account/${data?.user.id}`,
          {
            credentials: "include",
          },
        );
        const account_details_response = await account_details_request.json();
        return account_details_response;
      } catch (error) {
        throw new Error("An error occured while fetching your query details");
      }
    },
    staleTime: 2 * 60 * 60 * 1000,
  });

  return {
    accountDetails,
    isSuccess,
    isFetching,
    isLoading,
  };
};

export const useTransactions = () => {
  const {
    data: transactionData,
    isLoading: isGettingTxns,
    isSuccess: transactionsGotten,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    staleTime: 1 * 60 * 60 * 1000,
  });

  return {
    transactionData,
    isGettingTxns,
    transactionsGotten,
  };
};
