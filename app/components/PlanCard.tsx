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
      className={`border ${className} flex shrink-0 border-card-border relative rounded-2xl`}
    >
      <div>
        <img
          src="/family.jpg"
          className="md:h-48 lg:h-60 h-44 w-full object-cover rounded-2xl"
        />
      </div>
      <div className="absolute bottom-0 h-[90%] z-20 bg-white rounded-2xl border-2 border-card-border w-full shadow-xl shadow-card-border p-2 grid">
        <p className="flex items-center gap-x-2 md:flex-row flex-col">
          <span
            className={`${soraClass} flex items-center font-bold text-11px md:text-[12px] lg:text-[20px] text-green md:w-4/5 overflow-y-hidden `}
          >
            {name ? name : "PlanName"}
          </span>
          <span className="md:text-[8px] lg:text-[11px] text-ink-mid font-bold text-end uppercase bg-aqua/40 rounded-full p-2 text-[7px]">
            {planType ? planType : "general"}
          </span>
        </p>
        <p className="hidden md:block indent-4 lg:px-4 px-2 clusterDesc overflow-y-hidden text-ellipsis max-h-20 text-ink-mid lg:text-[12px] md:text-[10px] text-justify ">
          {desc
            ? desc
            : "Plan Desc: Lorem ipsum dolor sit amet consectetur adipisicing elit.Voluptatem, tenetur iusto nostrum neque mollitia temporibus sequi molestias dolorum dolores sit, ratione rerum. At, iure blanditiisneque in architecto animi recusandae"}
        </p>
        <div className="flex items-center md:flex-row flex-col">
          <div className={`${minimumContribution ? "w-1/2" : "w-5/6"} w-full`}>
            <p className="text-[10px] text-ink-mid">
              Members: {members ? members.length : 6}
            </p>
            <div className="flex items-end self-end">
              <div
                className={`avatars flex mt-1 ${minimumContribution ? `w-4/5` : `w-5/6`} items-center`}
              >
                <Avatars members={members} />
              </div>
            </div>
          </div>
          {minimumContribution && (
            <div className="text-right md:w-1/3 w-full flex flex-col justify-end">
              <p className="md:text-sm text-[10px]">
                &#8358; {minimumContribution}
              </p>
              <p className="lg:text-[10px] text-[7px] text-ink-mid">
                Avg. Contribution
              </p>
            </div>
          )}

          <div className="flex justify-end md:w-1/6 w-full">
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
