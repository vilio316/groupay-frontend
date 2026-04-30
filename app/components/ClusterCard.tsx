import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { soraClass } from "../fonts";
import Link from "next/link";

export default function ClusterCard({ className }: { className?: string }) {
  return (
    <Link
      href="/cluster/234"
      className={`border ${className} flex shrink-0 border-card-border relative rounded-2xl`}
    >
      <div>
        <img
          src="/family.jpg"
          className="md:h-60 w-full object-cover rounded-2xl"
        />
      </div>
      <div className="absolute bottom-0 h-3/4 z-20 bg-white rounded-2xl border-2 border-card-border w-full shadow-xl shadow-card-border p-2 grid text-justify">
        <p className="flex items-center gap-x-1">
          <span
            className={`${soraClass} flex items-center font-bold text-[20px] text-green w-3/5`}
          >
            ClusterName
          </span>
          <span className="text-sm font-normal text-right">6 Members</span>
        </p>
        <p className="indent-4 px-4 clusterDesc overflow-y-hidden text-ellipsis max-h-20 text-ink-mid text-[12px] ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem,
          tenetur iusto nostrum neque mollitia temporibus sequi molestias
          dolorum dolores sit, ratione rerum. At, iure blanditiis neque in
          architecto animi recusandae.
        </p>
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

          <div className="w-1/5 flex justify-end">
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
