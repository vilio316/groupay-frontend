import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { soraClass } from "../fonts";
import Link from "next/link";
import { clusterDetailsType } from "../(user-facing)/cluster/[id]/ClusterDetailsClient";

export default function ClusterCard({
  className,
  valuesObj,
}: {
  className?: string;
  valuesObj: clusterDetailsType;
}) {
  function mkDt(string: string) {
    const date = new Date(string).toLocaleDateString();
    return date;
  }

  return (
    <Link
      href={`/cluster/${valuesObj ? valuesObj.id : "/234"}`}
      className={`border ${className} flex shrink-0 border-card-border relative rounded-2xl`}
    >
      <div>
        <img
          src="/family.jpg"
          className="md:h-48 lg:h-60 h-44 w-full object-cover rounded-2xl"
        />
      </div>
      <div className="absolute bottom-0 h-3/4 z-20 bg-white rounded-2xl border-2 border-card-border w-full shadow-xl shadow-card-border p-2 grid text-justify md:text-left">
        <p className="flex items-center gap-x-1">
          <span
            className={`${soraClass} flex items-center font-bold text-sm md:text-[16px] lg:text-[20px] text-green w-4/5`}
          >
            {valuesObj ? valuesObj.name : "ClusterName"}
          </span>
        </p>
        <p className="text-[10px]">
          Created on: {valuesObj ? mkDt(valuesObj.createdAt) : "22/04/23"}
        </p>
        <p className="indent-4 px-4 clusterDesc overflow-y-hidden text-ellipsis max-h-20 text-ink-mid text-[10px] md:text-sm ">
          {valuesObj ? valuesObj.desc : "Lorem ipsum dolor amet ...."}
        </p>
        <div className="flex items-end self-end w-full">
          <div className="w-full flex justify-end">
            <ArrowRightIcon
              className="text-2xl hover:scale-125 transition-all p-1 text-teal  cursor-pointer"
              weight="bold"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
