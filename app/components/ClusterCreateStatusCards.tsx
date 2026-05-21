import {
  ArrowClockwiseIcon,
  CheckCircleIcon,
  ShareNetworkIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { soraClass } from "../fonts";
import Link from "next/link";

export default function ClusterCreateSuccessCard() {
  return (
    <div className="rounded-2xl grid shadow-2xl shadow-card-border py-4 px-6 w-3/5 max-h-3/4 my-4 mx-auto border border-green transition-all hover:scale-105">
      <div className="text-center">
        <div className="flex justify-center">
          <CheckCircleIcon
            className="md:w-18 md:h-18 h-8 w-8 p-2 fill-green"
            weight="duotone"
          />
        </div>
        <p className={`${soraClass} font-bold my-2 text-2xl text-green `}>
          Cluster Created Successfully!{" "}
        </p>
      </div>

      <p className="indent-4 first-letter:text-xl text-justify">
        Your cluster, <span className="font-bold text-green">ClusterName</span>,
        was created successfully. Click{" "}
        <Link href={"/cluster/234/manage"} className="underline">
          here
        </Link>{" "}
        to view and edit your cluster's key details. Click the "Share" button to
        share your cluster's link and add others to your merry band!
      </p>

      <div className="flex justify-end items-center text-white">
        <button className="bg-teal/68 hover:bg-teal/90 transition-all hover:scale-x-105 hover:translate-y-0.5 hover:font-bold flex gap-x-4 items-center p-2 rounded-xl">
          <ShareNetworkIcon weight="light" className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
}

export function ClusterCreateFailureCard() {
  return (
    <div className="rounded-2xl grid shadow-2xl shadow-card-red/70 py-4 px-6 w-3/5 max-h-3/4 my-4 mx-auto border border-red hover:scale-105 transition-all">
      <div className="text-center">
        <div className="flex justify-center">
          <XCircleIcon
            className="md:w-18 md:h-18 h-8 w-8 p-2 fill-red"
            weight="duotone"
          />
        </div>
        <p className={`${soraClass} font-bold my-2 text-2xl text-red`}>
          Failed to Create Cluster{" "}
        </p>
      </div>

      <p className="indent-4 first-letter:text-xl text-justify px-4">
        Your cluster, <span className="font-bold text-red">ClusterName</span>,
        could not be created. Please ensure that all input fields are correctly
        filled and check the quality of your internet connection before trying
        again.
      </p>

      <div className="flex justify-end items-center text-white">
        <button className="bg-white hover:bg-red/90 transition-all hover:scale-x-105 hover:translate-y-0.5 hover:font-bold flex gap-x-4 items-center p-2 rounded-xl hover:text-white text-red border-red border-2">
          <ArrowClockwiseIcon weight="light" className="w-6 h-6" />
          Retry
        </button>
      </div>
    </div>
  );
}
