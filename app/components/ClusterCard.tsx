import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { soraClass } from "../fonts";
import Link from "next/link";
import { clusterDetailsType } from "../(user-facing)/cluster/[id]/ClusterDetailsClient";
import Avatars from "./AvatarsCircles";

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
      className={`border ${className} flex shrink-0 border-card-border relative rounded-xl bg-white overflow-hidden`}
    >
      <div>
        <img
          src="/family.jpg"
          className="md:h-48 lg:h-60 h-44 w-full object-cover rounded-xl"
        />
      </div>
      <div className="absolute bottom-0 h-3/4 z-20 bg-white rounded-xl border-2 border-card-border w-full shadow-card p-2 grid overflow-hidden">
        <p className="flex items-center gap-x-1 min-w-0">
          <span
            className={`${soraClass} font-bold text-sm md:text-base lg:text-lg text-green truncate min-w-0`}
          >
            {valuesObj ? valuesObj.name : "ClusterName"}
          </span>
        </p>
        <p className="text-[10px] text-ink-mid">
          Created on: {valuesObj ? mkDt(valuesObj.createdAt) : "22/04/23"}
        </p>
        <p className="text-ink-mid text-xs px-2 line-clamp-3 leading-relaxed">
          {valuesObj ? valuesObj.desc : "Lorem ipsum dolor amet ...."}
        </p>
        <div className="flex items-end self-end w-full">
          <div className="w-3/4">
            <Avatars members={valuesObj.members} />
          </div>
          <div className="w-1/4 flex justify-end">
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
