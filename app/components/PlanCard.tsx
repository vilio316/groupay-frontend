import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { soraClass } from "../fonts";
import Link from "next/link";
import Avatars from "./AvatarsCircles";

export default function PlanCard({ className }: { className?: string }) {
  return (
    <Link
      href="/plans/101"
      className={`border ${className} flex shrink-0 border-card-border relative rounded-2xl`}
    >
      <div>
        <img
          src="/family.jpg"
          className="md:h-48 lg:h-60 w-full object-cover rounded-2xl"
        />
      </div>
      <div className="absolute bottom-0 h-[90%] z-20 bg-white rounded-2xl border-2 border-card-border w-full shadow-xl shadow-card-border p-2 grid text-justify">
        <p className="flex items-center gap-x-2">
          <span
            className={`${soraClass} flex items-center font-bold text-10px md:text-[12px] lg:text-[20px] text-green w-4/5 overflow-y-hidden h-5 `}
          >
            PlanName
          </span>
          <span className="md:text-[8px] lg:text-[11px] text-ink-mid font-bold text-end uppercase bg-aqua/40 rounded-full p-2 text-[7px]">
            subscription
          </span>
        </p>
        <p className="hidden md:block indent-4 lg:px-4 px-2 clusterDesc overflow-y-hidden text-ellipsis max-h-20 text-ink-mid lg:text-[12px] md:text-[10px] ">
          Plan Desc: Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Voluptatem, tenetur iusto nostrum neque mollitia temporibus sequi
          molestias dolorum dolores sit, ratione rerum. At, iure blanditiis
          neque in architecto animi recusandae.
        </p>
        <div className="flex items-center">
          <div className="w-1/2">
            <p className="text-[10px] text-ink-mid">6 Members</p>
            <div className="flex items-end self-end">
              <div className="avatars flex mt-1 w-4/5 items-center">
                <Avatars />
              </div>
            </div>
          </div>
          <div className="text-right w-1/3">
            <p className="text-sm">&#8358; {(5000).toLocaleString()}</p>
            <p className="lg:text-[10px] text-[7px] text-ink-mid">
              Avg. Contribution
            </p>
          </div>

          <div className="flex justify-end w-1/6">
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
