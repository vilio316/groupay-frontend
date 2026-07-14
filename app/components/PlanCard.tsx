import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { soraClass } from "../fonts";
import Link from "next/link";
import Avatars from "./AvatarsCircles";
import { PlanDetails } from "../(user-facing)/cluster/[id]/ClusterDetailsClient";

export default function PlanCard({
  className,
  planObject,
}: {
  className?: string;
  planObject: PlanDetails;
}) {
  const { id, desc, name, members, clusterId, planType, minimumContribution } =
    planObject;

  return (
    <Link
      href={`/cluster/${clusterId}/plans/${id}`}
      className={`border ${className && className} flex shrink-0 border-card-border relative rounded-xl bg-white overflow-hidden`}
    >
      <div>
        <img
          src="/family.jpg"
          className="md:h-48 lg:h-60 h-50 w-full object-cover rounded-xl"
        />
      </div>
      <div className="absolute bottom-0 h-[90%] z-20 bg-white rounded-xl border-2 border-card-border w-full shadow-card p-2 grid overflow-hidden">
        <p className="flex items-center gap-x-1 min-w-0">
          <span
            className={`${soraClass} font-bold text-sm md:text-base lg:text-lg text-green truncate min-w-0`}
          >
            {name ? name : "PlanName"}
          </span>
          <span className="text-[9px] lg:text-[10px] text-ink-mid font-semibold uppercase bg-aqua/40 rounded-full px-2 py-0.5 shrink-0">
            {planType ? planType : "general"}
          </span>
        </p>
        <p className="hidden md:block text-ink-mid text-xs px-2 line-clamp-3 leading-relaxed">
          {desc
            ? desc
            : "Plan Desc: Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, tenetur iusto nostrum neque mollitia temporibus sequi molestias dolorum dolores sit."}
        </p>
        <div className="flex items-end self-end w-full mt-auto">
          <div className="flex-1 min-w-0">
            {members && members.length > 0 && (
              <p className="text-[10px] text-ink-mid">
                {members.length} {members.length === 1 ? "Member" : "Members"}
              </p>
            )}
            <Avatars members={members} className="mt-0.5" />
          </div>
          {minimumContribution && (
            <div className="text-right shrink-0 ml-2">
              <p className="text-xs font-semibold text-forest">
                &#8358; {Number(minimumContribution).toLocaleString()}
              </p>
              <p className="text-[9px] text-ink-mid">Avg. Contribution</p>
            </div>
          )}
          <ArrowRightIcon
            className="text-xl hover:scale-125 transition-all ml-2 text-teal shrink-0"
            weight="bold"
          />
        </div>
      </div>
    </Link>
  );
}
