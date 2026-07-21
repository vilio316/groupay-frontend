import { useQuery } from "@tanstack/react-query";
import { getSession, useSession } from "@/lib/authClient";
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
  senderId: string | null;
  recipientId: string | null;
  type: string;
  direction?: string;
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
  try {
    const clusterDetailsRequest = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/${id}`,
      {
        credentials: "include",
      },
    );
    const clusterDetailsResponse: clusterDetailsType =
      await clusterDetailsRequest.json();
    return clusterDetailsResponse;
  } catch (error) {
    throw new Error("Cluster Details could not be fetched");
  }
}

async function fetchPlan(clusterId: string, planId: string) {
  try {
    const planDetailsRequest = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/${clusterId}/plans/${planId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    const planDetailsResponse: PlanDetails = await planDetailsRequest.json();
    return planDetailsResponse;
  } catch (error) {
    throw new Error("Plan details could not be fetched!");
  }
}

async function getUserClusterDetails() {
  try {
    const { data } = await getSession();
    const postReq = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/myClusters`,
      {
        method: "POST",
        body: JSON.stringify({
          userId: data?.user.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const postRes = await postReq.json();
    const fetchedClustIds = postRes.map((clust: any) => clust.clusterId);
    const promise: clusterDetailsType[] = await Promise.all(
      fetchedClustIds.map((clust: any) => fetchCluster(clust)),
    );
    return promise;
  } catch (error) {
    throw new Error("User's clusters could not be found");
  }
}

const getUserDetails = async () => {
  const { data } = await getSession();
  try {
    const userRequest = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/userData?id=${data?.user.id}`,
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
    throw new Error("User Details could not be found");
  }
};

async function getTransactions(userId?: string) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  try {
    const transactionsRequest = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/transactions${query}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    const transactionsResponse: Transaction[] =
      await transactionsRequest.json();
    return transactionsResponse;
  } catch (error) {
    throw new Error("Transaction data could not be retrieved");
  }
}

async function getUserPlans() {
  const { data } = await getSession();
  try {
    const userPlansRequest = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${data?.user.id}/plans`,
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
  } catch (error) {
    throw new Error("An error occurred. The user plans could not be retrieved");
  }
}

export const useClusterDetails = (id: string) => {
  const {
    data: clusterDetailsResponse,
    isSuccess,
    isLoading,
    isError: clusterDetailsError,
    refetch: refetchCluster,
  } = useQuery({
    queryKey: ["cluster", id],
    queryFn: async () => await fetchCluster(id),
    staleTime: 1 * 60 * 60 * 1000,
  });

  return {
    clusterDetailsResponse,
    isSuccess,
    isLoading,
    clusterDetailsError,
    refetchCluster,
  };
};

export const usePlanDetails = (clusterId: string, planId: string) => {
  const {
    data: planResponse,
    isSuccess,
    isLoading,
    isError: planDetailsError,
    refetch: refetchPlan,
  } = useQuery({
    queryKey: ["plan", planId],
    queryFn: async () => await fetchPlan(clusterId, planId),
    staleTime: 1 * 60 * 60 * 1000,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  return { planResponse, isSuccess, isLoading, planDetailsError, refetchPlan };
};

export const useMyClusters = () => {
  const {
    data: clusterResponse,
    isLoading,
    isSuccess,
    isError: myClustersError,
    refetch: refetchMyClusters,
  } = useQuery({
    queryKey: ["userClusters"],
    queryFn: getUserClusterDetails,
    staleTime: 1 * 60 * 60 * 1000,
  });

  return {
    clusterResponse,
    isLoading,
    isSuccess,
    myClustersError,
    refetchMyClusters,
  };
};

export const useMyPlans = () => {
  const {
    data: userPlans,
    isLoading,
    isSuccess,
    isError: myPlansError,
    refetch: refetchMyPlans,
  } = useQuery({
    queryKey: ["userPlans"],
    queryFn: getUserPlans,
    staleTime: 1 * 60 * 60 * 1000,
  });

  return {
    userPlans,
    isLoading,
    isSuccess,
    myPlansError,
    refetchMyPlans,
  };
};

export const useMyUserData = () => {
  const {
    data: userDetails,
    isLoading,
    isSuccess,
    isError: myDataError,
    refetch: refetchUserData,
  } = useQuery({
    queryKey: ["userDetails"],
    queryFn: getUserDetails,
    staleTime: 1 * 60 * 60 * 1000,
  });

  return {
    userDetails,
    isLoading,
    isSuccess,
    myDataError,
    refetchUserData,
  };
};

export const useMyAccountDetails = () => {
  const {
    isFetching,
    data: accountDetails,
    isSuccess,
    isLoading,
    isError: accountDetailsError,
    refetch: refetchAccount,
  } = useQuery({
    queryKey: ["account_details"],
    queryFn: async () => {
      try {
        const { data } = await getSession();
        const account_details_request = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/userData/account/${data?.user.id}`,
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
    accountDetailsError,
    refetchAccount,
  };
};

export const usePinStatus = () => {
  const { data: session } = useSession();
  const {
    data: pinStatus,
    isLoading,
    isSuccess,
    refetch,
    isError: PINError,
  } = useQuery({
    queryKey: ["pinStatus"],
    queryFn: async () => {
      if (!session?.user?.id) return { hasPin: false };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/pin/status/${session.user.id}`,
        { credentials: "include" },
      );
      if (!res.ok) return { hasPin: false };
      return res.json();
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    hasPin: pinStatus?.hasPin ?? false,
    isLoading,
    isSuccess,
    refetch,
    PINError,
  };
};

export const useTransactions = (userId?: string) => {
  const {
    data: transactionData,
    isLoading: isGettingTxns,
    isSuccess: transactionsGotten,
    isError: transactionsError,
    refetch: refetchTxns,
  } = useQuery({
    queryKey: ["transactions", userId],
    queryFn: () => getTransactions(userId),
    staleTime: 1 * 60 * 60 * 1000,
    enabled: !!userId,
  });

  return {
    transactionData,
    isGettingTxns,
    transactionsGotten,
    transactionsError,
    refetchTxns,
  };
};
