import { soraClass } from "@/app/fonts";
import Link from "next/link";

export default function MembersPage() {
  return (
    <div className="mx-auto my-4">
      <div className="grid md:grid-cols-5 grid-cols-4 items-center p-1">
        <p
          className={`my-4 text-2xl ${soraClass} font-bold text-green md:col-span-4 col-span-3`}
        >
          <Link href="/plan/101">PlanName</Link> / Members
        </p>
        <span className="col-span-1 rounded-xl text-center justify-self-end text-red hover:bg-red hover:text-white p-2 hover:scale-105 transition-all uppercase">
          exit plan
        </span>
      </div>
      <input
        type="text"
        className="text-xl border border-card-border focus:border-green transition-all indent-4 p-3 rounded-xl w-4/5 outline-none"
        placeholder="Search by GrouPay Tag..."
      />
      <p className={`text-xl p-2 ${soraClass}`}>
        <span>22</span> Members
      </p>
      <div>
        <div className="flex gap-x-4 items-center hover:bg-green/50 bg-green/20 rounded-xl p-2 my-3 group transition-all ">
          <div className="p-1">
            <img
              className="w-12 h-12 rounded-full object-cover user-display-img border border-aqua"
              src="/family.jpg"
            />
          </div>
          <div className="w-[80%]">
            <p>You</p>
            <p>@username | userStatus</p>
          </div>
          <div></div>
        </div>
        <MemberCard />
        <MemberCard />
        <MemberCard />
      </div>
    </div>
  );
}

export function MemberCard() {
  return (
    <div className="flex gap-x-4 items-center hover:bg-aqua/20 rounded-xl p-2 my-3 group ">
      <div className="p-1">
        <img
          className="w-12 h-12 rounded-full object-cover user-display-img border border-aqua"
          src="/family.jpg"
        />
      </div>
      <div className="w-[80%]">
        <p>DisplayName</p>
        <p>@username | userStatus</p>
      </div>
      <div></div>
    </div>
  );
}
