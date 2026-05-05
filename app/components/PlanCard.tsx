import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { soraClass } from "../fonts";
import Link from "next/link";

export default function PlanCard({ className }: { className?: string }) {
  return (
    <Link
      href="/cluster/234/plans/101"
      className={`border ${className} flex shrink-0 border-card-border relative rounded-2xl`}
    >
      <div>
        <img
          src="/family.jpg"
          className="md:h-60 w-full object-cover rounded-2xl"
        />
      </div>
      <div className="absolute bottom-0 h-[90%] z-20 bg-white rounded-2xl border-2 border-card-border w-full shadow-xl shadow-card-border p-2 grid text-justify">
        <p className="flex items-center gap-x-2">
          <span
            className={`${soraClass} flex items-center font-bold text-[20px] text-green w-4/5 overflow-y-hidden h-5 `}
          >
            PlanName
          </span>
          <span className="text-[11px] text-ink-mid font-bold text-end uppercase bg-aqua/40 rounded-full p-2">
            subscription
          </span>
        </p>
        <p className="indent-4 px-4 clusterDesc overflow-y-hidden text-ellipsis max-h-20 text-ink-mid text-[12px] ">
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
                <div className="avatar h-7 w-7 rounded-full flex border-2 border-solid border-white items-center justify-center font-bold -mr-2 bg-yellow-300 text-white">
                  <span className="text-[12px]">C</span>
                </div>
                <div className="avatar h-7 w-7 rounded-full flex border-2 border-solid border-white items-center justify-center font-bold -mr-2 bg-mist text-white">
                  <span className="text-[12px]">A</span>
                </div>
                <div className="avatar h-7 w-7 rounded-full flex border-2 border-solid border-white items-center justify-center font-bold -mr-2 bg-green/80 text-white">
                  <span className="text-[12px]">E</span>
                </div>
                <div className="avatar h-7 w-7 rounded-full border-2 border-solid border-white items-center justify-center font-bold -mr-2 bg-red-400 text-white">
                  <span className="text-[12px]">+3</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right w-1/3">
            <p className="text-sm">&#8358; {(5000).toLocaleString()}</p>
            <p className="text-[10px] text-ink-mid">Avg. Contribution</p>
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
