import {
  InviteRejectedCard,
  InviteAcceptedCard,
} from "@/app/components/JoinStatusCards";
import { soraClass } from "@/app/fonts";
import {
  CheckCircleIcon,
  UsersThreeIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}): Promise<Metadata> => {
  const { id } = await params;
  return {
    title: `Join Cluster ${id}`,
  };
};

export default async function JoinCluster() {
  return (
    <div className="grid items-center h-[90%]">
      <div className="w-4/5 h-[70%] grid mx-auto p-4 my-4 border border-card-border shadow-2xl shadow-card-border rounded-2xl">
        <div className="grid justify-center">
          <UsersThreeIcon
            className="w-18 h-18 rounded-xl p-2 fill-green  bg-green/20"
            weight="duotone"
          />
        </div>
        <p className={`${soraClass} text-2xl my-3 font-bold text-center`}>
          You have been invited by{" "}
          <span className="font-bold underline">ClusterMember</span> to join{" "}
          <span className="font-bold text-green">ClusterName</span>
        </p>

        <div className="border border-card-border shadow-md shadow-card-border flex gap-x-4 items-center p-2 rounded-2xl">
          <div className="flex shrink-0 ">
            <img src="/family.jpg" className="md:w-24 md:h-24 rounded-full" />
          </div>
          <div className="p-1">
            <p className={`${soraClass} font-bold text-xl`}>ClusterName</p>
            <p className="text-ink-mid w-4/5 h-16 overflow-hidden text-clip text-justify my-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
              est nisi aspernatur beatae repudiandae illo commodi blanditiis,
              architecto eligendi eius at sit reprehenderit nemo explicabo sed
              ipsa quibusdam necessitatibus enim.
            </p>
            <p className="text-sm text-ink-mid">
              Created on ClusterCreateDate by @ClusterManager
            </p>
          </div>
        </div>

        <div className="flex place-content-center my-4 gap-x-4">
          <button className="bg-white flex gap-x-2 text-red hover:bg-red hover:text-white p-2 rounded-xl transition-all items-center border border-card-border w-1/4 justify-center text-xl duration-75 hover:scale-105">
            <XIcon />
            <span>Decline</span>
          </button>
          <button className="bg-green hover:bg-greener transition-all duration-75 p-2 rounded-xl text-white flex gap-x-2 items-center justify-center w-1/4 text-xl hover:scale-105">
            <CheckCircleIcon />
            <span>Join</span>
          </button>
        </div>
      </div>
    </div>
  );
}
