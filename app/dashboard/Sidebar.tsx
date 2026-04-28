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
          <p className="p-2 text-2xl">GrouPay</p>
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
