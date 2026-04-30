import ClusterCard from "@/app/components/ClusterCard";
import { soraClass } from "@/app/fonts";
import { PlusIcon, UsersThreeIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function ClustersPage() {
  return (
    <div className="min-h-full">
      <p className={`${soraClass} font-bold text-green text-3xl my-3`}>
        Your Clusters
      </p>{" "}
      <div className="clusterBody mx-auto p-4 border border-card-border grid justify-center text-center rounded-lg">
        <div className="grid justify-center p-2">
          <UsersThreeIcon
            className="h-18 w-18 fill-green bg-green/20 p-2 rounded-xl"
            weight="duotone"
          />
        </div>
        <p className="text-center text-2xl font-bold my-2">No Clusters Yet</p>
        <p>
          You haven't joined or created any clusters yet. Create your first
          cluster now and add other users too!
        </p>

        <Link
          href="/clusters/new"
          className="flex justify-self-center items-center p-2 gap-x-2 bg-green rounded-xl w-auto my-4 text-white hover:font-bold hover:bg-greener hover:translate-y-0.5 transition-all"
        >
          <PlusIcon weight="bold" />
          Create Cluster
        </Link>
      </div>
      <div className="grid md:grid-cols-4 p-2 gap-x-3">
        <ClusterCard />
        <ClusterCard />
        <ClusterCard />
        <ClusterCard />
      </div>
    </div>
  );
}
