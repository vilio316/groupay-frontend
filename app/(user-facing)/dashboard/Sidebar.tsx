import { sora } from "@/app/fonts";
import {
  GearIcon,
  HouseLineIcon,
  SignOutIcon,
  UserIcon,
  BellIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function Sidebar() {
  return (
    <>
      <div className="grid border-ink-mid">
        <div>
          <div className="p-2 text-2xl flex gap-x-2">
            <div className="bg-green h-8 w-8 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 20 20" className="fill-white h-6 w-6">
                <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4zm-1 3v4l3.5 2-.7 1.2L8 12.2V7h1z" />
              </svg>
            </div>
            <p className={`${sora.className} font-bold`}>GrouPay</p>
          </div>
          <div className="flex sidebar-link gap-x-2 items-center my-4">
            <HouseLineIcon className="h-12 w-12 p-2" />
            <Link href="/dashboard" className="text-[18px] hover:font-semibold">
              Home
            </Link>
          </div>

          <div className="flex sidebar-link gap-x-2 items-center my-4">
            <UserIcon className="h-12 w-12 p-2" />
            <Link href="/profile" className="text-[18px] hover:font-semibold">
              Profile
            </Link>
          </div>

          <div className="flex sidebar-link gap-x-2 items-center my-4">
            <UsersThreeIcon className="h-12 w-12 p-2" />
            <Link href="/clusters" className="text-[18px] hover:font-semibold">
              Your Clusters
            </Link>
          </div>

          <div className="flex sidebar-link gap-x-2 items-center my-4">
            <BellIcon className="h-12 w-12 p-2" />
            <Link
              href="/notifications"
              className="text-[18px] hover:font-semibold"
            >
              Notifications
            </Link>
          </div>
        </div>
      </div>

      <div className="self-end">
        <div className="flex sidebar-link gap-x-2 items-center my-4">
          <GearIcon className="h-12 w-12 p-2" />
          <Link href="/settings" className="text-[18px] hover:font-semibold">
            Settings
          </Link>
        </div>

        <div className="flex sidebar-link gap-x-2 items-center my-4">
          <SignOutIcon className="h-12 w-12 p-2" />
          <Link href="/" className="text-[18px] hover:font-semibold">
            Sign Out
          </Link>
        </div>
      </div>
    </>
  );
}
