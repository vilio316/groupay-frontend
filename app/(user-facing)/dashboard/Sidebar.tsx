"use client";

import { soraClass } from "@/app/fonts";
import { signOut } from "@/lib/authClient";
import { usePathname, redirect } from "next/navigation";
import {
  HouseLineIcon,
  UserIcon,
  UsersThreeIcon,
  ArticleIcon,
  BellIcon,
  GearIcon,
  SignOutIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useNotifications } from "@/app/NotificationsProvider";
import { useSession } from "@/lib/authClient";

const bottomLinks = [{ href: "/settings", label: "Settings", Icon: GearIcon }];

export default function Sidebar() {
  const pathname = usePathname();
  const { data } = useSession();
  const { unreadCount } = useNotifications();

  const navLinks = [
    { href: "/dashboard", label: "Home", Icon: HouseLineIcon },
    { href: "/profile", label: "Profile", Icon: UserIcon },
    { href: "/clusters", label: "Your Clusters", Icon: UsersThreeIcon },
    { href: "/plans", label: "Your Plans", Icon: ArticleIcon },
    {
      href: "/notifications",
      label: "Notifications",
      Icon: BellIcon,
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className="flex flex-col h-screen w-72 mr-4 bg-white border-r border-[#e8efe8] px-3 py-4 shrink-0 z-20"
      style={{ boxShadow: "1px 0 0 0 #e8efe8" }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 px-3 py-2 mb-6">
        <div className="bg-green h-8 w-8 rounded-lg flex items-center justify-center shadow-md shadow-green/25 shrink-0">
          <svg viewBox="0 0 20 20" className="fill-white h-4 w-4">
            <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4zm-1 3v4l3.5 2-.7 1.2L8 12.2V7h1z" />
          </svg>
        </div>
        <Link
          href="/dashboard"
          className={`${soraClass} font-bold text-forest text-[18px] leading-none tracking-tight`}
        >
          GrouPay
        </Link>
      </div>

      {/* ── Section label ── */}
      <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-ink-mid/50 mb-2">
        Menu
      </p>

      {/* ── Main nav ── */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navLinks.map(({ href, label, Icon, badge }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150
                ${
                  active
                    ? "bg-forest text-white shadow-md shadow-forest/20"
                    : "text-ink-mid hover:bg-[#f0f7f0] hover:text-forest"
                }
              `}
            >
              {/* Active left accent bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-green rounded-r-full" />
              )}

              <Icon
                weight={active ? "fill" : "regular"}
                className={`h-4.5 w-4.5 shrink-0 transition-transform duration-150 ${
                  active
                    ? "text-white"
                    : "text-ink-mid group-hover:text-forest group-hover:scale-110"
                }`}
              />

              <span className="flex-1">{label}</span>

              {/* Notification badge */}
              {badge && badge > 0 && (
                <span
                  className={`
                    text-[10px] font-bold min-w-4.5 h-4.5 px-1 rounded-full
                    flex items-center justify-center leading-none
                    ${active ? "bg-green text-white" : "bg-green/15 text-green"}
                  `}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Divider ── */}
      <div className="my-3 h-px bg-[#e8efe8]" />

      {/* ── Bottom: Settings + Sign out ── */}
      <div className="flex flex-col gap-0.5">
        {bottomLinks.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150
                ${
                  active
                    ? "bg-forest text-white shadow-md shadow-forest/20"
                    : "text-ink-mid hover:bg-[#f0f7f0] hover:text-forest"
                }
              `}
            >
              <Icon
                weight={active ? "fill" : "regular"}
                className={`h-4.5 w-4.5 shrink-0 transition-transform duration-150 ${
                  active
                    ? "text-white"
                    : "text-ink-mid group-hover:text-forest group-hover:scale-110"
                }`}
              />
              <span>{label}</span>
            </Link>
          );
        })}

        <button
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-mid hover:bg-red-50 hover:text-red-600 transition-all duration-150 w-full text-left"
          onClick={async (e) => {
            e.preventDefault();
            await signOut({
              fetchOptions: {
                onSuccess: () => redirect("/auth/sign-in"),
              },
            });
          }}
        >
          <SignOutIcon className="h-4.5 w-4.5 shrink-0 text-ink-mid group-hover:text-red-500 group-hover:scale-110 transition-transform duration-150" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* ── User pill at very bottom ── */}
      <div className="mt-3 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#f5faf5] border border-[#e8efe8]">
        <div className="h-8 w-8 rounded-full bg-linear-to-br from-teal to-green flex items-center justify-center text-white text-xs font-bold shrink-0">
          U
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`${soraClass} text-[13px] font-semibold text-forest truncate leading-tight`}
          >
            {data?.user.name ? data.user.name : "User Account"}
          </p>
          <p className="text-[11px] text-ink-mid/70 truncate leading-tight">
            Tier 1
          </p>
        </div>
        <Link
          href="/settings"
          className="shrink-0 text-ink-mid/50 hover:text-forest transition-colors"
          aria-label="Account settings"
        >
          <GearIcon className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
