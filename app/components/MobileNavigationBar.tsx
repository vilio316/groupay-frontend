"use client";
import {
  ArticleIcon,
  HouseIcon,
  PlusCircleIcon,
  UserIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import Link from "next/link";

export default function MobileNav() {
  return (
    <div className="absolute -bottom-3 md:hidden p-1 grid-cols-5 grid z-50 bg-white w-screen justify-center justify-items-center items-center gap-x-4">
      <Link
        href="/dashboard"
        className="grid justify-center justify-items-center text-center p-1 hover:text-green "
      >
        <HouseIcon className="text-xl font-bold block" />
        <span className="w-full">Home</span>
      </Link>
      <Link
        href="/clusters"
        className="grid justify-center justify-items-center p-1 hover:text-green"
      >
        <UsersThreeIcon className="text-xl font-bold" />
        <span>Clusters </span>
      </Link>
      <Link
        href="/clusters/new"
        className="grid justify-center justify-items-center p-1 hover:text-green"
      >
        {" "}
        <PlusCircleIcon className="h-14 w-14 text-white bg-green text-xl p-1 rounded-full z-70" />
      </Link>
      <Link
        href="/plans"
        className="grid justify-center justify-items-center p-1 hover:text-green"
      >
        <ArticleIcon className="text-xl font-bold" />
        <span>Plans</span>
      </Link>
      <Link
        href="/profile"
        className="grid justify-center p-1 hover:text-green justify-items-center"
      >
        <UserIcon className="text-xl font-bold" />
        <span>Profile</span>
      </Link>
    </div>
  );
}
